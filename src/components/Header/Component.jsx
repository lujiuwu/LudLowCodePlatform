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
      <ElHeader class={'w-full inner-content__header flex flex-col gap-8px'}>
        <OperationMenu btnContent={props.btnContent} />
        <ElRow class={'flex items-center'}>
          <ThemeSelection />
        </ElRow>
      </ElHeader>
    )
  }
})
