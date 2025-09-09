import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    component: {
      type: Object
    },
    onDragstart: {
      type: Function
    },
    onDragend: {
      type: Function
    }
  },
  setup (props) {
    return () => (
      <>
        <div
          class="component-aside__row__components__item mt-10px flex flex-col"
        >
        <div class="component-aside__row__components__item__label p-5px">
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
