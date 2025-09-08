import { onUnmounted } from 'vue'
import { events } from '@/packages/events'

export function useCommand (data) {
  // 命令函数
  const state = {
    current: -1, // 前进后退的索引值
    commandQueue: [], // 操作命令队列
    commandsMap: new Map(), // 操作命令映射表
    commandsArray: [], // 获取所有命令
    destroyList: [] // 销毁方法数组
  }
  // 注册函数
  const register = (command) => {
    state.commandsArray.push(command)
    state.commandsMap.set(command.name, (...args) => {
      const { redo, undo } = command.execute(...args)
      redo()
      // 把需要的操作放入队列
      if (!command.isPushQueue) return
      let { commandQueue: queue, current } = state
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1)
        state.commandQueue = queue
      }
      queue.push({ redo, undo })
      state.current = current + 1
    })
  }
  // 撤销方法
  register({
    name: '撤销',
    keyboard: 'ctrl+z',
    execute: () => {
      return {
        redo () {
          // 撤销操作
          if (state.current === -1) return
          const item = state.commandQueue[state.current]
          if (item) {
            item.undo && item.undo()
            state.current--
          }
        }
      }
    }
  })
  // 重做方法
  register({
    name: '重做',
    keyboard: 'ctrl+y',
    execute: () => {
      return {
        redo () {
        // 重做操作
          const item = state.commandQueue[state.current + 1]
          if (item) {
            item.redo && item.redo()
            state.current++
          }
        }
      }
    }
  })
  // 更新方法 -- 导入导出时触发
  register({
    // 更新整个容器
    name: 'updateContainer',
    isPushQueue: true,
    execute (newValue) {
      const state = { before: data.value, after: newValue }
      return {
        redo: () => {
          data.value = state.after
        },
        undo: () => {
          data.value = state.before
        }
      }
    }
  })
  // 更新单个组件
  register({
    // 更新整个容器
    name: 'updateBlock',
    isPushQueue: true,
    execute (newBlock, oldBlock) {
      const state = {
        before: data.value.blocks,
        after: (() => {
          const blocks = [...data.value.blocks]
          const index = data.value.blocks.indexOf(oldBlock)
          if (index > -1) { blocks.splice(index, 1, newBlock) }
          return blocks
        })()
      }
      return {
        redo: () => {
          data.value = { ...data.value, blocks: state.after }
        },
        undo: () => {
          data.value = { ...data.value, blocks: state.before }
        }
      }
    }
  })
  // 修改drag命令的execute
  register({
    name: 'drag',
    isPushQueue: true,
    init () {
      this.before = null
      const start = () => {
        this.before = JSON.parse(JSON.stringify(data.value.blocks))
      }
      const end = () => state.commandsMap.get('drag')()
      events.on('start', start)
      events.on('end', end)
      return () => {
        events.off('start', start)
        events.off('end', end)
      }
    },
    execute () {
      const before = this.before
      const after = JSON.parse(JSON.stringify(data.value.blocks)) // 深拷贝
      return {
        redo () {
          data.value.blocks = after // 只修改blocks部分
        },
        undo () {
          data.value.blocks = before // 只修改blocks部分
        }
      }
    }
  })
  // 置顶
  register({
    name: 'toTop',
    isPushQueue: true,
    execute (BlocksObj) {
      // 获取当前选中的元素
      const { focusBlocks, unfocusBlocks } = BlocksObj.value
      const topIndex = unfocusBlocks.reduce((prev, block) => { return Math.max(prev, block.zIndex) }, -Infinity)
      // 保存修改前的z-index，以便撤销
      const originalZIndices = focusBlocks.map(block => block.zIndex)

      // 修改z-index
      focusBlocks.forEach(block => { block.zIndex = topIndex + 1 })
      return {
        redo: () => {
          focusBlocks.forEach(block => { block.zIndex = topIndex + 1 })
        },
        undo: () => {
          focusBlocks.forEach((block, index) => {
            block.zIndex = originalZIndices[index]
          })
        }
      }
    }
  })
  // 置底
  register({
    name: 'toBottom',
    isPushQueue: true,
    execute (BlocksObj) {
      // 获取当前选中的元素
      const { focusBlocks, unfocusBlocks } = BlocksObj.value
      const bottomIndex = unfocusBlocks.reduce((prev, block) => { return Math.min(prev, block.zIndex) }, Infinity)
      // 保存修改前的z-index，以便撤销
      const originalZIndices = focusBlocks.map(block => block.zIndex)

      // 修改z-index
      focusBlocks.forEach(block => { block.zIndex = bottomIndex - 1 })
      return {
        redo: () => {
          focusBlocks.forEach(block => { block.zIndex = bottomIndex - 1 })
        },
        undo: () => {
          focusBlocks.forEach((block, index) => {
            block.zIndex = originalZIndices[index]
          })
        }
      }
    }
  })
  // 删除
  register({
    name: 'delete',
    isPushQueue: true,
    execute (BlocksObj) {
      const { unfocusBlocks } = BlocksObj.value
      const state = {
        before: JSON.parse(JSON.stringify(data.value.blocks)),
        after: unfocusBlocks
      }
      return {
        redo: () => { data.value.blocks = state.after },
        undo: () => { data.value.blocks = state.before }
      }
    }
  })
  // 监控键盘 -- 快捷键操作
  function keyboardEvent () {
    const keyCodes = {
      90: 'z',
      89: 'y'
    }
    const onKeyDown = (e) => {
      const { ctrlKey, keyCode } = e
      let keyString = []
      if (ctrlKey) keyString.push('ctrl')
      keyString.push(keyCodes[keyCode])
      keyString = keyString.join('+')
      state.commandsArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return
        if (keyboard === keyString) {
          state.commandsMap.get(name)()
          e.preventDefault()
        }
      })
    }
    const init = () => {
      window.addEventListener('keydown', onKeyDown)
      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    return init
  }
  // 统一初始化
  ; (() => {
    // 监听键盘事件
    state.destroyList.push(keyboardEvent())
    state.commandsArray.forEach(command => command.init && state.destroyList.push(command.init()))
  })()
  // 统一销毁
  onUnmounted(() => {
    state.destroyList.forEach(fn => fn && fn())
  })
  return state
}
