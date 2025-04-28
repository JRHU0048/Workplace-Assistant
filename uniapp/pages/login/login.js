const app = getApp()
Page({
  data: {
    username: '',
    password: '',
    isLoading: false
  },

  inputUsername: function (e) {
    this.setData({ username: e.detail.value })
  },

  inputPassword: function (e) {
    this.setData({ password: e.detail.value })
  },

  login: function () {
    if (this.data.isLoading) {
      return
    }
    if (!this.data.username ||!this.data.password) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }
    this.setData({ isLoading: true })
    wx.request({
      url: app.globalData.apiUrl + '/login',
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success: res => {
        if (res.data.code === 200) {
          app.globalData.username = res.data.username
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({ title: '登录失败:' + res.data.message, icon: 'none' })
        }
      },
      fail: err => {
        wx.showToast({ title: '网络错误', icon: 'none' })
      },
      complete: () => {
        this.setData({ isLoading: false })
      }
    })
  }
})


// 1.0
// const app = getApp()

// Page({
//   data: {
//     username: '',
//     password: ''
//   },

//   inputUsername: function (e) {
//     this.setData({ username: e.detail.value })
//   },

//   inputPassword: function (e) {
//     this.setData({ password: e.detail.value })
//   },

//   login: function () {
//     if (!this.data.username || !this.data.password) {
//       wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
//       return
//     }

//     wx.request({
//       url: app.globalData.apiUrl + '/login',
//       method: 'POST',
//       data: {
//         username: this.data.username,
//         password: this.data.password
//       },
//       success: res => {
//         if (res.data.code === 200) {
//           // 将user_id改为username
//           app.globalData.username = res.data.username
//           wx.navigateBack({
//             delta: 1
//           })
//         } else {
//           wx.showToast({ title: '登录失败: ' + res.data.message, icon: 'none' })
//         }
//       },
//       fail: err => {
//         wx.showToast({ title: '网络错误', icon: 'none' })
//       }
//     })
//   }
// })