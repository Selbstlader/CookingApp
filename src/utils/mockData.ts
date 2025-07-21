// 食谱簿数据
export const mockCookbooks = [
  {
    id: '1',
    title: '特色食谱合集',
    description: '简单又美味的食谱集合',
    image: 'https://via.placeholder.com/300',
    likes: 1300,
    recipesCount: 7,
  },
  // 可以添加更多食谱簿
];

// 社区精选食谱
export const mockCommunityRecipes = [
  {
    id: '1',
    title: '椰浆咖喱鸡',
    image: 'https://via.placeholder.com/300',
    author: {
      name: '娜迪亚',
      avatar: 'https://via.placeholder.com/50',
    },
    likes: 130,
    reviews: 103,
    video: true,
  },
  {
    id: '2',
    title: '辣味咖喱鸡',
    image: 'https://via.placeholder.com/300',
    author: {
      name: '加尤',
      avatar: 'https://via.placeholder.com/50',
    },
    likes: 130,
    reviews: 103,
    video: false,
  },
  {
    id: '3',
    title: '传统酸辣鸡',
    image: 'https://via.placeholder.com/300',
    author: {
      name: '加尤',
      avatar: 'https://via.placeholder.com/50',
    },
    likes: 120,
    reviews: 133,
    video: false,
  },
];

// 分类数据
export const mockCategories = [
  { id: '1', name: '时令', icon: 'https://via.placeholder.com/50' },
  { id: '2', name: '蛋糕', icon: 'https://via.placeholder.com/50' },
  { id: '3', name: '日常', icon: 'https://via.placeholder.com/50' },
  { id: '4', name: '饮品', icon: 'https://via.placeholder.com/50' },
];

// 详细菜谱数据
export const mockRecipeDetails = {
  '1': {
    id: '1',
    title: 'Sup Makaroni Daging Ayam Kampung',
    image: 'https://via.placeholder.com/600x400',
    cookbooks: ['Menu ayam spesial'],
    likes: 250,
    reviews: 67,
    cookingTime: 40,
    difficulty: 'Easy',
    servings: 2,
    reviewsList: [
      {
        id: '1',
        user: {
          name: 'Renata Moeloek',
          avatar: 'https://via.placeholder.com/50',
        },
        date: '4 days ago',
        text: 'Resepnya menarik mesti dicoba nih, terima kasih bunda',
        liked: false,
      },
      // 可以添加更多评论
    ],
    ingredients: [
      '500g 鸡肉',
      '200g 通心粉',
      '2个 胡萝卜',
      '1个 洋葱',
      '2片 月桂叶',
      '2升 鸡汤',
      '盐和胡椒调味',
      '适量香菜装饰'
    ],
    steps: [
      '将鸡肉切块，用盐和胡椒腌制15分钟',
      '热锅加油，将鸡肉煎至两面金黄',
      '加入切好的胡萝卜和洋葱翻炒2分钟',
      '倒入鸡汤，加入月桂叶，煮沸后转小火炖30分钟',
      '加入通心粉，继续煮8-10分钟直至煮熟',
      '调味后撒上香菜即可享用'
    ],
    introduction: '听说汤是我们从小就很熟悉的一种食物。作为日常饮食中的一种，这种汤是印尼各地最受欢迎的菜肴之一。这种汤可以让我们比平时吃得更多。这次我将为热爱烹饪的家庭主妇们提供一些关于通心粉汤的信息，或许可以成为您家人喜爱的特色菜。为了使讨论不至于过于宽泛，让我们直接进入关于通心粉汤的主题。请查看下面的步骤。',
  },
  '2': {
    id: '2',
    title: '辣味咖喱鸡',
    image: 'https://via.placeholder.com/600x400',
    cookbooks: ['特色咖喱'],
    likes: 130,
    reviews: 103,
    cookingTime: 35,
    difficulty: 'Medium',
    servings: 4,
    reviewsList: [
      {
        id: '1',
        user: {
          name: 'Linda Wang',
          avatar: 'https://via.placeholder.com/50',
        },
        date: '1 week ago',
        text: '非常美味的咖喱，辣度刚好，家人都很喜欢！',
        liked: true,
      },
    ],
    ingredients: [
      '800g 鸡腿肉，切块',
      '2个 洋葱，切丁',
      '4瓣 大蒜，切碎',
      '2厘米 姜，切碎',
      '3汤匙 咖喱粉',
      '1汤匙 辣椒粉',
      '400ml 椰奶',
      '250ml 鸡汤',
      '2个 土豆，切块',
      '盐和胡椒调味',
      '香菜装饰'
    ],
    steps: [
      '热锅加油，煸炒洋葱直至变软',
      '加入蒜末和姜末煸炒至香',
      '加入咖喱粉和辣椒粉，继续煸炒约1分钟',
      '放入鸡肉块，煎至表面变色',
      '倒入椰奶和鸡汤，加入切好的土豆',
      '煮沸后转小火炖30分钟直至鸡肉和土豆都熟透',
      '调味并撒上香菜装饰'
    ],
    introduction: '这道辣味咖喱鸡结合了传统咖喱的香醇和适量的辣味，创造出一道令人难以抗拒的美食。咖喱中的椰奶带来丝滑口感，而各种香料的组合则使这道菜肴香气四溢。这是一道非常适合家庭聚餐的菜品，尤其在寒冷的日子里，一碗热腾腾的咖喱绝对是最佳选择。下面我将为大家详细介绍这道菜的制作步骤。',
  },
  '3': {
    id: '3',
    title: '传统酸辣鸡',
    image: 'https://via.placeholder.com/600x400',
    cookbooks: ['传统美食'],
    likes: 120,
    reviews: 133,
    cookingTime: 25,
    difficulty: 'Easy',
    servings: 3,
    reviewsList: [
      {
        id: '1',
        user: {
          name: 'Robert Chen',
          avatar: 'https://via.placeholder.com/50',
        },
        date: '2 days ago',
        text: '这道菜酸辣可口，非常开胃，很适合夏天食用！',
        liked: false,
      },
    ],
    ingredients: [
      '500g 鸡胸肉，切丝',
      '1个 青椒，切丝',
      '1个 红椒，切丝',
      '2根 青葱，切段',
      '3瓣 大蒜，切碎',
      '1汤匙 姜末',
      '2汤匙 米醋',
      '1汤匙 白糖',
      '2汤匙 酱油',
      '1汤匙 辣椒酱',
      '1茶匙 淀粉',
      '适量食用油'
    ],
    steps: [
      '将鸡肉切丝，用少许盐、胡椒和淀粉腌制10分钟',
      '热锅加油，煸炒蒜末和姜末至香',
      '加入鸡肉丝快速翻炒至变色',
      '放入青红椒丝继续翻炒',
      '加入米醋、白糖、酱油和辣椒酱调味',
      '最后加入葱段翻炒均匀即可出锅'
    ],
    introduction: '传统酸辣鸡是一道融合了酸味和辣味的经典家常菜。这道菜以其鲜明的口味和简单的烹饪方法而深受喜爱。酸辣的味道刺激味蕾，非常适合夏季食用，能够有效增进食欲。同时，这道菜的制作过程简单快速，是忙碌工作日的理想选择。下面让我们一起来看看如何制作这道美味的传统酸辣鸡。',
  },
}; 