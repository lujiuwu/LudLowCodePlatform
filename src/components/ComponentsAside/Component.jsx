import { Transition, defineComponent, ref } from 'vue'
import { ElAside } from 'element-plus'
import { BlockTab } from '@/components'

export default defineComponent({
  props: {
    width: { type: String },
    isOpenAside: { type: Boolean },
    DragFunction: { type: Function },
    DragEndFunction: { type: Function },
    componentList: { type: Array }
  },
  setup (props) {
    const currentTab = ref('basicComponent')
    return () => (
      <ElAside
        style={{ transition: 'width 0.3s ease' }}
        class="outer-content__component-aside aside-color"
        width={props.width}
      >
        <div class='component-aside__row'>
          <div class='component-aside__row__tabs'>
            <BlockTab
              v-model:currentTab={currentTab}
              v-model:isOpenAside={props.isOpenAside}
            >
            </BlockTab>
          </div>
          <Transition name='slide'>
            <div class='component-aside__row__components' v-show={props.isOpenAside}>
              {props.componentList.map(component => (
                <div
                  class="component-aside__row__components__item"
                >
                  <div
                    class="component-aside__row__components__item__component"
                    draggable
                    onDragstart={(e) => props.DragFunction(e, component)}
                    onDragend={(e) => props.DragEndFunction(e, component)}
                  >
                    {component.preview()}
                  </div>
                  <div class="component-aside__row__components__item__label">
                    {component.label}
                  </div>
                </div>
              ))}
            </div>
          </Transition>
        </div>
      </ElAside>
    )
  }
})
