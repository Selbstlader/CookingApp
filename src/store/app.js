import { defineStore } from 'pinia'

const app = defineStore({
  id: 'app',
  state: () => ({
    version: '1.0.0',
    appName: '烹飪社區',
    loadingCount: 0,
    sysInfo: {},
  }),
  getters: {
    loading: state => state.loadingCount > 0,
    // 獲取系統信息
    getSysInfo: state => state.sysInfo,
  },
  actions: {
    // 設置加載狀態
    setLoading(status) {
      if (status) {
        this.loadingCount++
      } else {
        this.loadingCount = this.loadingCount > 0 ? this.loadingCount - 1 : 0
      }
    },
    // 初始化系統信息
    initSysInfo() {
      try {
        // 獲取系統信息
        this.sysInfo = uni.getSystemInfoSync()
        
        // 計算安全區域
        const { safeArea, screenHeight, windowHeight } = this.sysInfo
        
        // 計算底部安全區域
        let safeBottom = 0
        if (safeArea) {
          safeBottom = screenHeight - safeArea.bottom
        }
        
        // 保存安全區域信息
        this.sysInfo.safeBottom = safeBottom
        this.sysInfo.safeTop = safeArea ? safeArea.top : 0
      } catch (e) {
        console.error('獲取系統信息失敗', e)
      }
    },
  },
})

export default app 