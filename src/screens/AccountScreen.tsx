import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../hooks/useAuth';

const LIKED_RECIPES = [
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

const NOTIFICATIONS = [
  { id: '1', text: '您的菜谱“红烧肉”获得了新评论' },
  { id: '2', text: '恭喜，您获得了新粉丝！' },
];

const TABS = [
  { key: 'liked', label: '我喜欢的' },
  { key: 'notifications', label: '通知' },
  { key: 'settings', label: '设置' },
];

const USER = {
  avatar: 'https://via.placeholder.com/50',
  name: '用户名',
  email: 'example@example.com',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff6b6b',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

const AccountScreen = () => {
  const [activeTab, setActiveTab] = useState('liked');
  const { user, logout } = useAuth();

  // 使用真实用户数据或默认数据
  const displayUser = user ? {
    avatar: user.avatar || USER.avatar,
    name: user.nickname || user.username,
    email: user.email || '未设置邮箱',
  } : USER;

  // 处理登出
  const handleLogout = () => {
    Alert.alert(
      '确认登出',
      '您确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('登出失败:', error);
              Alert.alert('错误', '登出失败，请稍后重试');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 头部用户信息 */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={{ uri: displayUser.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{displayUser.name}</Text>
          <Text style={styles.email}>{displayUser.email}</Text>
        </View>
      </View>
      {/* Tab切换 */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Tab内容 */}
      <View style={styles.tabContent}>
        {activeTab === 'liked' && (
          LIKED_RECIPES.map(item => (
            <RecipeCard
              key={item.id}
              image={item.image}
              title={item.title}
              author={item.author}
              likes={item.likes}
              reviews={item.reviews}
            />
          ))
        )}
        {activeTab === 'notifications' && (
          <View>
            {NOTIFICATIONS.map(n => (
              <View key={n.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 15 }}>{n.text}</Text>
              </View>
            ))}
          </View>
        )}
        {activeTab === 'settings' && (
          <View>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>账号安全</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>消息通知设置</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>隐私</Text></TouchableOpacity>
          </View>
        )}
      </View>
      {/* 通用设置项 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通用</Text>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>关于</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>帮助与支持</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>反馈</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>评分</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>检查更新</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={[styles.menuText, { color: '#ff6b6b' }]}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AccountScreen; 