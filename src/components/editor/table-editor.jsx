
import { $tableDialog } from '@/components/editor/TableDialog'
import { ElButton, ElTag } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    propConfig: { type: Object },
    modelValue: { type: Array }
  },
  emits: ['update:modelValue'],
  setup (props, ctx) {
    const data = computed({
      get () { return props.modelValue || [] },
      set (newValue) { ctx.emit('update:modelValue', JSON.parse(JSON.stringify(newValue))) }
    })
    // 添加方法
    function onAdd () {
      $tableDialog({
        config: props.propConfig,
        data: data.value,
        confirm (value) {
          data.value = value
        }
      })
    }
    return () => {
      return <div>
        {(!data.value || data.value.length === 0) && <ElButton onClick={onAdd}>添加</ElButton>}
        {(data.value || []).map(item => <ElTag>{item[props.propConfig.table.key]}</ElTag>)}
      </div>
    }
  }
})
