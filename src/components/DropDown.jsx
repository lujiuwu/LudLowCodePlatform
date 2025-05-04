import { createVNode, defineComponent, reactive, render, computed, onMounted, ref, onBeforeUnmount } from 'vue'
const DropDownComponent = defineComponent({
  name: 'DropDownComponent',
  props: {
    option: { type: Object }
  },
  setup (props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false,
      top: 0,
      left: 0
    })
    ctx.expose({
      // 更新选项
      showDropDown (option) {
        state.option = option
        state.isShow = true
        const { top, left, height } = option.el.getBoundingClientRect()
        state.top = top + height
        state.left = left
      }
    })
    const classes = computed(() => [
      'dropdown',
      {
        'isShow-dropdown': state.isShow
      }
    ])
    const positionStyle = computed(() => ({
      top: state.top + 'px',
      left: state.left + 'px'
    }))
    function MouseDownDocument (e) {
      if (!elRef.value.contains(e.target)) state.isShow = false
    }
    // 点击外部盒子应该隐藏菜单
    onMounted(() => {
      document.body.addEventListener('mousedown', MouseDownDocument, true)
    })
    onBeforeUnmount(() => {
      document.body.removeEventListener('mousedown', MouseDownDocument)
    })
    const elRef = ref(null)
    return () => {
      return <div class={classes.value} style={positionStyle.value} ref={elRef}>菜单</div>
    }
  }
})
let vm
export function $dropdown (option) {
  if (!vm) {
    const el = document.createElement('div')
    vm = createVNode(DropDownComponent, { option })
    document.body.appendChild((render(vm, el), el))
  }

  const { showDropDown } = vm.component.exposed
  showDropDown(option)
}
