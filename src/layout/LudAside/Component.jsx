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
      preview: 'w-40px h-100px bg-blueGray',
      render: `w-40px h-${data.container.height}px bg-blueGray`
    }
    return () => (
      <div class={style[props.type]}>
        默认文本
      </div>
    )
  }
})
