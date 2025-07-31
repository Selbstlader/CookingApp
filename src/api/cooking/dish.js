import cookingRequest from './request'

// 获取菜品分页列表
export function getDishPage(params) {
  return cookingRequest({
    url: '/cooking/dish/page',
    method: 'GET',
    params,
  })
}

// 获取菜品详情
export function getDish(id) {
  return cookingRequest({
    url: '/cooking/dish/get',
    method: 'GET',
    params: { id },
  })
}

// 获取菜品完整详情（包含配料、步骤、小贴士）
export function getDishDetail(id) {
  return cookingRequest({
    url: '/cooking/dish/detail',
    method: 'GET',
    params: { id },
  })
}

// 获取所有菜品精简列表
export function getSimpleDishList() {
  return cookingRequest({
    url: '/cooking/dish/list-all-simple',
    method: 'GET',
  })
}