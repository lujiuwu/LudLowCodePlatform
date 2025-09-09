// 创建一个输入框
export const createInput = (label) => ({ type: 'input', label })
// 更新颜色
export const createColor = (label) => ({ type: 'color', label })
// 下拉菜单
export const createSelector = (label, options) => ({ type: 'selector', label, options })
// 表格渲染
export const createTable = (label, table) => ({ type: 'table', label, table })
