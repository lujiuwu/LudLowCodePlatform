import { defineComponent, inject } from 'vue'
import { Badge } from '../Badge'

export default defineComponent({
  props: {
    component: {
      type: Object
    },
    currentTab: {
      type: String
    },
    onDragstart: {
      type: Function
    },
    onDragend: {
      type: Function
    }
  },
  setup (props) {
    // 注入isShowDeleteBtn状态
    const isShowDeleteBtn = inject('isShowDeleteBtn', null)

    return () => (
      <>
        <div
          class="component-aside__row__components__item mt-10px flex flex-col"
        >
          <div class="component-aside__row__components__item__label p-5px w-full relative">
            {props.currentTab === 'my' && isShowDeleteBtn?.value && <Badge />}
            {props.component.label}
          </div>
        <div
          class="component-aside__row__components__item__component p-25px"
          draggable
          onDragstart={(e) => props.onDragstart(e, props.component)}
          onDragend={(e) => props.onDragend(e, props.component)}
        >
          {props.component.preview()}
        </div>
        </div>
      </>
    )
  }
})
