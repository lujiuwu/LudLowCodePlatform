import { defineComponent, inject, watch, reactive } from 'vue'
import { ElForm, ElFormItem, ElInputNumber, ElButton, ElInput, ElSelect, ElOption, ElColorPicker } from 'element-plus'
import { TableEditor } from '@/components/TableEditor'

export default defineComponent({
  props: {
    block: { type: Object },
    data: { type: Object },
    updateContainer: { type: Function },
    updateBlock: { type: Function }
  },
  setup (props) {
    const config = inject('config')
    const state = reactive({
      editData: {}
    })
    // 初始化/重置
    const reset = () => {
      if (!props.block) state.editData = JSON.parse(JSON.stringify(props.data.container))
      else {
        state.editData = JSON.parse(JSON.stringify(props.block))
      }
    }
    // 应用方法
    function onApply () {
      if (!props.block) props.updateContainer({ ...props.data, container: state.editData })
      else props.updateBlock(state.editData, props.block)
    }
    watch(() => props.block, reset, { immediate: true })
    return () => {
      const container = []
      if (!props.block) {
        container.push(
          <ElFormItem >
            <span class='label'>容器宽度</span>
          <ElInputNumber
            v-model={state.editData.width}
            step={5}
          />
        </ElFormItem>
        )
        container.push(
          <ElFormItem>
            <span class='label'>容器高度</span>
          <ElInputNumber
            v-model={state.editData.height}
            step={5}
          />
        </ElFormItem>
        )
      } else {
        const component = config.componentMap.get(props.block.key)
        if (component && component.props) {
          container.push(
            Object.entries(component.props).map(([propName, propConfig]) => {
              return <ElFormItem >
                <span class='label'>{propConfig.label}</span>
                {{
                  input: () => <ElInput v-model={state.editData.props[propName]}></ElInput>,
                  color: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                  selector: () =>
                    <ElSelect v-model={state.editData.props[propName]}>
                      {propConfig.options.map(option => {
                        return <ElOption label={option.label} value={option.value}></ElOption>
                      })}
                    </ElSelect>,
                  table: () => <TableEditor propConfig={propConfig} v-model={state.editData.props[propName]}>
s
                  </TableEditor>

                }[propConfig.type]()}
            </ElFormItem>
            })
          )
        }
        // 双向数据绑定
        if (component && component.model) {
          container.push(Object.entries(component.model).map(([modelName, label]) => {
            return <ElFormItem label={label}>
              <ElInput v-model={state.editData.model[modelName]}></ElInput>
            </ElFormItem>
          }))
        }
      }
      return (
        <ElForm labelPosition="top">
          {container}
          <ElFormItem>
            <ElButton type="primary" onClick={() => onApply()}>应用</ElButton>
            <ElButton onClick={reset}>重置</ElButton>
          </ElFormItem>
        </ElForm>)
    }
  }
})
