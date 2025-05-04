import { ElDialog, ElButton, ElInput } from 'element-plus'
import { createVNode, defineComponent, reactive, render } from 'vue'

const DialogComponent = defineComponent({
  name: 'DialogComponent', // Add a multi-word name here
  props: {
    option: { type: Object }
  },
  setup (props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false
    })
    ctx.expose({
      // 更新选项
      showDialog (option) {
        state.option = option
        state.isShow = true
      }
    })
    // 文本框尺寸设置
    const inputSize = {
      minRows: 5, maxRows: 10
    }
    // 确认方法
    function onSuccess () {
      state.option.onConfirm && state.option.onConfirm(state.option.content)
      state.isShow = false
    }
    // 取消方法
    function onFail () {
      state.isShow = false
      console.log('取消')
    }
    return () => {
      return <ElDialog v-model={state.isShow} title={state.option.title}>
        {/* 插槽 */}
        {{
          default: () => <ElInput
            type='textarea'
            v-model={state.option.content}
            placeholder={'请输入json内容'}
            autosize={inputSize}
          ></ElInput>,
          footer: () => <div class='dialog-footer'>
            <ElButton type='primary' onClick={onSuccess}>确认</ElButton>
            <ElButton onClick={onFail}>取消</ElButton>
          </div>
        }}
      </ElDialog>
    }
  }
})
let vm
export function $dialog (option) {
  if (!vm) {
    const el = document.createElement('div')
    vm = createVNode(DialogComponent, { option })
    document.body.appendChild((render(vm, el), el))
  }

  const { showDialog } = vm.component.exposed
  showDialog(option)
}
