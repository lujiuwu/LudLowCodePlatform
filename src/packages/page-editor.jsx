import { computed, defineComponent, inject, ref } from 'vue'
// element-plus布局组件
import { ElHeader, ElAside, ElMain, ElContainer } from 'element-plus'
import './page-style.scss'
// 导入单个组件
import EditorBlock from './editor-block'
import { useMenuDragger } from './useMenuDragger'
import { useFocus } from './useFocus'
import { useBlockDrag } from './useBlockDrag'
export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  setup (props, ctx) {
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
    const pageStyle = computed(() => (
      {
        width: data.value.container.width + 'px',
        height: data.value.container.height + 'px'
      }
    ))

    const componentList = inject('config').componentList
    const containerRef = ref(null)
    // 新建组件
    const { DragFunction, DragEndFunction } = useMenuDragger(containerRef, data)
    // 内部拖拽组件

    const { BlockMouseDown, BlocksObj, OuterMouseDown } = useFocus(data, (e) => {
      const { InnerMouseDown } = useBlockDrag(BlocksObj)
      InnerMouseDown(e)
    })
    return () => (
      <div id="editor-page">
        <ElContainer id="outer-container">
          <ElAside width="250px" class="component-aside">
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
            <ElHeader height="40px">header</ElHeader>
            <ElMain>
              <div
                class="main-page"
                style={pageStyle.value}
                ref={containerRef}
                onMousedown={OuterMouseDown}
              >

                {/* 此处渲染单个组件 */}
                {
                  (data.value.blocks.map(block => (
                    <EditorBlock
                      block={block}
                      onMousedown={e => BlockMouseDown(e, block)}
                      class={block.focus ? 'main-page-item--focus' : 'main-page-item'}
                    ></EditorBlock>
                  )
                  ))
                }
              </div>
            </ElMain>
          </ElContainer>
          <ElAside width="250px">组件样式</ElAside>
        </ElContainer>
      </div>
    )
  }
})
