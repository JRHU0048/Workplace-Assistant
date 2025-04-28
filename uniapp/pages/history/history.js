const app = getApp()

Page({
  data: {
    records: []
  },
  
  onLoad: function(options) {
    this.setData({username: app.globalData.username})
    this.loadHistory()
  },
  
  loadHistory: function() {
    wx.request({
      url: app.globalData.apiUrl + '/history',
      method: 'GET',
      data: {
        username: app.globalData.username,
        limit: 20
      },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ records: res.data.data })
        }
      }
    })
  }
})