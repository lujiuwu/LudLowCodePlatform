import { defineComponent, computed } from 'vue'
import { ElMain } from 'element-plus'
import { BlockEditor } from '@/components'

export default defineComponent({
  props: {
    modelValue: { type: Object },
    formData: { type: Object },
    isPreview: { type: Boolean },
    menuShow: { type: Boolean },
    onContextMenuBlock: { type: Function },
    containerRef: { type: Object },
    OuterMouseDown: { type: Function },
    BlockMouseDown: { type: Function },
    markLine: { type: Object }
  },
  setup (props, ctx) {
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
    return () => (
      <ElMain class='overflow-scroll'>
        <div
          class={['inner-content__main']}
          style={pageStyle.value}
          ref={props.containerRef}
          onMousedown={props.OuterMouseDown}
          onTouchstart={props.OuterMouseDown}
        >
          {
            (data.value.blocks.map((block, index) => (
              <BlockEditor
                formData = {props.formData}
                block={block}
                onMousedown={e => props.BlockMouseDown(e, block, index)}
                onTouchstart={e => props.BlockMouseDown(e, block, index)}
                class={['inner-content__main__block', block.focus ? 'inner-content__main__item--focus' : 'inner-content__main__item']}
                onContextmenu = {e => props.onContextMenuBlock(e, block)}
              ></BlockEditor>
            )
            ))
          }
        {props.markLine.x !== null && <div class="inner-content__main__line-X" style={{ left: props.markLine.x + 'px' }}></div>}
        {props.markLine.y !== null && <div class="inner-content__main__line-Y" style={{ top: props.markLine.y + 'px' }}></div>}
        </div>
      </ElMain>
    )
  }
})
