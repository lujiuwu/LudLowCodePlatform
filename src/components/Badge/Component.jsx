import { defineComponent } from 'vue'
import { ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
export default defineComponent({
  props: {
    value: {
      type: [String, Function],
      default: () => <ElIcon><Close /></ElIcon>
    }
  },
  setup (props) {
    return () => (
      <div
      class="absolute top-[-3px] left-[-3px] w-13px h-13px bg-red flex items-center justify-center cursor-pointer"
      style={{ borderRadius: '100px', fontSize: '12px', color: '#fff' }}
      >
        {props.value}
      </div>
    )
  }
})
