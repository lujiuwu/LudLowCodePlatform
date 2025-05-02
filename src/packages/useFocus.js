import { computed } from 'vue'

export function useFocus (data, callback) {
  // 清空函数
  function ClearBlockFocus () {
    data.value.blocks.forEach(block => { block.focus = false })
  }
  // 内部拖拽
  function BlockMouseDown (e, block) {
    // 阻止默认效果
    e.preventDefault()
    e.stopPropagation()
    // 1. 不按shift 每次点击前要清空之前的效果
    // 2. 判断shift 实现多选
    if (e.shiftKey) block.focus = !block.focus
    else {
      ClearBlockFocus()
      // focus焦点；获取后变为true
      !block.focus ? block.focus = true : block.focus = false
    }
    // 调用回调函数
    callback(e)
  }
  // 计算哪些属性被选中
  const BlocksObj = computed(() => {
    const focusBlocks = []
    const unfocusBlocks = []
    data.value.blocks.forEach(block => { block.focus ? focusBlocks.push(block) : unfocusBlocks.push(block) })
    return { focusBlocks, unfocusBlocks }
  })
  // 点击外部容器 -- 清空所有选中
  function OuterMouseDown () {
    ClearBlockFocus()
  }
  return {
    BlockMouseDown,
    BlocksObj,
    OuterMouseDown
  }
}
