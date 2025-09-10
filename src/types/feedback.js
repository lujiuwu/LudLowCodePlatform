import { ElRate } from 'element-plus'

export const feedbackComponents = [
  {
    label: '评分',
    key: 'rate',
    type: 'feedBack',
    preview: () => <ElRate class='preview' style="width: 100%"/>,
    render: () => {
      return <ElRate />
    }
  }
]
