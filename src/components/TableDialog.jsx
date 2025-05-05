import { ElButton, ElDialog } from 'element-plus'
import { createVNode, defineComponent, reactive, render } from 'vue'

const TableDialogComponent = defineComponent({
  name: 'TableDialogComponent',
  props: {
    option: { type: Object }
  },
  setup (props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false,
      editData: []
    })
    ctx.expose({
      showTableDialog (option) {
        state.option = option
        state.isShow = true
        state.editData = JSON.parse(JSON.stringify(option.value))
      }
    })

    return () => {
      return <ElDialog v-model={state.isShow}>
        {{
          default: () => {
            return <div>
              <ElButton type='primary'>添加</ElButton>
              <ElButton>重置</ElButton>
            </div>
          }
        }}
      </ElDialog>
    }
  }
})

let vm
let container
export function $tableDialog (option) {
  if (!vm) {
    container = document.createElement('div')
    vm = createVNode(TableDialogComponent, { option })
    render(vm, container)
    document.body.appendChild(container)
  }
  const { showTableDialog } = vm.component.exposed
  showTableDialog(option)
}
