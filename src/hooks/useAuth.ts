import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, LoginRequest, LoginResponse } from '../types/models';
import { apiService } from '../services/api';

// 存储键名常量
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  EXPIRES_TIME: 'expiresTime',
};

// 初始认证状态
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresTime: null,
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // 从本地存储加载认证信息
  const loadAuthFromStorage = useCallback(async () => {
    try {
      const [accessToken, refreshToken, userInfo, expiresTime] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_INFO),
        AsyncStorage.getItem(STORAGE_KEYS.EXPIRES_TIME),
      ]);

      if (accessToken && refreshToken && userInfo) {
        const user: User = JSON.parse(userInfo);
        const expires = expiresTime ? parseInt(expiresTime, 10) : null;
        
        // 检查token是否过期
        const now = Date.now();
        if (expires && expires > now) {
          setAuthState({
            isAuthenticated: true,
            user,
            accessToken,
            refreshToken,
            expiresTime: expires,
          });
        } else {
          // Token过期，尝试刷新
          if (refreshToken) {
            await handleRefreshToken(refreshToken);
          } else {
            await clearAuthData();
          }
        }
      }
    } catch (error) {
      console.error('加载认证信息失败:', error);
      await clearAuthData();
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存认证信息到本地存储
  const saveAuthToStorage = async (loginResponse: LoginResponse, user: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResponse.accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_TIME, loginResponse.expiresTime.toString()),
      ]);
    } catch (error) {
      console.error('保存认证信息失败:', error);
      throw error;
    }
  };

  // 清除认证数据
  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO),
        AsyncStorage.removeItem(STORAGE_KEYS.EXPIRES_TIME),
      ]);
      setAuthState(initialAuthState);
    } catch (error) {
      console.error('清除认证数据失败:', error);
    }
  };

  // 登录
  const login = async (loginData: LoginRequest): Promise<void> => {
    try {
      setLoginLoading(true);

      // 调用登录API
      const loginResponse = await apiService.auth.login(loginData);

      // 先保存token到本地存储，这样后续的API调用才能携带token
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResponse.accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_TIME, loginResponse.expiresTime.toString()),
      ]);

      // 获取用户信息（此时请求会携带token）
      const userInfoResponse = await apiService.auth.getUserInfo();

      // 保存用户信息到本地存储
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfoResponse.user));

      // 更新状态
      setAuthState({
        isAuthenticated: true,
        user: userInfoResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
        expiresTime: loginResponse.expiresTime,
      });
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    try {
      // 调用登出API
      if (authState.accessToken) {
        await apiService.auth.logout();
      }
    } catch (error) {
      console.error('登出API调用失败:', error);
      // 即使API调用失败，也要清除本地数据
    } finally {
      await clearAuthData();
    }
  };

  // 刷新Token
  const handleRefreshToken = async (refreshToken: string): Promise<void> => {
    try {
      const loginResponse = await apiService.auth.refreshToken(refreshToken);
      const userInfoResponse = await apiService.auth.getUserInfo();
      
      await saveAuthToStorage(loginResponse, userInfoResponse.user);
      
      setAuthState({
        isAuthenticated: true,
        user: userInfoResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
        expiresTime: loginResponse.expiresTime,
      });
    } catch (error) {
      console.error('刷新Token失败:', error);
      await clearAuthData();
      throw error;
    }
  };

  // 检查认证状态
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.expiresTime) {
      return false;
    }

    const now = Date.now();
    if (authState.expiresTime <= now) {
      // Token过期，尝试刷新
      if (authState.refreshToken) {
        try {
          await handleRefreshToken(authState.refreshToken);
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    }

    return true;
  }, [authState]);

  // 组件挂载时加载认证信息
  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  return {
    // 状态
    authState,
    loading,
    loginLoading,
    
    // 方法
    login,
    logout,
    checkAuthStatus,
    
    // 便捷属性
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    accessToken: authState.accessToken,
  };
};

export default useAuth;
