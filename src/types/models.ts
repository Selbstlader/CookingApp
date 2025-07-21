// 定义分类模型
export interface Category {
  id: number | string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: number | string;
  type?: number;
  sort?: number;
  status?: number;
}

// 定义菜谱模型
export interface Recipe {
  id: number | string;
  name: string;
  description?: string;
  coverImage?: string;
  categoryId?: number | string;
  categoryName?: string;
  source?: string;
  sourceUrl?: string;
  difficulty?: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  rating?: number;
  ratingCount?: number;
  tags?: string;
  viewCount?: number;
  favoriteCount?: number;
  favorited?: boolean;
  remark?: string;
  createTime?: string;
}

// 定义食材模型
export interface Ingredient {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
  categoryId?: number | string;
  categoryName?: string;
  unit?: string;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbohydratesPer100g?: number;
  fiberPer100g?: number;
  sugarPer100g?: number;
  sodiumPer100g?: number;
  seasons?: string;
  storageAdvice?: string;
  shelfLife?: number;
  status?: number;
  remark?: string;
}

// 定义菜谱详情食材关联模型
export interface RecipeIngredient {
  id: number | string;
  ingredientId: number | string;
  ingredientName: string;
  amount?: number;
  unit?: string;
  required?: number;
  remark?: string;
}

// 定义烹饪步骤模型
export interface CookingStep {
  id: number | string;
  stepOrder: number;
  title?: string;
  description: string;
  image?: string;
  cookingTime?: number;
  heatLevel?: string;
  tips?: string;
}

// 定义菜谱详情模型
export interface RecipeDetail extends Recipe {
  ingredients?: RecipeIngredient[];
  cookingSteps?: CookingStep[];
}

// 定义用户模型
export interface User {
  id: number | string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
  remark?: string;
  deptId?: number | string;
  deptName?: string;
}

// 定义登录请求参数
export interface LoginRequest {
  username: string;
  password: string;
  captchaVerification?: string;
}

// 定义登录响应结果
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number | string;
  expiresTime: number; // 后端返回的是数字时间戳
}

// 定义菜单信息
export interface Menu {
  id: number | string;
  parentId: number | string;
  name: string;
  path?: string;
  component?: string;
  componentName?: string;
  icon?: string;
  visible?: boolean;
  keepAlive?: boolean;
  alwaysShow?: boolean;
}

// 定义用户信息响应
export interface UserInfoResponse {
  user: User;
  permissions: string[];
  roles: string[]; // 角色标识数组
  menus: Menu[]; // 菜单树
}

// 定义认证状态
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresTime: number | null; // 内部存储为时间戳
}