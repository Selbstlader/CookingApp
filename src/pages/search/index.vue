<script setup lang="ts">
import { ref } from 'vue'

const searchKeyword = ref('')
const searchResults = ref([])
const loading = ref(false)
const recentSearches = ref(['红烧肉', '宫保鸡丁', '麻婆豆腐'])

function handleSearch() {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  // TODO: 实现搜索逻辑
  setTimeout(() => {
    loading.value = false
    uni.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    })
  }, 1000)
}

function selectRecentSearch(keyword: string) {
  searchKeyword.value = keyword
  handleSearch()
}

function clearRecentSearches() {
  recentSearches.value = []
  uni.showToast({
    title: '已清空搜索历史',
    icon: 'success'
  })
}
</script>

<template>
  <view class="search-container">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-box">
        <input 
          v-model="searchKeyword"
          class="search-input" 
          placeholder="搜索菜谱、食材..."
          @confirm="handleSearch"
        />
        <view class="search-btn" @tap="handleSearch">
          <text class="search-icon">🔍</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-content">
      <view v-if="loading" class="loading">
        <text>搜索中...</text>
      </view>
      <view v-else-if="searchResults.length === 0 && !searchKeyword" class="recent-searches">
        <view class="recent-header">
          <text class="recent-title">最近搜索</text>
          <text class="clear-btn" @tap="clearRecentSearches">清空</text>
        </view>
        <view class="recent-list">
          <view 
            v-for="keyword in recentSearches" 
            :key="keyword"
            class="recent-item"
            @tap="selectRecentSearch(keyword)"
          >
            <text>{{ keyword }}</text>
          </view>
        </view>
      </view>
      <view v-else-if="searchResults.length === 0" class="empty">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">没有找到相关结果</text>
      </view>
      <view v-else class="results">
        <!-- 搜索结果列表 -->
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-header {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 25rpx;
    padding: 0 20rpx;
    
    .search-input {
      flex: 1;
      height: 70rpx;
      font-size: 28rpx;
      color: #333;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .search-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .search-icon {
        font-size: 32rpx;
        color: #666;
      }
    }
  }
}

.search-content {
  padding: 30rpx;
  
  .loading {
    text-align: center;
    padding: 100rpx 0;
    color: #666;
  }
  
  .recent-searches {
    .recent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .recent-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }
      
      .clear-btn {
        font-size: 24rpx;
        color: #666;
        padding: 10rpx 20rpx;
      }
    }
    
    .recent-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .recent-item {
        background-color: #f5f5f5;
        border-radius: 20rpx;
        padding: 15rpx 25rpx;
        font-size: 26rpx;
        color: #666;
      }
    }
  }
  
  .empty {
    text-align: center;
    padding: 100rpx 0;
    
    .empty-icon {
      font-size: 80rpx;
      display: block;
      margin-bottom: 20rpx;
    }
    
    .empty-text {
      color: #999;
      font-size: 28rpx;
    }
  }
}
</style>

<route lang="json">
{
  "navigationBarTitleText": "搜索",
  "navigationStyle": "default"
}
</route>