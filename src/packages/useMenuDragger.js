import { events } from './events'

export function useMenuDragger (containerRef, data) {
  // 当前拖拽的元素
  let currentComponent = null
  // 拖拽方法
  function DragEnter (e) {
    e.dataTransfer.dropEffect = 'move'
  }
  function DragOver (e) {
    e.preventDefault()
  }
  function DragLeave (e) {
    e.dataTransfer.dropEffect = 'none'
  }
  function Drop (e) {
    // 更新数据
    data.value = {
      ...data.value,
      blocks: data.value.blocks.concat([{
        top: e.offsetY,
        left: e.offsetX,
        label: currentComponent.label,
        text: currentComponent.text,
        key: currentComponent.key,
        alignCenter: true
      }])
    }
    currentComponent = null
  }
  function DragFunction (e, component) {
    // 内部需要实现什么？

    // dragenter -- 进入元素，添加一个移动的标识
    // dragover -- 在目标元素移动过程中必须阻止默认行为
    // dragleave -- 离开元素，必须添加一个禁用标识
    // drop -- 松手后根据拖拽的元素添加一个组价
    containerRef.value.addEventListener('dragenter', DragEnter)
    containerRef.value.addEventListener('dragover', DragOver)
    containerRef.value.addEventListener('dragleave', DragLeave)
    currentComponent = component
    containerRef.value.addEventListener('drop', Drop)

    // 拖拽之前 -- 发布一个事件
    events.emit('start')
  }
  function DragEndFunction (e, component) {
    containerRef.value.removeEventListener('dragenter', DragEnter)
    containerRef.value.removeEventListener('dragover', DragOver)
    containerRef.value.removeEventListener('dragleave', DragLeave)
    containerRef.value.removeEventListener('drop', Drop)

    // 拖拽之后 -- 也需要发布一个事件
    events.emit('end')
  }
  return {
    DragFunction,
    DragEndFunction
  }
}
