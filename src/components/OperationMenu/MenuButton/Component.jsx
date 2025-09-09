import { defineComponent } from 'vue'
import { ElCol, ElButton } from 'element-plus'
export default defineComponent({
  props: {
    btnInfo: { type: Object },
    isMobile: { type: Boolean, default: false }
  },
  setup (props) {
    return () => (
      <ElCol
        span={props.isMobile ? 4 : 2}
        onClick={props.btnInfo.handler}
        class={[
          'w-full text-center cursor-pointer inner-content__header__menu__btn',
          props.isMobile ? 'mobile-menu-btn' : ''
        ]}
      >
        <ElButton
          class={[
            'w-full font-size-16px',
            props.isMobile ? 'mobile-btn' : ''
          ]}
          type={'primary'}
          size={props.isMobile ? 'small' : 'default'}
          icon={props.btnInfo.icon()}
        >
          {typeof props.btnInfo.label === 'function' ? props.btnInfo.label() : props.btnInfo.label}
        </ElButton>
      </ElCol>
    )
  }
})
