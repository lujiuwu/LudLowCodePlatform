import { defineComponent } from 'vue'
import { ElRow } from 'element-plus'
import { MenuButton } from './MenuButton'
export default defineComponent({
  props: {
    btnContent: { type: Array }
  },
  setup (props) {
    return () => (
      <ElRow class={'flex justify-center items-center gap-5px inner-content__header__menu'}>
        {props.btnContent.map(btn => (
          <MenuButton btnInfo={btn} />
        ))}
      </ElRow>
    )
  }
})
