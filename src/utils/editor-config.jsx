// 导入渲染组件
import { ElButton, ElInput, ElSelect } from 'element-plus'
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
// 创建一个输入框
const createInput = (label) => ({ type: 'input', label })
// 更新颜色
const createColor = (label) => ({ type: 'color', label })
// 下拉菜单
const createSelector = (label, options) => ({ type: 'selector', label, options })
// 表格渲染
const createTable = (label, table) => ({ type: 'table', label, table })
registerConfig.register({
  label: '文本',
  key: 'text',
  preview: () => '预览文本',
  render: (props) => {
    if (props) return <span style={{ color: props.color, fontSize: props.size }}>{props.text}</span>
    else return '默认内容'
  },
  props: {
    text: createInput('文本内容'),
    color: createColor('文本颜色'),
    size: createSelector('字体大小', [
      { label: '14px', value: '14px' },
      { label: '20px', value: '20px' }
    ])
  }
})
registerConfig.register({
  label: '按钮',
  text: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: (props) => {
    if (props) return <ElButton size={props.buttonSize} type={props.buttonType}>{props.text}</ElButton>
    else return <ElButton>默认内容</ElButton>
  },
  key: 'button',
  props: {
    text: createInput('按钮内容'),
    buttonType: createSelector('按钮类型', [
      { label: '默认', value: 'default' },
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '信息', value: 'info' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' }
    ]),
    buttonSize: createSelector('按钮大小', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' }
    ])

  }
})
registerConfig.register({
  label: '输入框',
  text: '输入框',
  preview: () => <ElInput placeholder="预览输入框"></ElInput>,
  render: (props) => {
    if (props) return <ElInput placeholder='默认内容' size={props.size} v-model={props.text}></ElInput>
    else return <ElInput placeholder='默认内容'></ElInput>
  },
  key: 'input',
  model: {
    default: ''
  },

  props: {
    text: createInput('绑定字段'),
    size: createSelector('输入框尺寸', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' }
    ])
  }
})
registerConfig.register({
  label: '下拉框',
  text: '下拉框',
  preview: () => <ElSelect></ElSelect>,
  render: () => <ElSelect></ElSelect>,

  key: 'select',
  props: {
    options: createTable('下拉选项', {
      options: [
        { label: '显示值', filed: 'label' },
        { label: '绑定值', filed: 'value' }
      ],
      // 显示给用户的值
      type: 'label'
    }),
    size: createSelector('下拉框尺寸', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' }
    ])
  }
})
