import request from '@/request'

const WalletApi = {
  // 獲取用戶錢包信息
  getBalance: () => {
    return request({
      url: '/pay/wallet/get-balance',
      method: 'GET',
    })
  },
  
  // 獲取交易記錄
  getTransactionList: (data) => {
    return request({
      url: '/pay/wallet/transaction-list',
      method: 'GET',
      params: data,
    })
  },
  
  // 充值
  recharge: (data) => {
    return request({
      url: '/pay/wallet/recharge',
      method: 'POST',
      data,
      custom: {
        showSuccess: true,
        loadingMsg: '提交中',
        successMsg: '充值成功',
      },
    })
  },
}

export default WalletApi 