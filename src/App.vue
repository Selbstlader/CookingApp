<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import $store from '@/store'

onLaunch(async () => {
  console.log('App Launch')

  // 设置默认主题色
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('main-orange')
  }

  // 初始化用户状态
  try {
    const userStore = $store('user')
    await userStore.initUserState()
  }
  catch (error) {
    console.error('初始化用户状态失败', error)
  }
})

onShow(() => {
  console.log('App Show')

  // 应用从后台切换到前台时，检查登录状态
  const userStore = $store('user')
  if (userStore.isLogin && userStore.needRefreshUserInfo) {
    userStore.getInfo().catch((error) => {
      console.error('刷新用户信息失败', error)
    })
  }
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
/* 确保主题色变量有默认值 */
:root {
  --ui-BG-Main: #f37b1d;
  --ui-BG-Main-gradient: rgba(243, 123, 29, 0.6);
  --ui-BG-Main-TC: #ffffff;
}
</style>
