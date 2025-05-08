import { computed, defineComponent, inject, ref, Transition, onMounted } from 'vue'
// element-plus布局组件
import { ElHeader, ElAside, ElMain, ElContainer, ElRow } from 'element-plus'
// 导入单个组件
import EditorBlock from '@/components/editor/editor-block'
import EditorMenuBtn from '@/components/editor/editor-menu-btn'
// 导入方法
import { useMenuDragger } from '@/hooks/useMenuDragger'
import { useFocus } from '@/hooks/useFocus'
import { useBlockDrag } from '@/hooks/useBlockDrag'
import { useCommand } from '@/hooks/useCommand'
import { $dialog } from '@/components/editor/Dialog'
import { $dropdown, DropDownItem } from '@/components/editor/DropDown'
// 导入组件
import EditorOperator from '@/components/operator/editor-operator'
import ThemeSelect from '@/components/editor/ThemeSelect'
import BlockTab from '@/components/editor/BlockTab'

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
    const pageStyle = computed(() => (
      {
        width: data.value.container.width + 'px',
        height: data.value.container.height + 'px'
      }
    ))
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
      console.log(currentTab.value)
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
         <ElAside v-show={menuShow.value} style={{ transition: 'width 0.3s ease' }} width={asideWidth.value} class="outer-content__component-aside aside-color">
        {/* 添加tab栏 */}
        <div class='component-aside__row'>
          <div class='component-aside__row__tabs'>
            <BlockTab
            v-model:currentTab={currentTab.value}
            v-model:isOpenAside={isOpenAside.value}
              onUpdate:isOpenAside={(newValue) => {
                isOpenAside.value = newValue
                updateAsideWidth()
              }}
                >
            </BlockTab>
          </div>
          <Transition name='slide'>
            <div class='component-aside__row__components' v-show={isOpenAside.value}>
              {componentList.value.map(component => (
                <div
                  class="component-aside__row__components__item"
                >
                  <div
                    class="component-aside__row__components__item__component"
                    draggable
                    onDragstart={(e) => DragFunction(e, component)}
                    onDragend={(e) => DragEndFunction(e, component)}
                  >
                    {component.preview()}
                  </div>
                  <div class="component-aside__row__components__item__label">
                    {component.label}
                  </div>
                </div>
              ))}
            </div>
          </Transition>
        </div>
         </ElAside>
          <ElContainer class="inner-content box-color">
            <ElHeader v-show={menuShow.value} class="inner-content__header" height="45px">
              {/* 菜单区域 */}
              <ElRow class='inner-content__header__menu'>
                {
                 menuBtns.map(btnInfo => (
                     <EditorMenuBtn class='inner-content__header__menu__btn' btnInfo={btnInfo}></EditorMenuBtn>
                 ))
                }
              {/* 换肤按钮 -- 单独 */}
              <ThemeSelect class='inner-content__header__theme-select'></ThemeSelect>
              </ElRow>
            </ElHeader>
            <ElMain>
              <div
                class="inner-content__main"
                style={pageStyle.value}
                ref={containerRef}
                onMousedown={OuterMouseDown}
              >

                {/* 此处渲染单个组件 */}
                {
                  (data.value.blocks.map((block, index) => (
                    <EditorBlock
                      formData = {props.formData}
                      block={block}
                      onMousedown={e => BlockMouseDown(e, block, index)}
                      class={['inner-content__main__block', block.focus ? 'inner-content__main__item--focus' : 'inner-content__main__item']}
                      onContextmenu = {e => onContextMenuBlock(e, block)}
                    ></EditorBlock>
                  )
                  ))
                }
                {/* 渲两根线 */}
              {markLine.x !== null && <div class="inner-content__main__line-X" style={{ left: markLine.x + 'px' }}></div>}
              {markLine.y !== null && <div class="inner-content__main__line-Y" style={{ top: markLine.y + 'px' }}></div>}
              </div>
            </ElMain>
          </ElContainer>
          <ElAside v-show={menuShow.value} width="220px" class='outer-content__operator-aside aside-color'>
            <EditorOperator
              class='outer-content__operator-aside__form'
              block={LastSelectedBlock.value}
              v-model:data={data.value}
              updateContainer={commandsMap.get('updateContainer')}
              updateBlock={commandsMap.get('updateBlock')}
            ></EditorOperator>
          </ElAside>
        </ElContainer>
      </div>
    )
  }
})
