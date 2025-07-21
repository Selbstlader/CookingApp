import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Feather } from '@expo/vector-icons';

// 导入API服务
import apiService from '../services/api';

// 导入组件
import CookbookCard from '../components/CookbookCard';
import CommunityRecipeCard from '../components/CommunityRecipeCard';
import CategoryItem from '../components/CategoryItem';

// 导入类型定义
import { Recipe, Category } from '../types/models';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // 状态定义
  const [isLoading, setIsLoading] = useState(true);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 获取热门菜谱
        const recipesResponse = await apiService.recipes.getPopular();
        if (recipesResponse.data && Array.isArray(recipesResponse.data)) {
          setPopularRecipes(recipesResponse.data as Recipe[]);
        } else {
          setPopularRecipes([]);
        }
        
        // 获取菜谱分类
        const categoriesResponse = await apiService.categories.getRecipeCategories();
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data as Category[]);
        } else {
          setCategories([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('获取数据失败:', error);
        setError('获取数据失败，请稍后再试');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>正在加载数据...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部欢迎部分 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi Nararaya</Text>
          <Text style={styles.subGreeting}>今天想做什么菜？</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 精选菜谱部分 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>精选菜谱</Text>
        </View>
        <Text style={styles.sectionDescription}>精选热门菜谱，寻找美食灵感</Text>

        {popularRecipes.map((recipe) => (
          <CommunityRecipeCard
            key={recipe.id}
            title={recipe.name}
            image={recipe.coverImage}
            author={{
              name: recipe.source || '厨艺达人',
              avatar: 'https://via.placeholder.com/50',
            }}
            likes={recipe.favoriteCount}
            reviews={recipe.ratingCount || 0}
            video={false}
            onPress={() => navigation.navigate('RecipeDetails', { id: String(recipe.id) })}
          />
        ))}

        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Recipe', { id: '0', title: '全部菜谱' })}
        >
          <Text style={styles.viewAllText}>查看全部菜谱</Text>
        </TouchableOpacity>
      </View>

      {/* 分类部分 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分类</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              name={category.name}
              icon={category.icon || category.image}
              onPress={() => navigation.navigate('CategoryRecipes', { id: String(category.id), name: category.name })}
            />
          ))}
        </ScrollView>
      </View>

      {/* 底部间距 */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingVertical: 10,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 80,
  },
});

export default HomeScreen; 