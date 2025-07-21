import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse, UserInfoResponse } from '../types/models';

// 后端API基础URL
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:48080';

// 默认租户ID (根据实际情况调整)
const DEFAULT_TENANT_ID = '1';

// 创建axios实例 - 管理后台API
const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin-api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'tenant-id': DEFAULT_TENANT_ID,
  },
});

// 创建axios实例 - 应用API
const appApi = axios.create({
  baseURL: `${API_BASE_URL}/app-api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'tenant-id': DEFAULT_TENANT_ID,
  },
});

// 通用请求拦截器函数
const createRequestInterceptor = () => async (config: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 确保每个请求都有租户ID
  if (config.headers && !config.headers['tenant-id']) {
    config.headers['tenant-id'] = DEFAULT_TENANT_ID;
  }
  return config;
};

// 通用响应拦截器函数
const createResponseInterceptor = () => (response: any) => {
  const { data } = response;
  // 处理 CommonResult 包装的响应
  if (data && typeof data === 'object' && 'code' in data) {
    if (data.code === 0) {
      // 成功响应，返回 data 字段
      return data.data;
    } else {
      // 业务错误，抛出错误
      const error = new Error(data.msg || '请求失败');
      (error as any).code = data.code;
      (error as any).response = response;
      throw error;
    }
  }
  // 如果不是标准的 CommonResult 格式，直接返回
  return data;
};

// 通用错误拦截器函数
const createErrorInterceptor = () => (error: any) => {
  // 处理HTTP错误
  console.error('API请求错误:', error);

  // 如果是401错误，清除本地token
  if (error.response?.status === 401) {
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
    AsyncStorage.removeItem('userInfo');
    AsyncStorage.removeItem('expiresTime');
  }

  return Promise.reject(error);
};

// 为管理后台API添加拦截器
adminApi.interceptors.request.use(createRequestInterceptor(), (error: any) => Promise.reject(error));
adminApi.interceptors.response.use(createResponseInterceptor(), createErrorInterceptor());

// 为应用API添加拦截器
appApi.interceptors.request.use(createRequestInterceptor(), (error: any) => Promise.reject(error));
appApi.interceptors.response.use(createResponseInterceptor(), createErrorInterceptor());



// 定义分页参数类型
interface PageParams {
  page: number;
  size: number;
  [key: string]: any;
}

// API服务接口
export const apiService = {
  // 认证相关API (使用管理后台API)
  auth: {
    // 用户登录
    login: (data: LoginRequest) => adminApi.post('/system/auth/login', data) as Promise<LoginResponse>,

    // 用户登出
    logout: () => adminApi.post('/system/auth/logout'),

    // 刷新token
    refreshToken: (refreshToken: string) =>
      adminApi.post(`/system/auth/refresh-token?refreshToken=${refreshToken}`) as Promise<LoginResponse>,

    // 获取用户信息和权限
    getUserInfo: () => adminApi.get('/system/auth/get-permission-info') as Promise<UserInfoResponse>,
  },

  // 分类相关API (使用应用API)
  categories: {
    // 获取所有分类
    getAll: () => appApi.get('/cooking/app/category/list'),

    // 获取菜谱分类
    getRecipeCategories: () => appApi.get('/cooking/app/category/recipe-categories'),

    // 获取食材分类
    getIngredientCategories: () => appApi.get('/cooking/app/category/ingredient-categories'),

    // 获取分类详情
    getDetail: (id: string) => appApi.get(`/cooking/app/category/${id}`),
  },
  
  // 菜谱相关API (使用应用API)
  recipes: {
    // 获取菜谱列表（分页）
    getPage: (params: PageParams) => appApi.get('/cooking/app/recipe/page', { params }),

    // 获取菜谱详情
    getDetail: (id: string) => appApi.get(`/cooking/app/recipe/${id}`),

    // 获取热门菜谱
    getPopular: () => appApi.get('/cooking/app/recipe/popular'),

    // 按分类获取菜谱
    getByCategory: (categoryId: string) => appApi.get(`/cooking/app/recipe/category/${categoryId}`),

    // 收藏菜谱
    favorite: (id: string) => appApi.post(`/cooking/app/recipe/${id}/favorite`),

    // 取消收藏菜谱
    unfavorite: (id: string) => appApi.delete(`/cooking/app/recipe/${id}/favorite`),

    // 获取收藏的菜谱列表
    getFavorites: () => appApi.get('/cooking/app/recipe/favorites'),
  },

  // 食材相关API (使用应用API)
  ingredients: {
    // 获取食材列表（分页）
    getPage: (params: PageParams) => appApi.get('/cooking/app/ingredient/page', { params }),

    // 获取所有食材
    getAll: () => appApi.get('/cooking/app/ingredient/list'),

    // 获取食材详情
    getDetail: (id: string) => appApi.get(`/cooking/app/ingredient/${id}`),

    // 按分类获取食材
    getByCategory: (categoryId: string) => appApi.get(`/cooking/app/ingredient/category/${categoryId}`),

    // 搜索食材
    search: (keyword: string) => appApi.get('/cooking/app/ingredient/search', { params: { keyword } }),
  },
};

export default apiService; 