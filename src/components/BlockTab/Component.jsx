import { Folder, Menu, BellFilled, Fold, Expand } from '@element-plus/icons-vue'
import { ElIcon, ElTabPane, ElTabs } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    currentTab: {
      type: String
    },
    isOpenAside: {
      type: Boolean
    }
  },
  setup (props, ctx) {
    const currentTab = computed({
      get () { return props.currentTab },
      set (newValue) { ctx.emit('update:currentTab', newValue) }
    })
    const isOpenAside = computed({
      get () { return props.isOpenAside },
      set (newValue) { ctx.emit('update:isOpenAside', newValue) }
    })
    const blockTypes = [
      { label: '基础组件', name: 'basicComponent', icon: () => <Folder /> },
      { label: '布局容器', name: 'pageContainer', icon: () => <Menu /> },
      { label: '反馈组件', name: 'feedBack', icon: () => <BellFilled /> }
    ]
    function handleClick (e) {
      currentTab.value = blockTypes[e].name
    }
    function changeOpen () {
      isOpenAside.value = !isOpenAside.value
    }
    return () => (
      <>
        <div class='tabs-area'>
          <ElTabs tab-position="left" onTabChange={handleClick}>
          {blockTypes.map(block => (
            <ElTabPane
              key={block.name}
              label={(
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxSizing: 'border-box'
                }}>
                  <ElIcon>{block.icon()}</ElIcon>
                  <span>{block.label}</span>
                </div>
              )}
            >
            </ElTabPane>
          ))}
        </ElTabs>
        </div>

        <div class='icon-area'>
           <ElIcon onClick={changeOpen} size='25'>
          <Fold v-show={isOpenAside.value}></Fold>
          <Expand v-show={!isOpenAside.value}></Expand>
        </ElIcon>
        </div>

      </>
    )
  }
})
