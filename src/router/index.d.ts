declare module '@/router' {
  export interface Router {
    go: (path: string, params?: Record<string, any>, options?: { redirect?: boolean }) => void
    back: () => void
    redirect: (path: string, params?: Record<string, any>) => void
    push: (path: string, params?: Record<string, any>, options?: { redirect?: boolean }) => void
    replace: (path: string, params?: Record<string, any>) => void
    reLaunch: (url: string) => void
  }

  export function useRouter(): Router
}

declare module '@/store' {
  export interface UserStore {
    isLogin: boolean
    token: string
    refreshToken: string
    userInfo: Record<string, any>
    lastUpdateTime: number
    setToken: (token: string, refreshToken: string) => void
    clearToken: () => void
    setUserInfo: (userInfo: Record<string, any>) => void
    getInfo: () => Promise<Record<string, any> | null>
    logout: (skipRequest?: boolean) => Promise<void>
  }

  export interface SysStore {
    theme: string
    version: string
    appName: string
    setTheme: (theme: string) => void
  }

  export function useStore(id: 'user'): UserStore
  export function useStore(id: 'sys'): SysStore
  export function useStore(id: string): any
}

declare module '@/api/member/auth' {
  export interface AuthApi {
    login: (data: { mobile: string, password: string }) => Promise<any>
    smsLogin: (data: { mobile: string, code: string }) => Promise<any>
    sendSmsCode: (mobile: string, scene: string | number) => Promise<any>
    logout: () => Promise<any>
  }

  const AuthUtil: AuthApi
  export default AuthUtil
}

declare module '@/api/member/user' {
  export interface UserApi {
    getUserInfo: () => Promise<any>
    updateUser: (data: Record<string, any>) => Promise<any>
    updateUserMobile: (data: Record<string, any>) => Promise<any>
    updateUserPassword: (data: Record<string, any>) => Promise<any>
    resetUserPassword: (data: Record<string, any>) => Promise<any>
  }

  const UserApi: UserApi
  export default UserApi
}

declare module '@/api/pay/wallet' {
  export interface WalletApi {
    getBalance: () => Promise<any>
    getTransactionList: (data: Record<string, any>) => Promise<any>
    recharge: (data: Record<string, any>) => Promise<any>
  }

  const WalletApi: WalletApi
  export default WalletApi
}

declare module '@/platform' {
  export const name: string
  export const isH5: boolean
  export const isMpWeixin: boolean
  export const isMpAlipay: boolean
  export const isApp: boolean
  export function getPlatformType(): string

  const platform: {
    name: string
    isH5: boolean
    isMpWeixin: boolean
    isMpAlipay: boolean
    isApp: boolean
    getPlatformType: () => string
  }

  export default platform
}

declare module '@/hooks/useModal' {
  export function showAuthModal(type?: string): void
  export function closeAuthModal(): void
  export function showShareModal(params?: Record<string, any>): void
  export function closeShareModal(): void
  export function showSkuModal(params?: Record<string, any>): void
  export function closeSkuModal(): void
} 