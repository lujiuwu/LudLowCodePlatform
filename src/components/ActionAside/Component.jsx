import { defineComponent } from 'vue'
import { ElAside } from 'element-plus'
import { EditorOperator } from '../EditorOperator'

export default defineComponent({
  props: {
    data: { type: Object },
    updateContainer: { type: Function },
    updateBlock: { type: Function },
    LastSelectedBlock: { type: Object }
  },
  setup (props) {
    return () => (
      <ElAside
        width="220px"
        class='outer-content__operator-aside aside-color'>
        <EditorOperator
          class='outer-content__operator-aside__form'
          block={props.LastSelectedBlock}
          v-model:data={props.data}
          updateContainer={props.updateContainer}
          updateBlock={props.updateBlock}
        ></EditorOperator>
      </ElAside>
    )
  }
})
