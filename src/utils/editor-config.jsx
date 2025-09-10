import { basicComponents } from '../types/basic.js'
import { layoutComponents } from '../types/layout.js'
import { feedbackComponents } from '../types/feedback.js'
import { myComponents } from '../types/my.js'

function createEditionConfig () {
  const componentList = {
    basic: [],
    layout: [],
    feedBack: [],
    my: []
  }
  const componentMap = new Map()
  return {
    componentList,
    componentMap,
    register: (component) => {
      if (component.type === 'basic') {
        componentList.basic.push(component)
      } else if (component.type === 'layout') {
        componentList.layout.push(component)
      } else if (component.type === 'feedBack') {
        componentList.feedBack.push(component)
      } else if (component.type === 'my') {
        componentList.my.push(component)
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

layoutComponents.forEach(component => {
  registerConfig.register(component)
})

feedbackComponents.forEach(component => {
  registerConfig.register(component)
})

myComponents.forEach(component => {
  registerConfig.register(component)
})
