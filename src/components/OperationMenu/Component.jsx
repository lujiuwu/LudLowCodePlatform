import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { ElRow } from 'element-plus'
import { MenuButton } from './MenuButton'
export default defineComponent({
  props: {
    btnContent: { type: Array }
  },
  setup (props) {
    const isMobile = ref(false)

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 768
    }

    onMounted(() => {
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })

    return () => (
      <ElRow
        class={[
          'flex justify-center items-center gap-5px inner-content__header__menu',
          isMobile.value ? 'mobile-menu-layout' : ''
        ]}
      >
        {props.btnContent.map((btn, index) => (
          <MenuButton
            key={index}
            btnInfo={btn}
            isMobile={isMobile.value}
          />
        ))}
      </ElRow>
    )
  }
})
