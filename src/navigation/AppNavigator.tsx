import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import RecipeScreen from '../screens/RecipeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../hooks/useAuth';

// 类型定义
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Recipe: { id: string; title: string };
  RecipeDetails: { id: string };
  CookbookDetails: { id: string };
  CategoryRecipes: { id: string; name: string };
  Account: undefined;
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// 占位组件 - 等待实际屏幕组件创建
const PlaceholderScreen = () => <Text>功能开发中...</Text>;

// 底部标签导航
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: '首页' }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: '收藏' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
};

// 加载中组件
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>加载中...</Text>
  </View>
);

// 主导航容器
export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // 显示加载界面
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // 未登录状态 - 显示登录界面
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // 已登录状态 - 显示主应用界面
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Recipe"
              component={RecipeScreen}
              options={({ route }) => ({
                title: route.params?.title || '菜谱详情',
                headerShown: true,
              })}
            />
            <Stack.Screen
              name="RecipeDetails"
              component={RecipeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CookbookDetails"
              component={PlaceholderScreen}
              options={{
                title: '食谱簿详情',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="CategoryRecipes"
              component={PlaceholderScreen}
              options={({ route }) => ({
                title: route.params?.name || '分类食谱',
                headerShown: true,
              })}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{
                title: '账户设置',
                headerShown: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator;