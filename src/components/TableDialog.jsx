import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from 'element-plus'
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
        state.editData = JSON.parse(JSON.stringify(option.data))
      }
    })
    function onAddColumn () {
      state.editData.push({})
    }
    function onApply () {
      state.option.confirm(state.editData)
      state.isShow = false
    }
    function onCancel () {
      state.isShow = false
    }
    return () => {
      return <ElDialog v-model={state.isShow} title={'添加下拉选项'}>
        {{
          default: () => {
            return <div>
              <div class='button-area'>
                <ElButton type='primary' onClick={onAddColumn}>添加</ElButton>
              <ElButton>重置</ElButton>
              </div>
              <ElTable data={state.editData}>
                <ElTableColumn type='index'></ElTableColumn>
                {state.option.config.table.options.map((item, index) => {
                  return <ElTableColumn label={item.label}>
                    {{
                      default: ({ row }) => <ElInput v-model={row[item.field]}></ElInput>
                    }}
                  </ElTableColumn>
                })}
                <ElTableColumn>
                  <ElButton type='danger'>删除</ElButton>
                </ElTableColumn>
              </ElTable>
            </div>
          },
          footer: () => {
            return <div>
              <ElButton type='primary' onClick={onApply}>确定</ElButton>
              <ElButton onClick={onCancel}>取消</ElButton>
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
