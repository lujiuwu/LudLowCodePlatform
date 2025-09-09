import { computed, ref } from 'vue'

export function useFocus (data, isPreview, menuShow, callback) {
  // 当前点击的元素
  const currentSelectedBlock = ref(-1)
  // 初始值为-1 表示没有任何元素被选中
  const LastSelectedBlock = computed(() => data.value.blocks[currentSelectedBlock.value])
  // 清空函数
  function ClearBlockFocus () {
    data.value.blocks.forEach(block => { block.focus = false })
  }
  // 内部拖拽
  function BlockMouseDown (e, block, index) {
    if (isPreview.value) return

    // 支持触摸事件和鼠标事件
    const isTouch = e.type === 'touchstart'

    // 阻止默认效果
    e.preventDefault()
    e.stopPropagation()

    // 对于触摸事件，检查是否是多点触控（忽略多点触控）
    if (isTouch && e.touches.length > 1) {
      return
    }
    // 1. 不按shift 每次点击前要清空之前的效果
    // 2. 判断shift 实现多选（触摸事件不支持shift键）
    if (!isTouch && e.shiftKey) {
      // 如果只选择一个，不改变状态
      if (BlocksObj.value.focusBlocks.length <= 1) block.focus = true
      else block.focus = !block.focus
    } else {
      ClearBlockFocus()
      // focus焦点；获取后变为true
      !block.focus ? block.focus = true : block.focus = false
    }
    // 调用回调函数
    currentSelectedBlock.value = index
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
    if (!menuShow.value) menuShow.value = true
    if (isPreview.value) return
    ClearBlockFocus()
    currentSelectedBlock.value = -1
  }
  return {
    BlockMouseDown,
    BlocksObj,
    OuterMouseDown,
    LastSelectedBlock,
    ClearBlockFocus
  }
}
