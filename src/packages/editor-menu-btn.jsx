import { defineComponent } from 'vue'
import { ElCol } from 'element-plus'
export default defineComponent({
  props: {
    btnInfo: { type: Object }
  },
  setup (props) {
    return () => (
      <ElCol span={4} onClick={props.btnInfo.handler}>
        {props.btnInfo.label}
      </ElCol>
    )
  }
})
