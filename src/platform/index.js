// 平台工具模塊

// 獲取當前運行平台
export function getPlatformType() {
  return uni.getSystemInfoSync().platform
}

// 平台名稱
export const name = (() => {
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  
  // #ifdef MP-ALIPAY
  return 'mp-alipay'
  // #endif
  
  // #ifdef H5
  return 'h5'
  // #endif
  
  // 其他平台
  return 'unknown'
})()

// 判斷是否為 H5 平台
export const isH5 = name === 'h5'

// 判斷是否為微信小程序
export const isMpWeixin = name === 'mp-weixin'

// 判斷是否為支付寶小程序
export const isMpAlipay = name === 'mp-alipay'

// 判斷是否為 APP
export const isApp = name === 'app'

export default {
  name,
  isH5,
  isMpWeixin,
  isMpAlipay,
  isApp,
  getPlatformType,
} 