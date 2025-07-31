import { createPinia, setActivePinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist-uni'
import sys from './sys'
import user from './user'

// 創建 pinia 實例
const pinia = createPinia()

// 啟用持久化存儲插件
pinia.use(piniaPersist)

// 設置為活動的 pinia 實例
setActivePinia(pinia)

// 定義 useStore 函數，方便獲取 store
export function useStore(id) {
  switch (id) {
    case 'user':
      return user()
    case 'sys':
      return sys()
    default:
      throw new Error(`unknown store: ${id}`)
  }
}

// 注冊 pinia 到 Vue 應用
export function setupPinia(app) {
  app.use(pinia)
}

export default useStore
