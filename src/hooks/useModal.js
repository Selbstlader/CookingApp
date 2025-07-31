/**
 * Modal 相關的 Hooks
 */

// 顯示授權彈窗 - 跳转到统一认证页面
export function showAuthModal(type = 'accountLogin') {
  uni.navigateTo({
    url: '/pages/home/auth'
  })
}

// 關閉授權彈窗
export function closeAuthModal() {
  uni.$emit('closeAuthModal')
}

// 顯示分享彈窗
export function showShareModal(params = {}) {
  uni.$emit('openShareModal', params)
}

// 關閉分享彈窗
export function closeShareModal() {
  uni.$emit('closeShareModal')
}

// 顯示選擇規格彈窗
export function showSkuModal(params = {}) {
  uni.$emit('openSkuModal', params)
}

// 關閉選擇規格彈窗
export function closeSkuModal() {
  uni.$emit('closeSkuModal')
}

export default {
  showAuthModal,
  closeAuthModal,
  showShareModal,
  closeShareModal,
  showSkuModal,
  closeSkuModal,
}
