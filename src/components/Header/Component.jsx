import { defineComponent } from 'vue'
import { ElHeader, ElRow } from 'element-plus'
import { OperationMenu, ThemeSelection } from '@/components'

export default defineComponent({
  props: {
    btnContent: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    return () => (
      <ElHeader class={'w-100% flex flex-col inner-content__header'} height="9vh">
        <OperationMenu class={'flex-1'} btnContent={props.btnContent} />
        <ElRow class={'flex-1 flex items-center'}>
          <ThemeSelection />
        </ElRow>
      </ElHeader>
    )
  }
})
