<script setup lang="ts">
import { ref } from 'vue'

const cartItems = ref([])
const totalPrice = ref(0)

// 购物车功能待开发
function removeItem(index: number) {
  cartItems.value.splice(index, 1)
  calculateTotal()
}

function calculateTotal() {
  totalPrice.value = cartItems.value.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
}

function checkout() {
  uni.showToast({
    title: '结算功能开发中',
    icon: 'none'
  })
}
</script>

<template>
  <view class="cart-container">
    <view class="cart-header">
      <text class="cart-title">购物车</text>
    </view>

    <view class="cart-content">
      <view v-if="cartItems.length === 0" class="empty-cart">
        <text class="empty-icon">🛒</text>
        <text class="empty-text">购物车是空的</text>
        <text class="empty-desc">快去添加一些美味的食材吧！</text>
      </view>
      
      <view v-else class="cart-list">
        <!-- 购物车商品列表 -->
        <view v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <!-- 商品信息 -->
        </view>
      </view>
    </view>

    <view v-if="cartItems.length > 0" class="cart-footer">
      <view class="total-price">
        <text>总计: ¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <button class="checkout-btn" @tap="checkout">去结算</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cart-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.cart-header {
  background-color: #fff;
  padding: 40rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #eee;
  
  .cart-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.cart-content {
  flex: 1;
  
  .empty-cart {
    text-align: center;
    padding: 200rpx 30rpx;
    
    .empty-icon {
      font-size: 120rpx;
      display: block;
      margin-bottom: 30rpx;
    }
    
    .empty-text {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .empty-desc {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.cart-footer {
  background-color: #fff;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .total-price {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
  
  .checkout-btn {
    background-color: #ff6911;
    color: #fff;
    border: none;
    border-radius: 25rpx;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
  }
}
</style>

<route lang="json">
{
  "navigationBarTitleText": "购物车",
  "navigationStyle": "default"
}
</route>