// 导入基础组件配置
import { basicComponents } from '../types/basic.js'
// 组件列表
// 建立映射关系
function createEditionConfig () {
  // 组件列表
  const componentList = {
    basic: [],
    layout: [],
    feedBack: []
  }
  const componentMap = new Map()
  return {
    componentList,
    componentMap,
    register: (component) => {
      if (component.type === 'basic') {
        componentList.basic.push(component)
      } else if (component.type === 'page') {
        componentList.layout.push(component)
      } else {
        componentList.feedBack.push(component)
      }
      componentMap.set(component.key, component)
    }
  }
}

// 注册映射关系
export const registerConfig = createEditionConfig()

// 自动注册基础组件
basicComponents.forEach(component => {
  registerConfig.register(component)
})
