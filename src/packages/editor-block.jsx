import { computed, defineComponent, inject, onMounted, ref } from 'vue'

// 渲染单个组件
export default defineComponent({
  props: {
    block: { type: Object }
  },
  setup (props, ctx) {
    const currentBlock = computed({
      get: () => props.block,
      set: (newValue) => {
        ctx.emit('update:block', newValue)
      }
    })
    const config = inject('config')

    const componentStyle = computed(() => ({
      top: currentBlock.value.top + 'px',
      left: currentBlock.value.left + 'px',
      zIndex: currentBlock.value.zIndex
    }))
    const blockRef = ref(null)
    // 渲染完毕后需要居中显示
    onMounted(() => {
      const { offsetWidth, offsetHeight } = blockRef.value
      if (currentBlock.value.alignCenter) {
        currentBlock.value.left = currentBlock.value.left - offsetWidth / 2
        currentBlock.value.top = currentBlock.value.top - offsetHeight / 2
        currentBlock.value.alignCenter = false
      }
      // 在渲染完成之后，就需要给元素添加宽高属性
      currentBlock.value.width = offsetWidth
      currentBlock.value.height = offsetHeight
    })
    return () => {
      const component = config.componentMap.get(currentBlock.value.key)
      if (!component) return null

      // 确保传递完整的props对象
      const componentProps = props.block.props

      const RenderComponent = component.render(componentProps)
      return (
    <div draggable ref={blockRef} style={componentStyle.value}>
      {RenderComponent}
    </div>
      )
    }
  }
})
