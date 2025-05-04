<template>
  <div id="app">
    <PageEditor v-model="state"></PageEditor>
  </div>
</template>

<style lang="less">
*{
  padding: 0;
  margin: 0;
}
</style>
<script>
// 导入总体布局组件
import PageEditor from './packages/page-editor'
import { ref, provide } from 'vue'
import data from './data'
import { registerConfig as config } from './utils/editor-config'
export default {
  components: {
    PageEditor
  },
  setup () {
    const state = ref(data)
    provide('config', config)
    return {
      state
    }
  }
}

</script>
