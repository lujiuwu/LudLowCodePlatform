import { LudHeader, LudAside } from '@/layout'

export const layoutComponents = [
  {
    label: '头部',
    key: 'ludHeader',
    type: 'layout',
    preview: () => <LudHeader type='preview' />,
    render: () => <LudHeader type='render' />
  },
  {
    label: '侧边栏',
    key: 'ludAside',
    type: 'layout',
    preview: () => <LudAside type='preview' />,
    render: () => <LudAside type='render' />
  }
]
