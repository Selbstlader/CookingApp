import cookingRequest from './request'

// 获取菜品分类分页列表
export function getCategoryPage(params) {
  return cookingRequest({
    url: '/cooking/category/page',
    method: 'GET',
    params,
  })
}

// 获取菜品分类详情
export function getCategory(id) {
  return cookingRequest({
    url: '/cooking/category/get',
    method: 'GET',
    params: { id },
  })
}

// 获取所有菜品分类精简列表
export function getSimpleCategoryList() {
  return cookingRequest({
    url: '/cooking/category/list-all-simple',
    method: 'GET',
  })
}