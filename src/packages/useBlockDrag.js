export function useBlockDrag (BlocksObj) {
  const dragState = {
    startX: 0,
    startY: 0
  }
  // 内部拖拽组件
  function KeyMouseMove (e) {
    const { clientX: moveX, clientY: moveY } = e
    const duX = moveX - dragState.startX
    const duY = moveY - dragState.startY
    BlocksObj.value.focusBlocks.forEach((block, index) => {
      block.top = dragState.startPos[index].top + duY
      block.left = dragState.startPos[index].left + duX
    })
  }
  function KeyMouseUp (e) {
    document.removeEventListener('mousemove', KeyMouseMove)
    document.removeEventListener('mouseup', KeyMouseUp)
  }
  function InnerMouseDown (e) {
    dragState.startX = e.clientX
    dragState.startY = e.clientY
    console.log('dragState', dragState)
    dragState.startPos = BlocksObj.value.focusBlocks.map(({ top, left }) => ({ top, left }))
    document.addEventListener('mousemove', KeyMouseMove)
    document.addEventListener('mouseup', KeyMouseUp)
  }
  return {
    InnerMouseDown
  }
}
