import { defineComponent, ref } from 'vue'
import { ElSelect, ElOption, ElCol } from 'element-plus'
export default defineComponent({
  setup () {
    function changeTheme (themeName) {
      window.document.documentElement.setAttribute('data-skin', themeName)
    }
    // 皮肤主题
    const themesOption = [
      { value: 'default-theme', label: '默认主题' },
      { value: 'dark-theme', label: '暗色主题' },
      { value: 'candy-theme', label: '柔和主题' }
    ]
    const currentTheme = ref('default-theme')
    return () => {
      return (
        <ElCol span={3} offset={3}>
          <ElSelect
            v-model={currentTheme.value}
            onChange={changeTheme}
          >
            {
              themesOption.map((theme, index) => (
                <ElOption
                  key={index}
                  value={theme.value}
                  label={theme.label}
                   disabled={theme.value === currentTheme.value}
                ></ElOption>
              ))
            }
          </ElSelect>
        </ElCol>
      )
    }
  }
})
