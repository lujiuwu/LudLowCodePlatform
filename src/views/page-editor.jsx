import { computed, defineComponent, inject, ref, onMounted } from 'vue'
import { ElContainer } from 'element-plus'
import { Header, Main, ComponentsAside, ActionAside } from '@/components'
import { useMenuDragger, useFocus, useBlockDrag, useCommand } from '@/composables'
import { Dialog as $dialog } from '@/components/Dialog'
import { DropDown as $dropdown, DropDownItem } from '@/components/DropDown'

export default defineComponent({
  props: {
    modelValue: { type: Object },
    formData: { type: Object }
  },
  setup (props, ctx) {
    // 预览标识 -- 预览时无法点击组件
    const isPreview = ref(false)
    // 显示菜单标识
    const menuShow = ref(true)
    // 菜单方法
    function onContextMenuBlock (e, block) {
      e.preventDefault()
      $dropdown({
        el: e.target,
        content: () => {
          return <>
            <DropDownItem label='删除' onClick={() => { commandsMap.get('delete')(BlocksObj) }}></DropDownItem>
            <DropDownItem label='置顶' onClick={() => { commandsMap.get('toTop')(BlocksObj) }}></DropDownItem>
            <DropDownItem label='置底' onClick={() => { commandsMap.get('toBottom')(BlocksObj) }}></DropDownItem>
            <DropDownItem label='查看' onClick={() => {
              // 查看弹出框
              $dialog({
                title: '查看',
                content: JSON.stringify(block),
                footer: false
              })
            }}></DropDownItem>
            <DropDownItem label='导入' onClick={() => {
              // 查看弹出框
              $dialog({
                title: '导入',
                content: JSON.stringify(block),
                footer: true,
                onConfirm: (text) => {
                  // 要记录这里的操作
                  commandsMap.get('updateBlock')(JSON.parse(text), block)
                }
              })
            }}></DropDownItem>
          </>
        }
      })
    }
    // 计算显示区域的宽高
    const data = computed({
      get () {
        return props.modelValue
      },
      // 更新数据
      set (newValue) {
        ctx.emit('update:modelValue', newValue)
      }
    })
    // 渲染页面宽高

    // 获取命令
    const { commandsMap } = useCommand(data)
    // 菜单按钮信息
    const menuBtns = [
      { label: '撤销', handler: () => commandsMap.get('撤销')() },
      { label: '重做', handler: () => commandsMap.get('重做')() },
      {
        label: '导入',
        handler: () => {
          $dialog({
            title: '导入json',
            content: '', // 初始内容
            footer: true, // 显示确认/取消按钮
            onConfirm: (text) => {
              const data = JSON.parse(text)
              commandsMap.get('updateContainer')(data)
            }
          })
        }
      },
      {
        label: '导出',
        handler: () => {
          $dialog({
            title: '导出json',
            content: JSON.stringify(data.value),
            footer: false
          })
        }

      },
      { label: '置顶', handler: () => commandsMap.get('toTop')(BlocksObj) },
      { label: '置底', handler: () => commandsMap.get('toBottom')(BlocksObj) },
      { label: '删除', handler: () => commandsMap.get('delete')(BlocksObj) },
      {
        label: () => isPreview.value ? '编辑' : '预览',
        handler: () => {
          isPreview.value = !isPreview.value
          ClearBlockFocus()
        }
      },
      {
        label: () => menuShow.value ? '关闭' : '打开',
        handler: () => {
          menuShow.value = !menuShow.value
        }
      }
    ]
    // 渲染页面ref
    const containerRef = ref(null)
    // 新建组件
    const { DragFunction, DragEndFunction } = useMenuDragger(containerRef, data)
    // 内部拖拽组件
    const { BlockMouseDown, BlocksObj, OuterMouseDown, LastSelectedBlock, ClearBlockFocus } = useFocus(data, isPreview, menuShow, (e) => {
      InnerMouseDown(e)
    })
    // tab栏信息
    const currentTab = ref('basicComponent')
    const componentList = computed(() => {
      return inject('config').componentList[currentTab.value] || []
    })
    // 打开/收起左侧边栏
    const isOpenAside = ref(true)
    const tabsRef = ref(null) // 用于引用 component-aside__row__tabs 元素
    const asideWidth = ref('280px') // 初始宽度
    // 计算 ElAside 收起时的宽度
    const collapsedWidth = computed(() => {
      return tabsRef.value ? tabsRef.value.offsetWidth + 'px' : '60px'
    })

    // 动态更新 asideWidth
    const updateAsideWidth = () => {
      asideWidth.value = isOpenAside.value ? '280px' : collapsedWidth.value
    }

    onMounted(() => {
      // 初始化宽度
      updateAsideWidth()
    })

    const { InnerMouseDown, markLine } = useBlockDrag(BlocksObj, LastSelectedBlock, containerRef)
    return () => (
      <div id="pageEditor">
        <ElContainer class="outer-content main-color">
          <ComponentsAside
            v-show={menuShow.value}
            width={asideWidth.value}
            isOpenAside={isOpenAside.value}
            componentList={componentList.value}
            DragFunction={DragFunction}
            DragEndFunction={DragEndFunction}
          >
          </ComponentsAside>
          <ElContainer class="inner-content box-color flex flex-col">
            <Header v-show={menuShow.value} btnContent={menuBtns}></Header>
            <Main
              modelValue={data.value}
              formData={props.formData}
              isPreview={isPreview.value}
              menuShow={menuShow.value}
              onContextMenuBlock={onContextMenuBlock}
              containerRef={containerRef}
              OuterMouseDown={OuterMouseDown}
              BlockMouseDown={BlockMouseDown}
              markLine={markLine}>
            </Main>
          </ElContainer>
          <ActionAside
            v-show={menuShow.value}
            LastSelectedBlock={LastSelectedBlock.value}
            v-model:data={data.value}
            updateContainer={commandsMap.get('updateContainer')}
            updateBlock={commandsMap.get('updateBlock')}
          ></ActionAside>
        </ElContainer>
      </div>
    )
  }
})
