// 导入渲染组件
import { ElButton, ElInput, ElSelect, ElOption, ElSwitch } from 'element-plus'
import { createInput, createColor, createSelector, createTable } from './style'
// 基础组件配置
export const basicComponents = [
  // 文本组件
  {
    label: '文本',
    key: 'text',
    type: 'basic',
    preview: () => <span class='preview'>默认文本</span>,
    render: (renderProps) => {
      if (renderProps && Object.keys(renderProps.props).length !== 0) return <span style={{ color: renderProps.props.color, fontSize: renderProps.props.size + 'px' }}>{renderProps.props.text}</span>
      else return <span>默认文本</span>
    },
    props: {
      text: createInput('文本内容'),
      color: createColor('文本颜色'),
      size: createSelector('字体大小', [
        { label: '14px', value: '14px' },
        { label: '20px', value: '20px' }
      ])
    }
  },
  // 按钮组件
  {
    label: '按钮',
    text: '按钮',
    type: 'basic',
    preview: () => <ElButton class='preview'>默认文本</ElButton>,
    render: (renderProps) => {
      if (renderProps && Object.keys(renderProps.props).length !== 0) {
        return <ElButton style={Object.keys(renderProps.size).length !== 0 ? { height: renderProps.size.height + 'px', width: renderProps.size.width + 'px' } : {}} type={renderProps.props.type} size={renderProps.props.size}>{renderProps.props.text}</ElButton>
      } else return (<ElButton style={Object.keys(renderProps.size).length !== 0 ? { height: renderProps.size.height + 'px', width: renderProps.size.width + 'px' } : {}}>默认文本</ElButton>)
    },
    key: 'button',
    props: {
      text: createInput('默认文本'),
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
  },
  // 输入框组件
  {
    label: '输入框',
    text: '输入框',
    type: 'basic',
    preview: () => <ElInput class='preview' placeholder="默认文本"></ElInput>,
    render: (renderProps) => {
      if (renderProps) {
        return (
      <ElInput
        placeholder='默认文本'
        size={renderProps.props?.size}
        modelValue={renderProps.model?.default?.modelValue}
        onUpdate:modelValue={renderProps.model?.default?.['onUpdate:modelValue']}
      />
        )
      } else {
        return <ElInput placeholder='默认文本' />
      }
    },
    key: 'input',
    model: { // 默认绑定
      default: '默认文本'
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
  },
  // 下拉框组件
  {
    label: '下拉框',
    text: '下拉框',
    type: 'basic',
    preview: () => <ElSelect class='preview' placeholder="默认文本" style="width: 100%"></ElSelect>,
    render: (renderProps) => {
      if (renderProps && Object.keys(renderProps.props).length !== 0 && Object.keys(renderProps.model).length !== 0) {
        return (
          <ElSelect
            {...renderProps.model.default}
            style="width: 172px"
            placeholder='默认文本'
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
          <ElSelect style="width: 172px" placeholder='默认文本'></ElSelect>
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
  },
  // 开关组件
  {
    label: '开关',
    key: 'switch',
    type: 'basic',
    preview: () => <ElSwitch class='preview' />,
    render: () => {
      return <ElSwitch />
    },
    props: {
    }
  }
]

export default basicComponents
