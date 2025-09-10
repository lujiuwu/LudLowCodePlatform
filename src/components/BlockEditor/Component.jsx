import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import { BlockResize } from '../BlockResize'

// 渲染单个组件
export default defineComponent({
  props: {
    block: { type: Object },
    formData: { type: Object }
  },
  setup (props, ctx) {
    const currentBlock = computed({
      get: () => props.block,
      set: (newValue) => {
        ctx.emit('update:block', newValue)
      }
    })
    const currentFormData = computed({
      get: () => props.formData,
      set: (newValue) => {
        ctx.emit('update:formData', newValue)
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
        // 确保居中计算时使用正确的坐标
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
      const renderProps = {
        // 新增size属性
        size: props.block.hasResize ? { width: props.block.width, height: props.block.height } : {},
        props: props.block.props,
        model: Object.keys(component.model || {}).reduce((prev, modelName) => {
          const propName = currentBlock.value.model[modelName]
          prev[modelName] = {
            modelValue: currentFormData.value[propName],
            'onUpdate:modelValue': v => {
              currentFormData.value[propName] = v
            }
          }
          return prev
        }, {})
      }
      const RenderComponent = component.render(renderProps)
      const { width, height } = component.resize || {}
      return (
    <div draggable ref={blockRef} style={componentStyle.value}>
          {RenderComponent}
          {/* 根据配置信息添加锚点 */}
          {props.block.focus && (width || height) && <BlockResize class='block-resize' block={props.block} component={component}>
          </BlockResize>}
    </div>
      )
    }
  }
})
