import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入模拟数据
import { mockRecipeDetails } from '../utils/mockData';

type RecipeScreenProps = NativeStackScreenProps<RootStackParamList, 'Recipe' | 'RecipeDetails'>;

// 标签类型
type TabType = 'intro' | 'ingredients' | 'steps';

const RecipeScreen = ({ route, navigation }: RecipeScreenProps) => {
  const { id } = route.params;
  
  // 如果是从RecipeDetails导航来的，使用mockRecipeDetails，否则使用旧数据
  const isDetailView = route.name === 'RecipeDetails';
  const recipe = isDetailView 
    ? mockRecipeDetails[id as keyof typeof mockRecipeDetails]
    : null;
    
  // 当前选中的标签
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  
  // 收藏状态
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  
  // 加载收藏状态
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        if (id) {
          const favoritesString = await AsyncStorage.getItem('favorites');
          const favorites = favoritesString ? JSON.parse(favoritesString) : [];
          setIsFavorite(favorites.includes(id));
        }
      } catch (error) {
        console.error('加载收藏状态失败', error);
      }
    };
    
    loadFavoriteStatus();
  }, [id]);
  
  // 切换收藏状态
  const toggleFavorite = async () => {
    try {
      if (id) {
        const favoritesString = await AsyncStorage.getItem('favorites');
        const favorites = favoritesString ? JSON.parse(favoritesString) : [];
        
        let newFavorites;
        if (isFavorite) {
          // 取消收藏
          newFavorites = favorites.filter((favId: string) => favId !== id);
        } else {
          // 添加收藏
          newFavorites = [...favorites, id];
        }
        
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
        
        // 显示提示信息
        Alert.alert(
          isFavorite ? '已取消收藏' : '已添加到收藏',
          '',
          [{ text: '确定', style: 'default' }],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error('切换收藏状态失败', error);
    }
  };

  // 如果是详情页且找不到数据
  if (isDetailView && !recipe) {
    return (
      <View style={styles.container}>
        <Text>菜谱不存在</Text>
      </View>
    );
  }
  
  // 如果是详情页，渲染新设计
  if (isDetailView && recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* 顶部图片区域 */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <TouchableOpacity 
            style={[styles.iconButton, styles.backButton]} 
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, styles.favoriteButton]}
            onPress={toggleFavorite}
          >
            <Feather 
              name={isFavorite ? "heart" : "heart"} 
              size={22} 
              color={isFavorite ? "#FF6B6B" : "#fff"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>
          {/* 菜谱信息区域 */}
          <View style={styles.recipeInfoContainer}>
            <View style={styles.cookbooksContainer}>
              <Text style={styles.cookbooksText}>{recipe.cookbooks.join(' / ')}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Feather name="plus" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            
            <View style={styles.statsContainer}>
              <Feather name="heart" size={16} color="#FF6B6B" />
              <Text style={styles.statsText}>{recipe.likes}</Text>
              <Text style={styles.separator}>|</Text>
              <Text style={styles.statsText}>{recipe.reviews} Reviews</Text>
            </View>
          </View>
          
          {/* 烹饪信息区域 */}
          <View style={styles.cookingInfoContainer}>
            <View style={styles.cookingInfoItem}>
              <Feather name="clock" size={22} color="#FF6B6B" />
              <Text style={styles.cookingInfoText}>{recipe.cookingTime} min</Text>
            </View>
            <View style={styles.cookingInfoItem}>
              <Feather name="award" size={22} color="#FF6B6B" />
              <Text style={styles.cookingInfoText}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.cookingInfoItem}>
              <Feather name="users" size={22} color="#FF6B6B" />
              <Text style={styles.cookingInfoText}>Serves {recipe.servings}</Text>
            </View>
          </View>
          
          {/* 评论区域 */}
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Reviews ({recipe.reviews})</Text>
              <TouchableOpacity>
                <Text style={styles.readAllText}>READ ALL</Text>
              </TouchableOpacity>
            </View>
            
            {recipe.reviewsList && recipe.reviewsList.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Image source={{ uri: review.user.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.user.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
                <TouchableOpacity style={styles.reviewLikeButton}>
                  <Feather 
                    name="heart" 
                    size={18} 
                    color={review.liked ? "#FF6B6B" : "#ddd"} 
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {/* 内容标签栏 */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'intro' && styles.activeTabButton]} 
              onPress={() => setActiveTab('intro')}
            >
              <Text style={[styles.tabText, activeTab === 'intro' && styles.activeTabText]}>
                Intro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'ingredients' && styles.activeTabButton]} 
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'steps' && styles.activeTabButton]} 
              onPress={() => setActiveTab('steps')}
            >
              <Text style={[styles.tabText, activeTab === 'steps' && styles.activeTabText]}>
                Steps
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 内容区域 */}
          <View style={styles.tabContent}>
            {activeTab === 'intro' && (
              <Text style={styles.introText}>{recipe.introduction}</Text>
            )}
            
            {activeTab === 'ingredients' && (
              <View>
                {recipe.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredientItem}>• {ingredient}</Text>
                ))}
              </View>
            )}
            
            {activeTab === 'steps' && (
              <View>
                {recipe.steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          {/* 来源信息 */}
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>Source</Text>
          </View>
          
          {/* 底部间距 */}
          <View style={{ height: 80 }} />
        </ScrollView>
        
        {/* 底部收藏按钮 */}
        <View style={styles.bottomToolbar}>
          <TouchableOpacity 
            style={styles.favoriteButtonLarge}
            onPress={toggleFavorite}
          >
            <Feather 
              name="heart"
              size={24} 
              color={isFavorite ? "#FF6B6B" : "#666"} 
            />
            <Text style={[styles.favoriteText, isFavorite && styles.activeFavoriteText]}>
              {isFavorite ? '已收藏' : '收藏'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // 旧的菜谱详情页（保留原有功能）
  // 这里可以放原有的代码...
  return (
    <ScrollView style={[styles.container, { padding: 16 }]}>
      <Text style={styles.recipeTitle}>菜谱详情页（旧版）</Text>
      <Text>菜谱ID: {id}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%', 
    height: '100%',
  },
  iconButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    top: 16,
    left: 16,
  },
  favoriteButton: {
    top: 16,
    right: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  recipeInfoContainer: {
    padding: 16,
  },
  cookbooksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cookbooksText: {
    color: '#666',
    fontSize: 14,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 10,
    color: '#ddd',
  },
  cookingInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  cookingInfoItem: {
    alignItems: 'center',
  },
  cookingInfoText: {
    marginTop: 5,
    fontSize: 14,
  },
  reviewsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  readAllText: {
    color: '#FF6B6B',
    fontWeight: '500',
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewDate: {
    color: '#999',
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  reviewLikeButton: {
    padding: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginVertical: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  tabContent: {
    padding: 16,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  ingredientItem: {
    fontSize: 16,
    lineHeight: 28,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  sourceContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sourceText: {
    fontSize: 14,
    color: '#666',
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  favoriteButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  favoriteText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#666',
  },
  activeFavoriteText: {
    color: '#FF6B6B',
  },
});

export default RecipeScreen; 