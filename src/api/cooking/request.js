import Request from 'luch-request'
import { baseUrl, tenantId, apiPath1 } from '@/config'
import { getTerminal } from '@/helper/const'
import { showAuthModal } from '@/hooks/useModal'
import $platform from '@/platform'
import $store from '@/store'

const options = {
  showSuccess: false,
  successMsg: '',
  showError: true,
  errorMsg: '',
  showLoading: true,
  loadingMsg: '加载中',
  auth: false,
}
// 为cooking模块创建专门的请求实例
const cookingHttp = new Request({
  baseURL: baseUrl + apiPath1, // 使用 apiPath 而不是 apiPath1
  timeout: 8000,
  method: 'GET',
  header: {
    'Accept': 'text/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'platform': $platform.name,
  },
  // #ifdef APP-PLUS
  sslVerify: false,
  // #endif
  // #ifdef H5
  // 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
  withCredentials: false,
  // #endif
  custom: options,
})

// 请求拦截器
cookingHttp.interceptors.request.use(
  (config) => {
    // 自定义处理【auth 授权】：必须登录的接口，则跳出 AuthModal 登录弹窗
    if (config.custom.auth && !$store('user').isLogin) {
      showAuthModal()
      return Promise.reject(new Error(JSON.stringify({
        code: 401,
        msg: '请先登录',
      })))
    }

    if (config.custom.showLoading) {
      uni.showLoading({
        title: config.custom.loadingMsg,
        mask: true,
        fail: () => {
          uni.hideLoading()
        },
      })
    }

    // 添加token和租户信息
    const token = getAccessToken()
    if (token) {
      config.header.Authorization = token
    }
    config.header.terminal = getTerminal()
    config.header['tenant-id'] = tenantId

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
cookingHttp.interceptors.response.use(
  (response) => {
    uni.hideLoading()

    const { data } = response
    const { code, msg } = data

    if (code === 0) {
      return data
    }
    else if (code === 401) {
      // 处理未登录情况
      uni.showToast({
        title: '账号未登录',
        icon: 'none',
      })

      // 跳转到登录页面
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/home/auth',
        })
      }, 1500)

      return Promise.reject(data)
    }
    else {
      uni.showToast({
        title: msg || '请求失败',
        icon: 'none',
      })
      return Promise.reject(data)
    }
  },
  (error) => {
    uni.hideLoading()
    uni.showToast({
      title: '网络错误',
      icon: 'none',
    })
    return Promise.reject(error)
  },
)

function cookingRequest(config) {
  return cookingHttp.request(config)
}

// 获得访问令牌
export function getAccessToken() {
  return uni.getStorageSync('token')
}

export default cookingRequest
