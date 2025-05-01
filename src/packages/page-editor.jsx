import { computed, defineComponent, inject } from 'vue'
// element-plus布局组件
import { ElHeader, ElAside, ElMain, ElContainer } from 'element-plus'
import './page-style.scss'
// 导入单个组件
import EditorBlock from './editor-block'
export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  setup (props) {
    // 计算显示区域的宽高
    const data = computed({
      get () {
        return props.modelValue
      }
    })
    const pageStyle = computed(() => (
      {
        width: data.value.container.width + 'px',
        height: data.value.container.height + 'px'
      }
    ))
    const componentList = inject('config').componentList
    return () => (
      <div id="editor-page">
        <ElContainer id="outer-container">
          <ElAside width="250px" class="component-aside">
            {componentList.map(component => (
              <div draggable class="component-aside-item">
                 <div class="label">{component.label}</div>
                 <div>{component.render()}</div>
              </div>
            ))}
          </ElAside>
          <ElContainer id="inner-container">
            <ElHeader height="40px">header</ElHeader>
            <ElMain>
              <div class="main-page" style={pageStyle.value}>
                {/* 此处渲染单个组件 */}
                {
                  (data.value.blocks.map(block => (
                    <EditorBlock block={block}></EditorBlock>
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
