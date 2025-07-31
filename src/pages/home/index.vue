<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getDishPage } from "@/api/cooking/dish";
import { getSimpleCategoryList } from "@/api/cooking/category";
import $store from "@/store";

// 响应式数据
const searchKeyword = ref("");
const categories = ref([]);
const featuredDishes = ref([]);
const specialDishes = ref([]);
const communityRecipes = ref([]);
const loading = ref(false);
const selectedCategoryId = ref(null);

// 页面加载时获取数据
onMounted(async () => {
  // 检查登录状态
  const userStore = $store("user");
  if (!userStore.isLogin) {
    // 未登录时跳转到登录页
    uni.navigateTo({
      url: "/pages/home/auth",
    });
    return;
  }

  // 确保用户信息已加载
  if (!userStore.userInfo.id) {
    try {
      await userStore.getInfo();
    } catch (error) {
      console.error("获取用户信息失败", error);
      // 如果获取用户信息失败，跳转到登录页
      uni.navigateTo({
        url: "/pages/home/auth",
      });
      return;
    }
  }

  // 加载页面数据
  await loadPageData();

  // 监听登录成功后的数据刷新事件
  uni.$on("refreshHomeData", loadPageData);
});

onUnmounted(() => {
  // 移除事件监听
  uni.$off("refreshHomeData", loadPageData);
});

// 加载页面数据
async function loadPageData() {
  await Promise.all([
    loadCategories(),
    loadFeaturedDishes(),
    loadSpecialDishes(),
    loadCommunityRecipes(),
  ]);
}

// 加载分类数据
async function loadCategories() {
  try {
    const { data } = await getSimpleCategoryList();
    categories.value = data || [];
  } catch (error) {
    console.error("加载分类失败:", error);
  }
}

// 加载特色菜品
async function loadFeaturedDishes() {
  try {
    const { data } = await getDishPage({ pageNo: 1, pageSize: 6 });
    featuredDishes.value = data?.list || [];
  } catch (error) {
    console.error("加载特色菜品失败:", error);
  }
}

// 加载特别推荐
async function loadSpecialDishes() {
  try {
    const { data } = await getDishPage({ pageNo: 1, pageSize: 1 });
    specialDishes.value = data?.list || [];
  } catch (error) {
    console.error("加载特别推荐失败:", error);
  }
}

// 加载社区菜谱
async function loadCommunityRecipes() {
  try {
    const { data } = await getDishPage({ pageNo: 1, pageSize: 3 });
    communityRecipes.value = data?.list || [];
  } catch (error) {
    console.error("加载社区菜谱失败:", error);
  }
}

// 搜索功能
function handleSearch() {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: "请输入搜索关键词",
      icon: "none",
    });
    return;
  }

  uni.navigateTo({
    url: `/pages/search/index?keyword=${encodeURIComponent(
      searchKeyword.value
    )}`,
  });
}

// 分类筛选
function handleCategoryFilter(categoryId) {
  selectedCategoryId.value = categoryId;
  uni.navigateTo({
    url: `/pages/category/index?categoryId=${categoryId}`,
  });
}

// 跳转到菜品详情
function goToDishDetail(dishId) {
  uni.navigateTo({
    url: `/pages/dish/detail?id=${dishId}`,
  });
}

// 格式化难度
function formatDifficulty(difficulty) {
  const levels = ["简单", "中等", "困难"];
  return levels[difficulty - 1] || "未知";
}

// 格式化烹饪时间
function formatCookingTime(time) {
  return `${time}分钟`;
}
</script>

<template>
  <view class="home-container">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-box">
        <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="Recipe Title, Ingredient"
          @confirm="handleSearch"
        />
        <view class="search-icon" @tap="handleSearch">
          <text class="_icon-search"></text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- Cookbooks 特色菜品区域 -->
      <view class="section cookbooks-section">
        <view class="section-header">
          <text class="section-title">Cookbooks</text>
        </view>
        <scroll-view class="cookbooks-scroll" scroll-x>
          <view class="cookbooks-list">
            <view
              v-for="dish in featuredDishes"
              :key="dish.id"
              class="cookbook-item"
              @tap="goToDishDetail(dish.id)"
            >
              <image
                class="cookbook-image"
                :src="dish.imageName || '/static/logo.svg'"
                mode="aspectFill"
              />
              <view class="cookbook-info">
                <text class="cookbook-title">{{ dish.name }}</text>
                <text class="cookbook-meta"
                  >{{ formatDifficulty(dish.difficulty) }} •
                  {{ formatCookingTime(dish.cookingTime) }}</text
                >
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 特别推荐区域 -->
      <view v-if="specialDishes.length > 0" class="section special-section">
        <view class="special-card" @tap="goToDishDetail(specialDishes[0].id)">
          <image
            class="special-image"
            :src="specialDishes[0].imageName || '/static/logo.svg'"
            mode="aspectFill"
          />
          <view class="special-content">
            <view class="special-badge">Buku resep spesial antara</view>
            <text class="special-title">{{ specialDishes[0].name }}</text>
            <text class="special-desc">{{
              specialDishes[0].description ||
              "Resep yang sangat istimewa untuk Anda coba"
            }}</text>
          </view>
        </view>
      </view>

      <!-- Featured Community Recipes -->
      <view class="section community-section">
        <view class="section-header">
          <text class="section-title">Featured Community Recipes</text>
          <text class="section-subtitle"
            >Resep pilihan dari komunitas kami</text
          >
        </view>
        <view class="community-list">
          <view
            v-for="recipe in communityRecipes"
            :key="recipe.id"
            class="community-item"
            @tap="goToDishDetail(recipe.id)"
          >
            <image
              class="community-image"
              :src="recipe.imageName || '/static/logo.svg'"
              mode="aspectFill"
            />
            <view class="community-info">
              <text class="community-title">{{ recipe.name }}</text>
              <view class="community-meta">
                <text class="community-time">{{
                  formatCookingTime(recipe.cookingTime)
                }}</text>
                <text class="community-difficulty">{{
                  formatDifficulty(recipe.difficulty)
                }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 分类导航 -->
      <view class="section category-section">
        <view class="section-header">
          <text class="section-title">Category</text>
        </view>
        <view class="category-grid">
          <view
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            @tap="handleCategoryFilter(category.id)"
          >
            <view class="category-icon">
              <text class="category-emoji">🍳</text>
            </view>
            <text class="category-name">{{ category.name }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

// 搜索头部
.search-header {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .search-box {
    position: relative;
    background-color: #f5f5f5;
    border-radius: 25rpx;
    padding: 20rpx 60rpx 20rpx 30rpx;

    .search-input {
      width: 100%;
      font-size: 28rpx;
      color: #333;

      &::placeholder {
        color: #999;
      }
    }

    .search-icon {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        font-size: 32rpx;
        color: #666;
      }
    }
  }
}

// 主要内容
.main-content {
  flex: 1;
  padding: 0 30rpx;
}

// 通用section样式
.section {
  margin-bottom: 40rpx;

  .section-header {
    margin-bottom: 30rpx;

    .section-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 10rpx;
    }

    .section-subtitle {
      font-size: 24rpx;
      color: #666;
    }
  }
}

// Cookbooks区域
.cookbooks-section {
  .cookbooks-scroll {
    white-space: nowrap;

    .cookbooks-list {
      display: flex;
      gap: 20rpx;

      .cookbook-item {
        width: 300rpx;
        flex-shrink: 0;
        background-color: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

        .cookbook-image {
          width: 100%;
          height: 200rpx;
        }

        .cookbook-info {
          padding: 20rpx;

          .cookbook-title {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
            display: block;
            margin-bottom: 10rpx;
          }

          .cookbook-meta {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
}

// 特别推荐区域
.special-section {
  .special-card {
    position: relative;
    height: 300rpx;
    border-radius: 20rpx;
    overflow: hidden;

    .special-image {
      width: 100%;
      height: 100%;
    }

    .special-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      padding: 40rpx 30rpx 30rpx;
      color: #fff;

      .special-badge {
        background-color: #ff6911;
        color: #fff;
        font-size: 20rpx;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        display: inline-block;
        margin-bottom: 15rpx;
      }

      .special-title {
        font-size: 32rpx;
        font-weight: 600;
        display: block;
        margin-bottom: 10rpx;
      }

      .special-desc {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
  }
}

// 社区菜谱区域
.community-section {
  .community-list {
    .community-item {
      display: flex;
      margin-bottom: 30rpx;
      background-color: #fff;
      border-radius: 15rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

      .community-image {
        width: 120rpx;
        height: 120rpx;
        flex-shrink: 0;
      }

      .community-info {
        flex: 1;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .community-title {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 15rpx;
        }

        .community-meta {
          display: flex;
          gap: 20rpx;

          .community-time,
          .community-difficulty {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
}

// 分类区域
.category-section {
  .category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .category-item {
      width: calc(25% - 15rpx);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;

      .category-icon {
        width: 80rpx;
        height: 80rpx;
        background-color: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15rpx;

        .category-emoji {
          font-size: 40rpx;
        }
      }

      .category-name {
        font-size: 24rpx;
        color: #333;
        text-align: center;
      }
    }
  }
}
</style>

<route lang="json">
{
  "navigationBarTitleText": "烹飪社區",
  "navigationStyle": "custom"
}
</route>
