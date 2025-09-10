import { Transition, defineComponent, ref, provide } from 'vue'
import { ElAside } from 'element-plus'
import { BlockTab, PreviewComponent } from '@/components'
import { OperationBtns } from '../OperationBtns'

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
    // 创建isShowDeleteBtn状态并提供给子组件
    const isShowDeleteBtn = ref(false)
    provide('isShowDeleteBtn', isShowDeleteBtn)
    return () => (
      <ElAside
        style={{ transition: 'width 0.3s ease' }}
        class="outer-content__component-aside aside-color"
        width={props.width}
      >
        <div class='h-full m-0 p-0 flex-nowrap w-full overflow-hidden flex'>
          <div class='component-aside__row__tabs flex-[1]'>
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
            <div class='component-aside__row__components p-3px flex-[7] overflow-y-scroll' v-show={props.isOpenAside}>
              {props.currentTab === 'my' && <OperationBtns
                currentTab={props.currentTab}
                isShowDeleteBtn={isShowDeleteBtn}
                onUpdate:isShowDeleteBtn={(value) => { isShowDeleteBtn.value = value }}
              />}
              {props.componentList.map(component => (
                  <PreviewComponent
                    component={component}
                    currentTab={props.currentTab}
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
