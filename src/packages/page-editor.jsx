import { computed, defineComponent, inject, ref } from 'vue'
// element-plus布局组件
import { ElHeader, ElAside, ElMain, ElContainer, ElRow } from 'element-plus'
import './page-style.scss'
// 导入单个组件
import EditorBlock from './editor-block'
import EditorMenuBtn from './editor-menu-btn'
// 导入方法
import { useMenuDragger } from './useMenuDragger'
import { useFocus } from './useFocus'
import { useBlockDrag } from './useBlockDrag'
import { useCommand } from './useCommand'
import { $dialog } from '@/components/Dialog'
import { $dropdown, DropDownItem } from '@/components/DropDown'
import EditorOperator from './editor-operator'
export default defineComponent({
  props: {
    modelValue: { type: Object }
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
    // 传递组件列表到子组件
    const componentList = inject('config').componentList
    // 渲染页面ref
    const containerRef = ref(null)
    // 新建组件
    const { DragFunction, DragEndFunction } = useMenuDragger(containerRef, data)
    // 内部拖拽组件
    const { BlockMouseDown, BlocksObj, OuterMouseDown, LastSelectedBlock, ClearBlockFocus } = useFocus(data, isPreview, menuShow, (e) => {
      InnerMouseDown(e)
    })
    const { InnerMouseDown, markLine } = useBlockDrag(BlocksObj, LastSelectedBlock, containerRef)
    return () => (
      <div id="editor-page">
        <ElContainer id="outer-container">
          <ElAside v-show={menuShow.value} width="250px" class="component-aside">
            {componentList.map(component => (
              <div
                class="component-aside-item"
              >
                <div class="label">{component.label}</div>
                <div
                  class="component"
                  draggable
                  onDragstart={e => DragFunction(e, component)}
                  onDragend={e => DragEndFunction(e, component)}
                >{component.render()}</div>
              </div>
            ))}
          </ElAside>
          <ElContainer id="inner-container">
            <ElHeader v-show={menuShow.value} class="header" height="40px">
              {/* 菜单区域 */}
              <ElRow gutter={10}>
                {
                 menuBtns.map(btnInfo => (
                     <EditorMenuBtn class="header-menu-btn" btnInfo={btnInfo}></EditorMenuBtn>
                 ))
                }
              </ElRow>
            </ElHeader>
            <ElMain>
              <div
                class="main-page"
                style={pageStyle.value}
                ref={containerRef}
                onMousedown={OuterMouseDown}
              >

                {/* 此处渲染单个组件 */}
                {
                  (data.value.blocks.map((block, index) => (
                    <EditorBlock
                      block={block}
                      onMousedown={e => BlockMouseDown(e, block, index)}
                      class={block.focus ? 'main-page-item--focus' : 'main-page-item'}
                      onContextmenu = {e => onContextMenuBlock(e, block)}
                    ></EditorBlock>
                  )
                  ))
                }
                {/* 渲两根线 */}
              {markLine.x !== null && <div class="line-x" style={{ left: markLine.x + 'px' }}></div>}
              {markLine.y !== null && <div class="line-y" style={{ top: markLine.y + 'px' }}></div>}
              </div>
            </ElMain>
          </ElContainer>
          <ElAside v-show={menuShow.value} width="250px">
            <EditorOperator
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
