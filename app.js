App({
  globalData: {
    weatherTimer: null,
    currentCity: null,
    cities: []
  },

  onLaunch: function () {
    console.log('Weather Monitor App Launch')
    this.loadCities()
  },

  onShow: function () {
    console.log('App Show')
  },

  onHide: function () {
    console.log('App Hide')
    this.clearWeatherTimer()
  },

  onError: function (msg) {
    console.log('App Error: ', msg)
  },

  loadCities: function () {
    var cities = [
      { id: 'beijing', name: '北京', latitude: 39.9042, longitude: 116.4074 },
      { id: 'shanghai', name: '上海', latitude: 31.2304, longitude: 121.4737 },
      { id: 'guangzhou', name: '广州', latitude: 23.1291, longitude: 113.2644 },
      { id: 'shenzhen', name: '深圳', latitude: 22.5431, longitude: 114.0579 },
      { id: 'hangzhou', name: '杭州', latitude: 30.2741, longitude: 120.1551 },
      { id: 'nanjing', name: '南京', latitude: 32.0603, longitude: 118.7969 },
      { id: 'chengdu', name: '成都', latitude: 30.5728, longitude: 104.0668 },
      { id: 'wuhan', name: '武汉', latitude: 30.5928, longitude: 114.3055 }
    ]
    this.globalData.cities = cities
  },

  setWeatherTimer: function (callback, interval) {
    this.clearWeatherTimer()
    this.globalData.weatherTimer = setInterval(callback, interval)
  },

  clearWeatherTimer: function () {
    if (this.globalData.weatherTimer) {
      clearInterval(this.globalData.weatherTimer)
      this.globalData.weatherTimer = null
    }
  }
})
