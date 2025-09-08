import { defineComponent } from 'vue'
import { ElCol } from 'element-plus'
export default defineComponent({
  props: {
    btnInfo: { type: Object }
  },
  setup (props) {
    return () => (
      <ElCol span={2} onClick={props.btnInfo.handler}>
        {typeof props.btnInfo.label === 'function' ? props.btnInfo.label() : props.btnInfo.label}
      </ElCol>
    )
  }
})
