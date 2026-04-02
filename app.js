App({
  onLaunch: function() {
    console.log('天气小程序启动')
    this.globalData = {
      currentCity: null,
      weatherData: null,
      timer: null
    }
  },

  onShow: function() {
    console.log('小程序进入前台')
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.route === 'pages/index/index') {
      if (currentPage.startTimer) {
        currentPage.startTimer()
      }
    }
  },

  onHide: function() {
    console.log('小程序进入后台')
    this.clearGlobalTimer()
  },

  setGlobalTimer: function(callback, interval) {
    this.clearGlobalTimer()
    this.globalData.timer = setInterval(callback, interval)
  },

  clearGlobalTimer: function() {
    if (this.globalData.timer) {
      clearInterval(this.globalData.timer)
      this.globalData.timer = null
    }
  },

  globalData: {
    currentCity: null,
    weatherData: null,
    config: null,
    timer: null
  }
})
