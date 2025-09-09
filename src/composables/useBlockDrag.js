import { reactive } from 'vue'
import { events } from '@/packages/events'

export function useBlockDrag (BlocksObj, LastSelectedBlock, containerRef) {
  const dragState = {
    startX: 0,
    startY: 0,
    dragging: false // 是否正在拖拽
  }
  const markLine = reactive({
    x: null,
    y: null
  })
  // 内部拖拽组件
  function KeyMouseMove (e) {
    // 支持触摸事件和鼠标事件
    const isTouch = e.type === 'touchmove'
    let moveX, moveY

    if (isTouch) {
      e.preventDefault() // 阻止默认的滚动行为
      moveX = e.touches[0].clientX
      moveY = e.touches[0].clientY
    } else {
      moveX = e.clientX
      moveY = e.clientY
    }
    if (!dragState.dragging) {
      dragState.dragging = true
      events.emit('start') // 触发事件
    }
    // 计算当前元素最新的left和top
    const left = moveX - dragState.startX + dragState.startLeft
    const top = moveY - dragState.startY + dragState.startTop
    let y = top + e.target.offsetHeight / 2
    let x = left + e.target.offsetWidth / 2
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { top: t, showTop: s } = dragState.lines.y[i]
      if (Math.abs(t - top) < 5) {
        y = s
        moveY = dragState.startY - dragState.startTop + t
        break
      }
    }
    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: t, showLeft: s } = dragState.lines.x[i]
      if (Math.abs(t - left) < 5) {
        x = s
        moveX = dragState.startX - dragState.startLeft + t
        break
      }
    }
    markLine.x = x
    markLine.y = y
    const duX = moveX - dragState.startX
    const duY = moveY - dragState.startY
    BlocksObj.value.focusBlocks.forEach((block, index) => {
      block.top = dragState.startPos[index].top + duY
      block.left = dragState.startPos[index].left + duX
    })
  }
  function KeyMouseUp (e) {
    // 移除鼠标和触摸事件监听器
    document.removeEventListener('mousemove', KeyMouseMove)
    document.removeEventListener('mouseup', KeyMouseUp)
    document.removeEventListener('touchmove', KeyMouseMove)
    document.removeEventListener('touchend', KeyMouseUp)

    if (dragState.dragging) {
      events.emit('end')
    }
    markLine.x = null
    markLine.y = null
  }
  function InnerMouseDown (e) {
    // 支持触摸事件和鼠标事件
    const isTouch = e.type === 'touchstart'
    let startX, startY

    if (isTouch) {
      e.preventDefault() // 阻止默认的滚动行为
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    } else {
      startX = e.clientX
      startY = e.clientY
    }
    const { width: currentBlockWidth, height: currentBlockHeight } = LastSelectedBlock.value
    dragState.dragging = false
    dragState.startX = startX
    dragState.startY = startY
    dragState.startPos = BlocksObj.value.focusBlocks.map(({ top, left }) => ({ top, left }))
    dragState.startLeft = LastSelectedBlock.value.left
    dragState.startTop = LastSelectedBlock.value.top
    dragState.lines = (() => {
      // 我们要计算是相对没选中元素的信息
      const { unfocusBlocks } = BlocksObj.value
      const lines = { x: [], y: [] }
      const blocks = [...unfocusBlocks, {
        top: 0,
        left: 0,
        width: containerRef.value.width,
        hight: containerRef.value.height
      }]
      blocks.forEach(block => {
        const { top: otherTop, left: otherLeft, width: otherWidth, height: otherHeight } = block
        // 当元素拖拽到与其他元素top一致时，显示这根辅助线
        lines.y.push({ showTop: otherTop, top: otherTop })
        // 当元素底部与其他元素顶部一致
        lines.y.push({ showTop: otherTop, top: otherTop - currentBlockHeight })
        // 当元素与其余元素中线一致
        lines.y.push({ showTop: otherTop + otherHeight / 2, top: otherTop + otherHeight / 2 - currentBlockHeight / 2 })
        // 底对顶
        lines.y.push({ showTop: otherTop + otherHeight, top: otherTop + otherHeight })
        // 底部对底部
        lines.y.push({ showTop: otherTop + otherHeight, top: otherTop + otherHeight - currentBlockHeight })

        lines.x.push({ showLeft: otherLeft, left: otherLeft })
        lines.x.push({ showTop: otherLeft + otherWidth / 2, top: otherLeft + otherWidth / 2 - currentBlockWidth / 2 })
        lines.x.push({ showLeft: otherLeft + otherWidth, left: otherLeft + otherWidth })
        lines.x.push({ showLeft: otherLeft + otherWidth, left: otherLeft + otherWidth - currentBlockWidth })
        lines.x.push({ showLeft: otherLeft, left: otherLeft - currentBlockWidth })
      })
      return lines
    })()
    // 添加鼠标和触摸事件监听器
    document.addEventListener('mousemove', KeyMouseMove)
    document.addEventListener('mouseup', KeyMouseUp)
    document.addEventListener('touchmove', KeyMouseMove, { passive: false })
    document.addEventListener('touchend', KeyMouseUp)
  }
  return {
    InnerMouseDown,
    markLine
  }
}
