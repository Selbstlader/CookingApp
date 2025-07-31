<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

// 獲取用戶 store
const userStore = useStore('user')
const isLogin = computed(() => userStore.isLogin)
const userInfo = computed(() => userStore.userInfo)

// 返回上一頁
function goBack() {
  uni.navigateBack()
}

// 登錄後才能訪問設置頁
function checkLogin() {
  if (!isLogin.value) {
    uni.showToast({
      title: '請先登錄',
      icon: 'none',
    })

    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/home/auth',
      })
    }, 1500)

    return false
  }

  return true
}

// 修改密碼
function changePassword() {
  if (!checkLogin())
    return

  uni.showToast({
    title: '暫未實現，敬請期待',
    icon: 'none',
  })
}

// 修改個人資料
function updateUserInfo() {
  if (!checkLogin())
    return

  uni.showToast({
    title: '暫未實現，敬請期待',
    icon: 'none',
  })
}

// 清除緩存
function clearCache() {
  uni.showModal({
    title: '提示',
    content: '確定要清除緩存嗎？',
    success(res) {
      if (res.confirm) {
        // 清除緩存操作
        uni.clearStorageSync()

        uni.showToast({
          title: '緩存已清除',
          icon: 'success',
        })
      }
    },
  })
}

// 退出登錄
function logout() {
  if (!checkLogin())
    return

  uni.showModal({
    title: '提示',
    content: '確定要退出登錄嗎？',
    success: async (res) => {
      if (res.confirm) {
        await userStore.logout()
        uni.showToast({
          title: '已退出登錄',
          icon: 'success',
        })

        setTimeout(() => {
          uni.switchTab({
            url: '/pages/home/index',
          })
        }, 1500)
      }
    },
  })
}
</script>

<template>
  <view class="settings-container">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">
          ←
        </text>
      </view>
      <text class="title">
        個人設置
      </text>
    </view>

    <view v-if="isLogin" class="user-info">
      <view class="avatar">
        <image class="avatar-img" :src="userInfo.avatar || '/static/logo.svg'" mode="aspectFill" />
      </view>
      <view class="info">
        <text class="name">
          {{ userInfo.nickname || `用戶${userInfo.id}` }}
        </text>
        <text class="mobile">
          {{ userInfo.mobile }}
        </text>
      </view>
    </view>

    <view class="settings-list">
      <view class="settings-group">
        <view class="group-title">
          賬號設置
        </view>

        <view class="setting-item" @tap="updateUserInfo">
          <text class="item-name">
            修改個人資料
          </text>
          <text class="item-arrow">
            >
          </text>
        </view>

        <view class="setting-item" @tap="changePassword">
          <text class="item-name">
            修改密碼
          </text>
          <text class="item-arrow">
            >
          </text>
        </view>
      </view>

      <view class="settings-group">
        <view class="group-title">
          系統設置
        </view>

        <view class="setting-item" @tap="clearCache">
          <text class="item-name">
            清除緩存
          </text>
          <text class="item-arrow">
            >
          </text>
        </view>
      </view>
    </view>

    <view v-if="isLogin" class="logout-btn" @tap="logout">
      <text>退出登錄</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  height: 90rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  position: relative;
  padding: 0 30rpx;

  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-icon {
      font-size: 36rpx;
      color: #333;
    }
  }

  .title {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 70rpx;
    overflow: hidden;
    margin-right: 30rpx;

    .avatar-img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    flex: 1;

    .name {
      font-size: 36rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 10rpx;
      display: block;
    }

    .mobile {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.settings-list {
  .settings-group {
    margin-bottom: 20rpx;

    .group-title {
      padding: 20rpx 30rpx;
      font-size: 28rpx;
      color: #999;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      background-color: #fff;
      border-bottom: 1rpx solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .item-name {
        font-size: 30rpx;
        color: #333;
      }

      .item-arrow {
        color: #ccc;
        font-size: 30rpx;
      }
    }
  }
}

.logout-btn {
  width: 90%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #fff;
  color: #f56c6c;
  font-size: 32rpx;
  text-align: center;
  border-radius: 45rpx;
  margin: 60rpx auto;

  &:active {
    opacity: 0.7;
  }
}
</style>

<route lang="json">
{
  "navigationBarTitleText": "個人設置",
  "navigationStyle": "default"
}
</route>
