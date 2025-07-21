# 烹饪App (CookingApp)

这是一个基于React Native和Expo开发的烹饪菜谱应用，用户可以浏览菜谱、查看详情、收藏喜欢的菜谱等。

## 项目结构

```
CookingApp/
├── src/
│   ├── screens/             # 屏幕组件
│   │   ├── HomeScreen.tsx       # 首页
│   │   ├── RecipeScreen.tsx     # 菜谱详情页
│   │   ├── FavoritesScreen.tsx  # 收藏页
│   │   └── ProfileScreen.tsx    # 个人资料页
│   ├── components/          # 可复用组件
│   ├── navigation/          # 导航相关
│   │   └── AppNavigator.tsx     # 导航配置
│   ├── services/            # API服务
│   ├── hooks/               # 自定义Hook
│   ├── utils/               # 工具函数
│   ├── assets/              # 静态资源
│   └── types/               # 类型定义
├── assets/                  # Expo资源目录
└── App.tsx                  # 应用入口
```

## 功能列表

- 首页：展示热门菜谱
- 菜谱详情：展示菜谱的详细信息、材料和步骤
- 收藏页：查看已收藏的菜谱
- 个人资料：用户信息和活动

## 技术栈

- React Native
- Expo
- React Navigation
- TypeScript

## 安装与运行

1. 确保已安装Node.js和npm
2. 安装Expo CLI：`npm install -g expo-cli`
3. 安装项目依赖：`npm install`
4. 运行项目：
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## 开发说明

本项目使用TypeScript进行开发，遵循React和React Native的最佳实践。目前使用的是模拟数据，后续可以连接到实际的后端API。

## 下一步计划

- 添加菜谱搜索功能
- 实现用户认证
- 添加发布菜谱功能
- 优化UI/UX体验
- 连接到后端API 