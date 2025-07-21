import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入模拟数据
import { mockRecipeDetails } from '../utils/mockData';

// 收藏菜谱类型
type FavoriteRecipe = {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
};

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取收藏的菜谱
  const loadFavoriteRecipes = async () => {
    try {
      setLoading(true);
      const favoritesString = await AsyncStorage.getItem('favorites');
      const favoriteIds = favoritesString ? JSON.parse(favoritesString) : [];
      
      // 根据收藏ID获取菜谱详情
      const recipes = favoriteIds.map((id: string) => {
        const recipeDetails = mockRecipeDetails[id as keyof typeof mockRecipeDetails];
        if (recipeDetails) {
          return {
            id: recipeDetails.id,
            title: recipeDetails.title,
            image: recipeDetails.image,
            cookingTime: recipeDetails.cookingTime
          };
        }
        return null;
      }).filter(Boolean); // 过滤掉无效菜谱
      
      setFavoriteRecipes(recipes);
      setLoading(false);
    } catch (error) {
      console.error('加载收藏菜谱失败', error);
      setLoading(false);
    }
  };

  // 页面聚焦时重新加载收藏菜谱
  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteRecipes();
      return () => {};
    }, [])
  );

  const renderRecipeItem = ({ item }: { item: FavoriteRecipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeTime}>烹饪时间: {item.cookingTime} 分钟</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>我的收藏</Text>
      
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text>加载中...</Text>
        </View>
      ) : favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.recipeList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>您还没有收藏任何菜谱</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.exploreButtonText}>去浏览菜谱</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  recipeList: {
    flex: 1,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recipeTime: {
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FavoritesScreen; 