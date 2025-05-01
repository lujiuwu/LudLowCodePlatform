import { defineComponent, inject } from 'vue'

// 渲染单个组件
export default defineComponent({
  props: {
    block: { type: Object }
  },
  setup (props) {
    const config = inject('config')
    const component = config.componentMap.get(props.block.key)
    return () => (
      <div class="main-page-item">{component.render()}</div>
    )
  }
})
