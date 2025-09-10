import { defineComponent, ref } from 'vue'
import { ElButton, ElButtonGroup } from 'element-plus'
import { Delete, CircleCheckFilled, CircleCloseFilled, CirclePlusFilled, Checked, DCaret } from '@element-plus/icons-vue'
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
    const isShowAddBtn = ref(false)

    return () => (
      <div class='flex flex-col gap-5px'>
       <div class='delete-btns'>
         <ElButton onClick={() => { emit('update:isShowDeleteBtn', !props.isShowDeleteBtn.value) }} class='mr-5px' type='primary' size='small' icon={<Delete />}>删除</ElButton>
         <ElButtonGroup v-show={props.isShowDeleteBtn.value}>
           <ElButton type='primary' size='small' icon={<CircleCheckFilled />}>全选</ElButton>
           <ElButton type='primary' size='small' icon={<CircleCloseFilled />}>取消</ElButton>
         </ElButtonGroup>
       </div>
       <div class='add-btn'>
         <ElButton onClick={() => { isShowAddBtn.value = !isShowAddBtn.value }} class='mr-5px' type='primary' size='small' icon={<CirclePlusFilled />}>新增</ElButton>
         <ElButtonGroup v-show={isShowAddBtn.value}>
          <ElButton type='primary' size='small' icon={<Checked />}>当前页面</ElButton>
          <ElButton type='primary' size='small' icon={<DCaret />}>导入</ElButton>
         </ElButtonGroup>
       </div>
      </div>
    )
  }
})
