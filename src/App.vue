<template>
  <div id="app">
    <PageEditor v-model="state" :formData="formData"></PageEditor>
  </div>
</template>

<style lang="less">
*,html,body{
  padding: 0;
  margin: 0;
}
</style>
<script>
// 导入总体布局组件
import PageEditor from '@/views/page-editor'
import { ref, provide, onMounted } from 'vue'
import data from './data'
import { registerConfig as config } from '@/utils/editor-config'
export default {
  components: {
    PageEditor
  },
  setup () {
    const state = ref(data)
    provide('config', config)
    // 预设可绑定字段
    const formData = ref({
      username: 'lujiuwu',
      password: '111'
    })
    onMounted(() => {
      window.document.documentElement.setAttribute('data-skin', 'default-theme')
    })
    return {
      state,
      formData
    }
  }
}

</script>
