import { Transition, defineComponent } from 'vue'
import { ElAside } from 'element-plus'
import { BlockTab, PreviewComponent } from '@/components'

export default defineComponent({
  props: {
    width: { type: String },
    isOpenAside: { type: Boolean },
    currentTab: { type: String },
    DragFunction: { type: Function },
    DragEndFunction: { type: Function },
    componentList: { type: Array }
  },
  emits: ['update:isOpenAside', 'update:currentTab'],
  setup (props, { emit }) {
    return () => (
      <ElAside
        style={{ transition: 'width 0.3s ease' }}
        class="outer-content__component-aside aside-color"
        width={props.width}
      >
        <div class='component-aside__row'>
          <div class='component-aside__row__tabs'>
            <BlockTab
              currentTab={props.currentTab}
              isOpenAside={props.isOpenAside}
              onUpdate:currentTab={(value) => {
                emit('update:currentTab', value)
              }}
              onUpdate:isOpenAside={(value) => {
                emit('update:isOpenAside', value)
              }}
            >
            </BlockTab>
            </div>
          <Transition name='slide'>
            <div class='component-aside__row__components' v-show={props.isOpenAside}>
              {props.componentList.map(component => (
                  <PreviewComponent
                    component={component}
                    onDragstart={(e) => props.DragFunction(e, component)}
                    onDragend={(e) => props.DragEndFunction(e, component)}
                  ></PreviewComponent>
              ))}
            </div>
          </Transition>
        </div>
      </ElAside>
    )
  }
})
