import { defineComponent } from 'vue'
import { OperationBtns } from './_components'

export default defineComponent({
  props: {
    currentTab: {
      type: String
    },
    isShowDeleteBtn: {
      type: Object
    }
  },
  emits: ['update:isShowDeleteBtn'],
  setup (props, { emit }) {
    return () => (
      <OperationBtns
        currentTab={props.currentTab}
        isShowDeleteBtn={props.isShowDeleteBtn}
        onUpdate:isShowDeleteBtn={(value) => emit('update:isShowDeleteBtn', value)}
      />
    )
  }
})
