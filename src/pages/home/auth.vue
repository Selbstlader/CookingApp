<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import AuthUtil from '@/api/member/auth'
import $store from '@/store'

// 响应式数据
const showSteps = ref(false)
const currentStep = ref(1)
const activeTab = ref('login') // 当前激活的tab：login, register
const loginType = ref('password') // 登录方式：password-密码登录 sms-验证码登录
const registerType = ref('mobile') // 注册方式：mobile-手机号注册 username-用户名注册
const registerStep = ref(1) // 注册步骤：1-手机验证 2-设置密码
const isLoading = ref(false)
const codeText = ref('获取验证码')
const codeTimer = ref(null)
let countDown = 60

// 登录表单数据
const loginForm = reactive({
  mobile: '',
  password: '',
  code: '',
})

// 注册表单数据
const registerForm = reactive({
  mobile: '',
  code: '',
  password: '',
  confirmPassword: '',
  username: '',
  nickname: '',
})

// 切换主tab（登录/注册）
function switchTab(tab) {
  activeTab.value = tab
  // 重置表单和状态
  resetForms()
}

// 切换登录方式
function switchLoginType(type) {
  loginType.value = type
  loginForm.password = ''
  loginForm.code = ''
}

// 切换注册方式
function switchRegisterType(type) {
  registerType.value = type
  registerStep.value = type === 'mobile' ? 1 : 2
  resetRegisterForm()
}

// 重置表单
function resetForms() {
  // 重置登录表单
  loginForm.mobile = ''
  loginForm.password = ''
  loginForm.code = ''

  // 重置注册表单
  resetRegisterForm()

  // 清除验证码倒计时
  if (codeTimer.value) {
    clearInterval(codeTimer.value)
    codeTimer.value = null
    codeText.value = '获取验证码'
  }
}

function resetRegisterForm() {
  registerForm.mobile = ''
  registerForm.code = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.username = ''
  registerForm.nickname = ''
}

// 获取验证码
function getCode() {
  if (codeText.value !== '获取验证码')
    return

  const mobile = activeTab.value === 'login' ? loginForm.mobile : registerForm.mobile
  if (!mobile) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none',
    })
    return
  }

  // 检查手机号格式
  const mobileReg = /^1\d{10}$/
  if (!mobileReg.test(mobile)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none',
    })
    return
  }

  const scene = activeTab.value === 'login' ? 'login' : 'register'

  AuthUtil.sendSmsCode(mobile, scene)
    .then(() => {
      startCodeCountDown()
    })
    .catch((error) => {
      console.error('获取验证码失败', error)
    })
}

// 开始验证码倒计时
function startCodeCountDown() {
  countDown = 60
  codeText.value = `${countDown}秒后重新获取`

  codeTimer.value = setInterval(() => {
    countDown--
    codeText.value = `${countDown}秒后重新获取`

    if (countDown <= 0) {
      clearInterval(codeTimer.value)
      codeTimer.value = null
      codeText.value = '获取验证码'
    }
  }, 1000)
}

// 登录
async function handleLogin() {
  if (isLoading.value)
    return

  // 表单验证
  if (!loginForm.mobile) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none',
    })
    return
  }

  if (loginType.value === 'password' && !loginForm.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none',
    })
    return
  }

  if (loginType.value === 'sms' && !loginForm.code) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none',
    })
    return
  }

  isLoading.value = true

  try {
    let result
    if (loginType.value === 'password') {
      result = await AuthUtil.login({
        mobile: loginForm.mobile,
        password: loginForm.password,
      })
    }
    else {
      result = await AuthUtil.smsLogin({
        mobile: loginForm.mobile,
        code: loginForm.code,
      })
    }

    if (result && result.code === 0) {
      // 登录成功后立即获取用户信息
      const userStore = $store('user')
      await userStore.getInfo()

      uni.showToast({
        title: '登录成功',
        icon: 'success',
      })

      // 延迟显示引导步骤
      setTimeout(() => {
        showSteps.value = true
      }, 1500)
    }
  }
  catch (error) {
    console.error('登录失败', error)
  }
  finally {
    isLoading.value = false
  }
}

// 注册下一步
function nextRegisterStep() {
  if (!registerForm.mobile || !registerForm.code) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    })
    return
  }

  // 验证手机号格式
  const mobileReg = /^1\d{10}$/
  if (!mobileReg.test(registerForm.mobile)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none',
    })
    return
  }

  // 验证验证码格式
  if (registerForm.code.length !== 6) {
    uni.showToast({
      title: '请输入6位验证码',
      icon: 'none',
    })
    return
  }

  registerStep.value = 2
}

// 注册上一步
function prevRegisterStep() {
  registerStep.value = 1
}

// 注册
async function handleRegister() {
  if (isLoading.value)
    return

  // 表单验证
  if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    })
    return
  }

  // 手机号注册需要验证手机号和验证码
  if (registerType.value === 'mobile') {
    if (!registerForm.mobile || !registerForm.code) {
      uni.showToast({
        title: '请填写手机号和验证码',
        icon: 'none',
      })
      return
    }

    // 验证手机号格式
    const mobileReg = /^1\d{10}$/
    if (!mobileReg.test(registerForm.mobile)) {
      uni.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return
    }

    // 验证验证码格式
    if (registerForm.code.length !== 6) {
      uni.showToast({
        title: '请输入6位验证码',
        icon: 'none',
      })
      return
    }
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    uni.showToast({
      title: '两次密码不一致',
      icon: 'none',
    })
    return
  }

  if (registerForm.password.length < 6) {
    uni.showToast({
      title: '密码长度不能少于6位',
      icon: 'none',
    })
    return
  }

  // 验证用户名格式（4-20位字母数字下划线）
  const usernameReg = /^\w{4,20}$/
  if (!usernameReg.test(registerForm.username)) {
    uni.showToast({
      title: '用户名格式不正确（4-20位字母数字下划线）',
      icon: 'none',
    })
    return
  }

  isLoading.value = true

  // 构建注册参数
  const registerParams = {
    username: registerForm.username,
    password: registerForm.password,
    confirmPassword: registerForm.confirmPassword,
    nickname: registerForm.nickname || registerForm.username,
  }

  // 如果是手机号注册，添加手机号和验证码
  if (registerType.value === 'mobile') {
    registerParams.mobile = registerForm.mobile
    registerParams.code = registerForm.code
  }

  try {
    const result = await AuthUtil.register(registerParams)

    if (result && result.code === 0) {
      // 注册成功后立即获取用户信息
      const userStore = $store('user')
      await userStore.getInfo()

      uni.showToast({
        title: '注册成功',
        icon: 'success',
      })

      // 延迟显示引导步骤
      setTimeout(() => {
        showSteps.value = true
      }, 1500)
    }
    else {
      uni.showToast({
        title: result?.msg || '注册失败，请重试',
        icon: 'none',
      })
    }
  }
  catch (error) {
    console.error('注册失败', error)
    uni.showToast({
      title: error?.msg || '注册失败，请重试',
      icon: 'none',
    })
  }
  finally {
    isLoading.value = false
  }
}

// 第三方登录
function loginWithApple() {
  showSteps.value = true
}

function loginWithFacebook() {
  showSteps.value = true
}

function loginWithGoogle() {
  showSteps.value = true
}

// 打开服务条款
function openTerms() {
  // 打开服务条款页面
}

function openPrivacy() {
  // 打开隐私政策页面
}

function openContent() {
  // 打开内容政策页面
}

// 下一步
function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
  }
  else {
    completeSteps()
  }
}

// 跳过步骤
function skipSteps() {
  uni.redirectTo({
    url: '/pages/home/index',
    success: () => {
      // 通知首页刷新数据
      uni.$emit('refreshHomeData')
    },
  })
}

// 完成步骤
function completeSteps() {
  uni.redirectTo({
    url: '/pages/home/index',
    success: () => {
      // 通知首页刷新数据
      uni.$emit('refreshHomeData')
    },
  })
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (codeTimer.value) {
    clearInterval(codeTimer.value)
    codeTimer.value = null
  }
})

onMounted(() => {
  // 页面初始化
})
</script>

<template>
  <view class="auth-container">
    <!-- 登录注册表单 -->
    <view v-if="!showSteps" class="form-container">
      <!-- 顶部美食图片背景 -->
      <view class="header-section">
        <image class="food-background" src="@/assets/image/loginbg.png" mode="aspectFill" />
        <view class="header-overlay">
          <view class="app-info">
            <text class="app-name">
              Mallika
            </text>
            <text class="app-slogan">
              Everyone can be a chef
            </text>
          </view>
        </view>
      </view>

      <!-- 登录表单区域 -->
      <view class="login-section">
        <!-- Tab切换 -->
        <view class="tab-container">
          <view
            class="tab-item"
            :class="{ active: activeTab === 'login' }"
            @click="switchTab('login')"
          >
            <text class="tab-text">
              登录
            </text>
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 'register' }"
            @click="switchTab('register')"
          >
            <text class="tab-text">
              注册
            </text>
          </view>
        </view>

        <!-- 登录表单 -->
        <view v-if="activeTab === 'login'" class="form-content">
          <!-- 登录方式切换 -->
          <view class="login-tabs">
            <view class="tab-item" :class="{ active: loginType === 'password' }" @click="switchLoginType('password')">
              密码登录
            </view>
            <view class="tab-item" :class="{ active: loginType === 'sms' }" @click="switchLoginType('sms')">
              验证码登录
            </view>
          </view>

          <!-- 手机号输入 -->
          <view class="input-container">
            <input
              v-model="loginForm.mobile"
              class="form-input"
              placeholder="请输入手机号码"
              type="number"
              maxlength="11"
            >
          </view>

          <!-- 密码输入 -->
          <view v-if="loginType === 'password'" class="input-container">
            <input
              v-model="loginForm.password"
              class="form-input"
              placeholder="请输入密码"
              type="password"
            >
          </view>

          <!-- 验证码输入 -->
          <view v-else class="input-container">
            <input
              v-model="loginForm.code"
              class="form-input"
              placeholder="请输入验证码"
              type="number"
              maxlength="6"
            >
            <button class="code-btn" @click="getCode">
              {{ codeText }}
            </button>
          </view>

          <!-- 登录按钮 -->
          <button class="submit-btn" :class="{ loading: isLoading }" @click="handleLogin">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </view>

        <!-- 注册表单 -->
        <view v-else class="form-content">
          <!-- 注册方式切换 -->
          <view class="register-type-tabs">
            <view
              class="tab-item"
              :class="{ active: registerType === 'mobile' }"
              @click="switchRegisterType('mobile')"
            >
              手机号注册
            </view>
            <view
              class="tab-item"
              :class="{ active: registerType === 'username' }"
              @click="switchRegisterType('username')"
            >
              用户名注册
            </view>
          </view>

          <!-- 手机号注册：步骤1 - 手机验证 -->
          <view v-if="registerType === 'mobile' && registerStep === 1">
            <view class="input-container">
              <input
                v-model="registerForm.mobile"
                class="form-input"
                placeholder="请输入手机号码"
                type="number"
                maxlength="11"
              >
            </view>

            <view class="input-container">
              <input
                v-model="registerForm.code"
                class="form-input"
                placeholder="请输入验证码"
                type="number"
                maxlength="6"
              >
              <button class="code-btn" @click="getCode">
                {{ codeText }}
              </button>
            </view>

            <button class="submit-btn" @click="nextRegisterStep">
              下一步
            </button>
          </view>

          <!-- 手机号注册：步骤2 - 设置密码 / 用户名注册 -->
          <view v-else>
            <view class="input-container">
              <input
                v-model="registerForm.username"
                class="form-input"
                placeholder="请输入用户名（4-20位字母数字下划线）"
                type="text"
                maxlength="20"
              >
            </view>

            <view class="input-container">
              <input
                v-model="registerForm.nickname"
                class="form-input"
                placeholder="请输入昵称（可选）"
                type="text"
                maxlength="20"
              >
            </view>

            <view class="input-container">
              <input
                v-model="registerForm.password"
                class="form-input"
                placeholder="请设置登录密码"
                type="password"
              >
            </view>

            <view class="input-container">
              <input
                v-model="registerForm.confirmPassword"
                class="form-input"
                placeholder="请再次输入密码"
                type="password"
              >
            </view>

            <view class="password-tips">
              密码长度不少于6位，建议使用字母、数字和符号组合
            </view>

            <button class="submit-btn" :class="{ loading: isLoading }" @click="handleRegister">
              {{ isLoading ? '注册中...' : '完成注册' }}
            </button>

            <button v-if="registerType === 'mobile'" class="back-btn" @click="prevRegisterStep">
              返回上一步
            </button>
          </view>
        </view>

        <!-- 分隔线 -->
        <view class="divider-container">
          <view class="divider-line" />
          <text class="divider-text">
            OR
          </text>
          <view class="divider-line" />
        </view>

        <!-- 第三方登录 -->
        <view class="social-login">
          <!-- Apple登录 -->
          <button class="social-btn apple-btn" @click="loginWithApple">
            <image class="social-icon" src="@/assets/image/apple-icon.svg" />
            <text class="social-text">
              Continue with Apple
            </text>
          </button>

          <!-- Facebook和Google登录 -->
          <view class="social-row">
            <button class="social-btn facebook-btn" @click="loginWithFacebook">
              <image class="social-icon" src="@/assets/image/facebook-icon.svg" />
              <text class="social-text">
                Facebook
              </text>
            </button>
            <button class="social-btn google-btn" @click="loginWithGoogle">
              <image class="social-icon" src="@/assets/image/google-icon.svg" />
              <text class="social-text">
                Google
              </text>
            </button>
          </view>
        </view>

        <!-- 服务条款 -->
        <view class="terms-container">
          <text class="terms-text">
            By continuing, you agree to our
          </text>
          <text class="terms-link" @click="openTerms">
            Terms of Service
          </text>
          <text class="terms-text">
            •
          </text>
          <text class="terms-link" @click="openPrivacy">
            Privacy Policy
          </text>
          <text class="terms-text">
            •
          </text>
          <text class="terms-link" @click="openContent">
            Content Policy
          </text>
        </view>
      </view>
    </view>

    <!-- 登录后的步骤页面 -->
    <view v-else class="steps-container">
      <!-- 步骤1 -->
      <view v-if="currentStep === 1" class="step-page">
        <view class="step-header">
          <text class="step-number">
            1/3
          </text>
          <text class="step-title">
            欢迎来到美食世界
          </text>
        </view>
        <view class="step-content">
          <image class="step-image" src="@/assets/image/step1.png" />
          <view class="step-text">
            <text class="step-title">
              发现美食
            </text>
            <text class="step-desc">
              探索各种美味菜谱
            </text>
            <text class="step-desc">
              找到你喜欢的料理
            </text>
            <text class="step-desc">
              收藏心仪的美食
            </text>
            <text class="step-desc">
              开启你的美食之旅
            </text>
          </view>
        </view>
        <view class="step-actions">
          <text class="skip-btn" @click="skipSteps">
            跳过
          </text>
          <text class="next-btn" @click="nextStep">
            下一步
          </text>
        </view>
      </view>

      <!-- 步骤2 -->
      <view v-if="currentStep === 2" class="step-page">
        <view class="step-header">
          <text class="step-number">
            2/3
          </text>
          <text class="step-title">
            学习制作技巧
          </text>
        </view>
        <view class="step-content">
          <image class="step-image" src="@/assets/image/step2.png" />
          <view class="step-text">
            <text class="step-title">
              学习制作
            </text>
            <text class="step-desc">
              跟随详细的制作步骤
            </text>
            <text class="step-desc">
              掌握烹饪技巧和窍门
            </text>
            <text class="step-desc">
              成为料理达人
            </text>
          </view>
        </view>
        <view class="step-actions">
          <text class="skip-btn" @click="skipSteps">
            跳过
          </text>
          <text class="next-btn" @click="nextStep">
            下一步
          </text>
        </view>
      </view>

      <!-- 步骤3 -->
      <view v-if="currentStep === 3" class="step-page">
        <view class="step-header">
          <text class="step-number">
            3/3
          </text>
          <text class="step-title">
            分享美食体验
          </text>
        </view>
        <view class="step-content">
          <image class="step-image" src="@/assets/image/step3.png" />
          <view class="step-text">
            <text class="step-title">
              分享体验
            </text>
            <text class="step-desc">
              分享你的制作成果
            </text>
            <text class="step-desc">
              与朋友交流心得体会
            </text>
            <text class="step-desc">
              建立美食社交圈
            </text>
          </view>
        </view>
        <view class="step-actions">
          <text class="complete-btn" @click="completeSteps">
            开始使用
          </text>
          <text class="skip-btn" @click="skipSteps">
            跳过
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶部美食背景区域 */
.header-section {
  position: relative;
  height: 60vh;
  overflow: hidden;
}

.food-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  padding: 60rpx 40rpx 40rpx;
}

.app-info {
  text-align: center;
}

.app-name {
  display: block;
  font-size: 72rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 16rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.app-slogan {
  display: block;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 登录表单区域 */
.login-section {
  flex: 1;
  padding: 60rpx 40rpx 40rpx;
  background: white;
  border-radius: 40rpx 40rpx 0 0;
  margin-top: -40rpx;
  position: relative;
  z-index: 1;
}

/* Tab切换 */
.tab-container {
  display: flex;
  background: #f8f9fa;
  border-radius: 24rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 16rpx;
  transition: all 0.3s ease;
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
}

.tab-item.active {
  background: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  color: #ff6b35;
  font-weight: 600;
}

.tab-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #ff6b35;
  font-weight: 600;
}

/* 登录方式切换 */
.login-tabs {
  display: flex;
  margin-bottom: 32rpx;
  border-bottom: 2rpx solid #eee;
}

.login-tabs .tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 30rpx;
  color: #666;
  position: relative;
  background: none;
  box-shadow: none;
  border-radius: 0;
}

.login-tabs .tab-item.active {
  color: #ff6b35;
  font-weight: 500;
  background: none;
  box-shadow: none;
}

.login-tabs .tab-item.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  width: 40%;
  height: 4rpx;
  background-color: #ff6b35;
}

/* 注册方式切换 */
.register-type-tabs {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 45rpx;
  padding: 6rpx;
  margin-bottom: 32rpx;
}

.register-type-tabs .tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 39rpx;
  transition: all 0.3s ease;
  background: none;
  box-shadow: none;
}

.register-type-tabs .tab-item.active {
  background-color: #fff;
  color: #ff6b35;
  font-weight: 500;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 表单内容 */
.form-content {
  margin-bottom: 40rpx;
}

/* 输入框 */
.input-container {
  position: relative;
  margin-bottom: 32rpx;
}

.form-input {
  width: 100%;
  height: 96rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 24rpx;
  padding: 0 24rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #999;
}

.form-input:focus {
  border-color: #ff6b35;
  background: white;
}

/* 验证码按钮 */
.code-btn {
  position: absolute;
  right: 20rpx;
  top: 15rpx;
  background: none;
  border: none;
  font-size: 26rpx;
  color: #ff6b35;
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-left: 2rpx solid #ddd;
  border-radius: 0;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 96rpx;
  background: #ff6b35;
  border: none;
  border-radius: 24rpx;
  color: white;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 40rpx;
}

.submit-btn.loading {
  opacity: 0.8;
}

/* 返回按钮 */
.back-btn {
  width: 100%;
  height: 96rpx;
  background: #f5f5f5;
  border: none;
  border-radius: 24rpx;
  color: #666;
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 20rpx;
}

/* 密码提示 */
.password-tips {
  font-size: 24rpx;
  color: #999;
  padding: 0 20rpx;
  margin-bottom: 30rpx;
  line-height: 1.5;
}

/* 分隔线 */
.divider-container {
  display: flex;
  align-items: center;
  margin: 40rpx 0;
}

.divider-line {
  flex: 1;
  height: 2rpx;
  background: #e9ecef;
}

.divider-text {
  margin: 0 24rpx;
  font-size: 28rpx;
  color: #999;
}

/* 第三方登录 */
.social-login {
  margin-bottom: 40rpx;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e9ecef;
  background: white;
  margin-bottom: 24rpx;
}

.apple-btn {
  background: #000;
  border-color: #000;
}

.apple-btn .social-text {
  color: white;
}

.social-row {
  display: flex;
  gap: 24rpx;
}

.social-row .social-btn {
  flex: 1;
  margin-bottom: 0;
}

.social-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

.social-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

/* 服务条款 */
.terms-container {
  text-align: center;
  padding: 20rpx 0;
}

.terms-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.terms-link {
  font-size: 24rpx;
  color: #333;
  text-decoration: underline;
  line-height: 1.5;
}

/* 步骤页面样式保持不变 */
.steps-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40rpx;
  background: linear-gradient(135deg, var(--ui-BG-Main, #ff6b35) 0%, var(--ui-BG-Main-gradient, #ff8f65) 100%);
}

.step-page {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-header {
  margin-bottom: 60rpx;
}

.step-number {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.step-image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 40rpx;
}

.step-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.step-title {
  color: white;
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.step-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 32rpx;
  line-height: 1.5;
}

.step-actions {
  display: flex;
  gap: 40rpx;
  width: 100%;
  justify-content: center;
}

.next-btn,
.complete-btn {
  background: rgba(255, 255, 255, 1);
  color: var(--ui-BG-Main, #ff6b35);
  padding: 24rpx 60rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.skip-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  padding: 24rpx 60rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}
</style>
