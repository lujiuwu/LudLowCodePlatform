import { defineComponent } from 'vue'
import { ElCol, ElButton } from 'element-plus'
export default defineComponent({
  props: {
    btnInfo: { type: Object }
  },
  setup (props) {
    return () => (
      <ElCol span={2} onClick={props.btnInfo.handler} class={'w-100% text-center cursor-pointer inner-content__header__menu__btn'}>
        <ElButton class={'w-100% font-size-16px'} type={'primary'}>
        {typeof props.btnInfo.label === 'function' ? props.btnInfo.label() : props.btnInfo.label}
        </ElButton>
      </ElCol>
    )
  }
})
