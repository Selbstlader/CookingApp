# Vite导入错误修复总结

## 问题描述
原始错误：`Failed to resolve import "./pages/index.vue" from "src/pages-json-js"`
- 错误发生在动态导入时无法找到 `/Users/xinyoucai/whitexiaomao/cooking/src/pages/index.vue` 文件
- 实际上 `pages/index.vue` 文件不存在，真正的首页是 `pages/home/index.vue`

## 已完成的修复工作

### 1. 更新 pages.json 配置
- ✅ 将首页路径从 `pages/index` 更改为 `pages/home/index`
- ✅ 移除了已删除的登录/注册页面配置
- ✅ 修复了tabBar配置，正确指向存在的页面
- ✅ 修复了JSON语法错误（尾随逗号）

### 2. 更新路由配置 (router/index.js)
- ✅ 清理了重复的导入语句
- ✅ 更新了ROUTES_MAP，移除不存在的页面路径
- ✅ 更新了TABBAR数组，与pages.json保持一致
- ✅ 保持了登录拦截和其他路由逻辑

### 3. 更新TypeScript类型定义 (uni-pages.d.ts)
- ✅ 移除了不存在页面的类型定义
- ✅ 更新了NavigateToOptions接口
- ✅ 更新了SwitchTabOptions接口，包含所有tabBar页面

### 4. 更新页面引用
- ✅ 修复了auth.vue中的页面跳转路径
- ✅ 修复了settings.vue中的页面跳转路径  
- ✅ 修复了AppFooter.vue中的导航路径

### 5. 更新模态框逻辑 (hooks/useModal.js)
- ✅ 修改showAuthModal函数，直接跳转到统一认证页面

## 当前页面结构
```
cooking/src/pages/
├── home/
│   ├── auth.vue      # 统一认证页面（登录+注册）
│   ├── index.vue     # 首页（烹饪社区）
│   └── settings.vue  # 个人设置页面
└── search/
    └── index.vue     # 搜索页面
```

## 路由配置
- **首页**: `/pages/home/index` (tabBar)
- **认证页**: `/pages/home/auth` (登录注册统一页面)
- **设置页**: `/pages/home/settings` (tabBar, 需要登录)
- **搜索页**: `/pages/search/index`

## TabBar配置
- 首页: `pages/home/index`
- 我的: `pages/home/settings`

## 验证结果
- ✅ 所有页面路径都指向存在的文件
- ✅ pages.json配置语法正确
- ✅ 路由映射表与实际页面匹配
- ✅ TypeScript类型定义准确
- ✅ 所有页面跳转路径已更新
- ✅ 登录认证逻辑保持完整

## 注意事项
1. 原有的登录注册功能已完全整合到 `/pages/home/auth.vue` 页面
2. 所有API调用、状态管理、业务逻辑保持不变
3. 用户体验得到改善，可在同一页面完成登录和注册
4. 系统的登录拦截和权限控制功能正常工作

现在Vite应该能够正确解析所有页面导入，不再出现找不到文件的错误。