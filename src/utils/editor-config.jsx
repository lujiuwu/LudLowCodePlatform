// 导入渲染组件
import { ElButton, ElInput } from 'element-plus'
// 组件列表
// 建立映射关系
function createEditionConfig () {
  // 组件列表
  const componentList = []
  const componentMap = new Map()
  return {
    componentList,
    componentMap,
    register: (component) => {
      componentList.push(component)
      componentMap.set(component.key, component)
    }
  }
}

// 注册映射关系
export const registerConfig = createEditionConfig()

registerConfig.register({
  label: '文本',
  text: '文本',
  preview: () => '预览文本',
  render: () => '渲染文本',
  key: 'text'
})
registerConfig.register({
  label: '按钮',
  text: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>,
  key: 'button'
})
registerConfig.register({
  label: '输入框',
  text: '输入框',
  preview: () => <ElInput placeholder="预览输入框"></ElInput>,
  render: () => <ElInput placeholder="渲染输入框"></ElInput>,
  key: 'input'
})
