// 发布订阅模式 -- 监听撤销前后的状态
import mitt from 'mitt'

// 导出一个发布订阅的对象
export const events = mitt()
