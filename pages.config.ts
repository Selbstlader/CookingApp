import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [
    {
      path: 'pages/home/index',
      style: {
        navigationBarTitleText: '烹飪社區',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/home/auth',
      style: {
        navigationBarTitleText: '登录注册',
      },
    },
    {
      path: 'pages/home/settings',
      style: {
        navigationBarTitleText: '個人設置',
        navigationStyle: 'default',
      },
    },
    {
      path: 'pages/search/index',
      style: {
        navigationBarTitleText: '搜索菜谱',
        navigationStyle: 'custom',
      },
    },
  ],
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'Vitesse-Uni',
    navigationStyle: 'custom',
  },
})
