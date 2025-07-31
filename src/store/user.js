import { defineStore } from 'pinia'
import UserApi from '@/api/member/user'

// 用戶 Store
const user = defineStore({
  id: 'user',
  persist: {
    enabled: true,
    key: 'user-store',
  },
  state: () => ({
    token: uni.getStorageSync('token') || '',
    refreshToken: uni.getStorageSync('refresh-token') || '',
    userInfo: {},
    lastUpdateTime: 0,
    isInitialized: false, // 新增：标记是否已初始化
  }),

  getters: {
    // 是否已登錄
    isLogin: state => !!state.token,
    // 獲取用戶信息
    getUserInfo: state => state.userInfo,
    // 是否需要刷新用户信息（超过30分钟）
    needRefreshUserInfo: state => {
      const now = new Date().getTime()
      return now - state.lastUpdateTime > 30 * 60 * 1000
    }
  },

  actions: {
    // 設置 Token
    setToken(token, refreshToken) {
      this.token = token
      this.refreshToken = refreshToken

      // 保存到本地
      uni.setStorageSync('token', token)
      uni.setStorageSync('refresh-token', refreshToken)
    },

    // 清除 Token
    clearToken() {
      this.token = ''
      this.refreshToken = ''

      // 清除本地存儲
      uni.removeStorageSync('token')
      uni.removeStorageSync('refresh-token')
    },

    // 設置用戶信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.lastUpdateTime = new Date().getTime()
    },

    // 初始化用户状态
    async initUserState() {
      if (this.isInitialized) return

      if (this.isLogin) {
        try {
          // 如果有token但没有用户信息，或者用户信息过期，则重新获取
          if (!this.userInfo.id || this.needRefreshUserInfo) {
            await this.getInfo()
          }
        } catch (error) {
          console.error('初始化用户状态失败', error)
          // 如果获取用户信息失败，可能token已过期，清除登录状态
          if (error?.code === 401) {
            this.logout(true)
          }
        }
      }

      this.isInitialized = true
    },

    // 獲取用戶信息（增强版）
    async getInfo(force = false) {
      if (!this.isLogin) return null

      // 如果不是强制刷新且用户信息未过期，直接返回缓存
      if (!force && this.userInfo.id && !this.needRefreshUserInfo) {
        return this.userInfo
      }

      try {
        const res = await UserApi.getUserInfo()
        if (res.code === 0 && res.data) {
          this.setUserInfo(res.data)
          return res.data
        }
        return null
      } catch (error) {
        console.error('獲取用戶信息失敗', error)
        throw error
      }
    },

    // 退出登錄（增强版）
    async logout(skipRequest = false) {
      if (!skipRequest && this.isLogin) {
        try {
          await UserApi.logout()
        } catch (error) {
          console.error('退出登錄失敗', error)
        }
      }

      // 清除用戶數據
      this.clearToken()
      this.userInfo = {}
      this.lastUpdateTime = 0
      this.isInitialized = false
    },
  },
})

export default user
