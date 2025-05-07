import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    block: { type: Object },
    component: { type: Object }
  },
  setup (props, ctx) {
    // 计算属性
    const block = computed({
      get () { return props.block },
      set (newValue) { ctx.emit('update:block', newValue) }
    })
    let data = {}
    function MousemoveFunction (e) {
      let { clientX, clientY } = e
      const { startX, startY, startWidth, startHeight, direction, startTop, startLeft } = data

      // 角度/方向处理
      if (direction.horizontal === 'center') {
        clientX = startX
      }
      if (direction.vertical === 'center') {
        clientY = startY
      }
      let duX = clientX - startX
      let duY = clientY - startY

      if (direction.vertical === 'start') {
        duY = -duY
        block.value.top = startTop - duY
      }
      if (direction.horizontal === 'start') {
        duX = -duX
        block.value.left = startLeft - duX
      }

      const width = startWidth + duX
      const height = startHeight + duY
      // 更新宽高
      block.value.width = width
      block.value.height = height
      block.value.hasResize = true
    }
    function MouseupFunction () {
      document.body.removeEventListener('mousemove', MousemoveFunction)
      document.body.removeEventListener('mouseup', MouseupFunction)
    }
    function onMouseDownFunction (e, direction) {
      e.stopPropagation()
      // 初始化
      data = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startTop: props.block.top,
        startLeft: props.block.left,
        direction
      }
      document.body.addEventListener('mousemove', MousemoveFunction)
      document.body.addEventListener('mouseup', MouseupFunction)
    }
    const { width, height } = props.component.resize || {}
    return () => {
      return <>
        {width && <>
          <div class='block-resize block-resize-left' onMousedown={e => onMouseDownFunction(e, { horizontal: 'start', vertical: 'center' })}></div>
          <div class='block-resize block-resize-right' onMousedown={e => onMouseDownFunction(e, { horizontal: 'end', vertical: 'center' })}></div>

        </>}
                {height && <>
          <div class='block-resize block-resize-top' onMousedown={e => onMouseDownFunction(e, { horizontal: 'center', vertical: 'start' })}></div>
          <div class='block-resize block-resize-bottom' onMousedown={e => onMouseDownFunction(e, { horizontal: 'center', vertical: 'end' })}></div>

        </>}
        {width && height && <>
          <div class='block-resize block-resize-top-left' onMousedown={e => onMouseDownFunction(e, { horizontal: 'start', vertical: 'start' })}></div>
          <div class='block-resize block-resize-top-right' onMousedown={e => onMouseDownFunction(e, { horizontal: 'end', vertical: 'start' })}></div>
          <div class='block-resize block-resize-bottom-left' onMousedown={e => onMouseDownFunction(e, { horizontal: 'start', vertical: 'end' })}></div>
          <div class='block-resize block-resize-bottom-right' onMousedown={e => onMouseDownFunction(e, { horizontal: 'end', vertical: 'end' })}></div>

          </>}
      </>
    }
  }
})
