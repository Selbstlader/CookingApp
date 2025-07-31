import { isEmpty, isNil, isObject, isString, startsWith } from 'lodash-es'
import throttle from '@/helper/throttle'
import { showAuthModal, showShareModal } from '@/hooks/useModal'
import $store from '@/store'

// 定義路由映射表
const ROUTES_MAP = {
  '/pages/home/index': { meta: {} },
  '/pages/home/auth': { meta: {} },
  '/pages/home/settings': { meta: { auth: true } },
  '/pages/home/forgot-password': { meta: {} },
  '/pages/search/index': { meta: {} },
  '/pages/public/webview': { meta: {} },
  '/pages/public/error': { meta: {} },
}

// 定義底部導航頁面 (已移除uni-app tabBar，使用自定义导航)
const TABBAR = []

function _go(path, params = {}, options = {
  redirect: false,
}) {
  let page = '' // 跳转页面
  let query = '' // 页面参数
  let url = '' // 跳转页面完整路径

  if (isString(path)) {
    // 判断跳转类型是 path ｜ 还是http
    if (startsWith(path, 'http')) {
      // 在H5環境下使用瀏覽器跳轉，非H5環境使用 webview
      // H5
      /* #ifdef H5 */
      window.location = path
      return
      /* #endif */
      
      // 非H5
      /* #ifndef H5 */
      page = `/pages/public/webview`
      query = `url=${encodeURIComponent(path)}`
      /* #endif */
    }
    else if (startsWith(path, 'action:')) {
      handleAction(path)
      return
    }
    else {
      [page, query] = path.split('?')
    }
    if (!isEmpty(params)) {
      const query2 = paramsToQuery(params)
      if (isEmpty(query)) {
        query = query2
      }
      else {
        query += `&${query2}`
      }
    }
  }

  if (isObject(path)) {
    page = path.url
    if (!isNil(path.params)) {
      query = paramsToQuery(path.params)
    }
  }

  const nextRoute = ROUTES_MAP[page]

  // 未找到指定跳转页面
  if (!nextRoute) {
    // eslint-disable-next-line no-console
    console.log(`%c跳转路径参数错误<${page || 'EMPTY'}>`, 'color:red;background:yellow')
    return
  }

  // 页面登录拦截
  if (nextRoute.meta?.auth && !$store('user').isLogin) {
    showAuthModal()
    return
  }

  url = page
  if (!isEmpty(query)) {
    url += `?${query}`
  }

  // 跳转底部导航
  if (TABBAR.includes(page)) {
    uni.switchTab({
      url,
    })
    return
  }

  // 使用redirect跳转
  if (options.redirect) {
    uni.redirectTo({
      url,
    })
    return
  }

  uni.navigateTo({
    url,
  })
}

// 限流 防止重复点击跳转
function go(...args) {
  throttle(() => {
    _go(...args)
  })
}

function paramsToQuery(params) {
  if (isEmpty(params)) {
    return ''
  }
  // return new URLSearchParams(Object.entries(params)).toString();
  const query = []
  for (const key in params) {
    query.push(`${key}=${params[key]}`)
  }

  return query.join('&')
}

function back() {
  // H5
  /* #ifdef H5 */
  history.back()
  /* #endif */

  // 非H5
  /* #ifndef H5 */
  uni.navigateBack()
  /* #endif */
}

function redirect(path, params = {}) {
  go(path, params, {
    redirect: true,
  })
}

// 检测是否有浏览器历史
function hasHistory() {
  // 非H5
  /* #ifndef H5 */
  const pages = uni.getCurrentPages()
  if (pages.length > 1) {
    return true
  }
  return false
  /* #endif */

  // H5
  /* #ifdef H5 */
  return !!history.state.back
  /* #endif */
}

function getCurrentRoute(field = '') {
  const currentPage = getCurrentPage()
  // 小程序
  /* #ifdef MP */
  currentPage.$page.route = currentPage.route
  currentPage.$page.options = currentPage.options
  /* #endif */
  if (field !== '') {
    return currentPage.$page[field]
  }
  else {
    return currentPage.$page
  }
}

function getCurrentPage() {
  const pages = uni.getCurrentPages()
  return pages[pages.length - 1]
}

function handleAction(path) {
  const action = path.split(':')
  switch (action[1]) {
    case 'showShareModal':
      showShareModal()
      break
  }
}

function error(errCode, errMsg = '') {
  redirect('/pages/public/error', {
    errCode,
    errMsg,
  })
}

// 導出 useRouter hook
export function useRouter() {
  return {
    go,
    back,
    redirect,
    push: go,
    replace: redirect,
    reLaunch: (url) => {
      uni.reLaunch({ url })
    },
  }
}

export default {
  go,
  back,
  hasHistory,
  redirect,
  getCurrentPage,
  getCurrentRoute,
  error,
  useRouter,
}