// Dialog.jsx
import { ElDialog, ElButton, ElInput, ElMessage } from 'element-plus'
import { createVNode, defineComponent, reactive, render } from 'vue'

const DialogComponent = defineComponent({
  name: 'DialogComponent',
  props: {
    option: { type: Object }
  },
  setup (props, ctx) {
    const state = reactive({
      option: {
        ...props.option,
        content: props.option.content || '' // 确保content有默认值
      },
      isShow: false
    })

    ctx.expose({
      showDialog (option) {
        state.option = {
          ...option,
          content: option.content || '' // 确保content有默认值
        }
        state.isShow = true
      }
    })

    const inputSize = {
      minRows: 5,
      maxRows: 10
    }

    function onSuccess () {
      state.option.onConfirm && state.option.onConfirm(state.option.content)
      state.isShow = false
    }

    function onFail () {
      state.isShow = false
    }

    function onCopy () {
      navigator.clipboard.writeText(state.option.content)
        .then(() => ElMessage.success('已复制到剪贴板'))
        .catch(err => ElMessage.error('复制失败: ' + err.message))
    }

    return () => (
      <ElDialog v-model={state.isShow} title={state.option.title}>
        {{
          default: () => (
            <ElInput
              type="textarea"
              v-model={state.option.content}
              placeholder="请输入json内容"
              autosize={inputSize}
            />
          ),
          footer: () => (
            <div class="dialog-footer">
              {state.option.footer
                ? (
                <>
                  <ElButton type="primary" onClick={onSuccess}>
                    确认
                  </ElButton>
                  <ElButton onClick={onFail}>取消</ElButton>
                </>
                  )
                : (
                <>
                  <ElButton type="primary" onClick={onCopy}>
                    复制
                  </ElButton>
                  <ElButton onClick={onFail}>关闭</ElButton>
                </>
                  )}
            </div>
          )
        }}
      </ElDialog>
    )
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
