App({
  globalData: {
    userInfo: null,
    username: null,
    apiUrl: 'http://localhost:5000/api' // 后端API地址
  },
  
  onLaunch: function() {
    // 初始化云开发
    wx.cloud.init({
      env: 'your-env-id',
      traceUser: true
    });
  }
})