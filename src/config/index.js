// API 相關配置
export const baseUrl = 'http://localhost:48080' // API 基礎路徑，實際項目中要修改為真實 API 地址
export const apiPath = '/app-api' // API 路徑前綴
export const tenantId = '1' // 租戶 ID，多租戶系統使用
export const apiPath1 = '/app-api' // 改為 /app-api
// 系統配置
export const appName = '烹飪社區'
export const appVersion = '1.0.0'

// 主題配色
export const theme = {
  primary: '#ff6911', // 主色調
  success: '#67c23a', // 成功色
  warning: '#e6a23c', // 警告色
  danger: '#f56c6c', // 錯誤色
  info: '#909399', // 信息色
}

// 緩存相關配置
export const cachePrefix = 'cooking_' // 緩存前綴
export const tokenKey = `${cachePrefix}token` // token 緩存鍵名
export const userInfoKey = `${cachePrefix}userInfo` // 用戶信息緩存鍵名

// 默認配置
export default {
  baseUrl,
  apiPath,
  apiPath1,
  tenantId,
  appName,
  appVersion,
  theme,
  cachePrefix,
  tokenKey,
  userInfoKey,
}
