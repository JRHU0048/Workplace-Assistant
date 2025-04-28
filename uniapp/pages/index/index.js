const app = getApp()

Page({
  data: {
    question: '',
    messages: [], // 改为消息数组形式
    isAsking: false,
    inputFocus: false
  },
  
  onLoad: function () {
    if (!app.globalData.username) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      this.setData({
        username: app.globalData.username
      })
    }
    // 添加欢迎消息
    this.addMessage('assistant', '你好！我是你的职场小助手，有什么职场相关问题可以问我哦~')
  },
  
  // 添加消息到对话列表
  addMessage: function(role, content) {
    const newMessage = {
      role: role, // 'user' 或 'assistant'
      content: content,
      avatar: role === 'user' ? '/assets/images/user-avatar.png' : '/assets/images/bot-avatar.png',
      time: this.formatTime(new Date())
    }
    this.setData({
      messages: [...this.data.messages, newMessage]
    })
    // 滚动到底部
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 99999,
        duration: 300
      })
    }, 100)
  },
  
  // 格式化时间
  formatTime: function(date) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },
  
  inputQuestion: function(e) {
    this.setData({ question: e.detail.value })
  },
  
  // 聚焦输入框
  focusInput: function() {
    this.setData({ inputFocus: true })
  },
  
  // 失焦输入框
  blurInput: function() {
    this.setData({ inputFocus: false })
  },
  
  askQuestion: function() {
    const question = this.data.question.trim()
    if (!question) {
      wx.showToast({ title: '请输入问题', icon: 'none' })
      return
    }
    
    // 添加用户消息
    this.addMessage('user', question)
    this.setData({ 
      // isAsking: true,
      // question: '' 
      question: '', // 先清空问题
      isAsking: true // 再设置为正在提问状态
    })
    
    wx.request({
      url: app.globalData.apiUrl + '/ask',
      method: 'POST',
      data: {
        username: app.globalData.username,
        question: question
      },
      success: res => {
        if (res.data.code === 200) {
          this.addMessage('assistant', res.data.answer)
        } else {
          wx.showToast({ title: '请求失败: ' + res.data.message, icon: 'none' })
          this.addMessage('assistant', '抱歉，回答问题时出错了，请稍后再试。')
        }
      },
      fail: err => {
        wx.showToast({ title: '网络错误', icon: 'none' })
        this.addMessage('assistant', '网络连接出现问题，请检查网络后重试。')
      },
      complete: () => {
        this.setData({ isAsking: false })
      }
    })
  },
  
  // viewHistory: function() {
  //   wx.navigateTo({
  //     url: '/pages/history/history?username=' + this.data.username
  //   })
  // }
})