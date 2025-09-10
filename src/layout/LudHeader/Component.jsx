import { defineComponent } from 'vue'
import data from '../../data.json'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'preview'
    }
  },
  setup (props) {
    const style = {
      preview: 'w-full h-30px bg-blueGray flex items-center justify-center text-white text-sm border border-gray-300',
      render: `w-${data.container.width}px h-30px bg-blueGray flex items-center justify-center text-white text-sm border border-gray-300`
    }
    return () => <>
      <div class={style[props.type]}>
        默认文本
      </div>
    </>
  }
})
