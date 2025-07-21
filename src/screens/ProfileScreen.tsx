import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import React from 'react';
import TabSwitcher from '../components/TabSwitcher';
import RecipeCard from '../components/RecipeCard';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../hooks/useAuth';

// 用户信息模拟数据
const USER_DATA = {
  name: '张厨师',
  avatar: 'https://via.placeholder.com/100',
  level: '烹饪达人',
  intro: '热爱美食，乐于分享',
  recipes: 8,
  favorites: 24,
  followers: 120,
  following: 45,
  bg: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
};

// 用户菜谱记录模拟数据
const USER_ACTIVITY = [
  { id: '1', type: '发布', title: '红烧肉', time: '3天前' },
  { id: '2', type: '收藏', title: '糖醋排骨', time: '1周前' },
  { id: '3', type: '点评', title: '麻婆豆腐', time: '2周前' },
];

const POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    title: '红烧肉',
    author: '张厨师',
    likes: 130,
    reviews: 103,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    title: '咖喱鸡',
    author: '张厨师',
    likes: 98,
    reviews: 80,
  },
];

const REVIEWS = [
  {
    id: '1',
    recipeImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    recipeTitle: '红烧肉',
    comment: '做法简单，味道很棒，家人都喜欢！',
  },
  {
    id: '2',
    recipeImage: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    recipeTitle: '咖喱鸡',
    comment: '香气扑鼻，步骤清晰，值得一试。',
  },
];

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = React.useState('Posts');
  const { user } = useAuth();

  // 使用真实用户数据或默认数据
  const displayUser = user ? {
    name: user.nickname || user.username,
    avatar: user.avatar || USER_DATA.avatar,
    level: '烹饪爱好者',
    intro: '热爱美食，乐于分享',
    recipes: USER_DATA.recipes,
    favorites: USER_DATA.favorites,
    followers: USER_DATA.followers,
    following: USER_DATA.following,
    bg: USER_DATA.bg,
  } : USER_DATA;

  return (
    <ScrollView style={styles.container}>
      {/* 顶部背景图 */}
      <ImageBackground source={{ uri: displayUser.bg }} style={styles.bgImg}>
        {/* 空内容，仅作背景 */}
      </ImageBackground>
      {/* 白色卡片，包含头像、昵称、简介、关注等 */}
      <View style={styles.profileCardWrapper}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: displayUser.avatar }} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{displayUser.name}</Text>
        <Text style={styles.level}>{displayUser.level}</Text>
        <Text style={styles.intro}>{displayUser.intro}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayUser.recipes}</Text>
            <Text style={styles.statLabel}>菜谱</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayUser.favorites}</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayUser.followers}</Text>
            <Text style={styles.statLabel}>粉丝</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayUser.following}</Text>
            <Text style={styles.statLabel}>关注</Text>
          </View>
        </View>
        {/* TabSwitcher 悬浮在卡片顶部边缘 */}
        <View style={styles.tabSwitcherWrapper}>
          <TabSwitcher
            tabs={['Posts', 'Reviews']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
      </View>
      {/* Tab内容 */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        {activeTab === 'Posts' ? (
          POSTS.map(item => (
            <RecipeCard
              key={item.id}
              image={item.image}
              title={item.title}
              author={item.author}
              likes={item.likes}
              reviews={item.reviews}
            />
          ))
        ) : (
          REVIEWS.map(item => (
            <ReviewCard
              key={item.id}
              recipeImage={item.recipeImage}
              recipeTitle={item.recipeTitle}
              comment={item.comment}
            />
          ))
        )}
      </View>
      {/* 个人选项菜单 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>我的菜谱</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>我的收藏</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>浏览历史</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>个人设置</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
      {/* 最近动态 */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>最近动态</Text>
        {USER_ACTIVITY.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityType}>
              <Text style={styles.activityTypeText}>{activity.type}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
      {/* 底部按钮 */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bgImg: {
    width: '100%',
    height: 180,
  },
  profileCardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -40,
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  avatarWrapper: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -50,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabSwitcherWrapper: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: -32,
    zIndex: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  level: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 8,
  },
  intro: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 18,
    color: '#ccc',
  },
  activityContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityType: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  activityTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
    marginBottom: 40,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
});

export default ProfileScreen; 