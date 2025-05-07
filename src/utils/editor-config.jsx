// 导入渲染组件
import { ElButton, ElInput, ElSelect, ElOption, ElSwitch, ElRate } from 'element-plus'
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
// 文本
registerConfig.register({
  label: '文本',
  key: 'text',
  preview: () => <span>预览文本</span>,
  render: (renderProps) => {
    if (renderProps && Object.keys(renderProps.props).length !== 0) return <span style={{ color: renderProps.props.color, fontSize: renderProps.props.size + 'px' }}>{renderProps.props.text}</span>
    else return <span>默认内容</span>
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
// 按钮
registerConfig.register({
  label: '按钮',
  text: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: (renderProps) => {
    if (renderProps && Object.keys(renderProps.props).length !== 0) {
      return <ElButton style={Object.keys(renderProps.size).length !== 0 ? { height: renderProps.size.height + 'px', width: renderProps.size.width + 'px' } : {}} type={renderProps.props.type} size={renderProps.props.size}>{renderProps.props.text}</ElButton>
    } else return (<ElButton style={Object.keys(renderProps.size).length !== 0 ? { height: renderProps.size.height + 'px', width: renderProps.size.width + 'px' } : {}}>按钮大小</ElButton>)
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

  },
  // 伸缩选项
  resize: {
    width: true,
    height: true
  }
})
// 输入框
registerConfig.register({
  label: '输入框',
  text: '输入框',
  preview: () => <ElInput placeholder="预览输入框"></ElInput>,
  render: (renderProps) => {
    if (renderProps) {
      return (
    <ElInput
      placeholder='默认内容'
      size={renderProps.props?.size}
      modelValue={renderProps.model?.default?.modelValue}
      onUpdate:modelValue={renderProps.model?.default?.['onUpdate:modelValue']}
    />
      )
    } else {
      return <ElInput placeholder='默认内容' />
    }
  },
  key: 'input',
  model: { // 默认绑定
    default: '绑定字段'
  },

  props: {
    size: createSelector('输入框尺寸', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' }
    ])
  },
  // 伸缩选项
  resize: {
    width: true
  }
})
// 下拉框
registerConfig.register({
  label: '下拉框',
  text: '下拉框',
  preview: () => <ElSelect placeholder="请选择" style="width: 100%"></ElSelect>,
  render: (renderProps) => {
    if (renderProps && Object.keys(renderProps.props).length !== 0 && Object.keys(renderProps.model).length !== 0) {
      return (

        <ElSelect
          {...renderProps.model.default}
          style="width: 240px"
          placeholder='请选择'
        >
                {(renderProps.props.options || []).map((option, index) => {
                  const optionValue = String(option.value)
                  return (
                        <ElOption
                            key={index}
                            label={option.label}
                            value={optionValue}
                        />
                  )
                })}
        </ElSelect>

      )
    } else {
      return (
        <ElSelect style="width: 240px" placeholder='请选择'></ElSelect>
      )
    }
  },
  key: 'selector',
  props: {
    options: createTable('下拉选项', {
      options: [
        { label: '显示值', field: 'label' },
        { label: '绑定值', field: 'value' }
      ],
      key: 'label'
    }),
    size: createSelector('下拉框尺寸', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' }
    ])
  },
  model: {
    default: '绑定数据' // 默认值设为空字符串
  }
})
// 按钮
registerConfig.register({
  label: '开关',
  key: 'switch',
  preview: () => <ElSwitch />,
  render: () => {
    return <ElSwitch />
  },
  props: {
  }
})
// 评分
registerConfig.register({
  label: '评分',
  key: 'rate',
  preview: () => <ElRate />,
  render: () => {
    return <ElRate />
  },
  props: {
  }
})
