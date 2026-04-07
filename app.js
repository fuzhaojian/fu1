App({
  globalData: {
    weatherTimer: null,
    currentCity: null,
    cities: []
  },

  onLaunch: function() {
    console.log('Weather Monitor App Launch')
    this.loadCities()
  },

  onShow: function() {
    console.log('App Show')
  },

  onHide: function() {
    console.log('App Hide')
    this.clearWeatherTimer()
  },

  loadCities: function() {
    var cities = [
      { id: 'beijing', name: '北京', latitude: 39.9042, longitude: 116.4074 },
      { id: 'shanghai', name: '上海', latitude: 31.2304, longitude: 121.4737 },
      { id: 'guangzhou', name: '广州', latitude: 23.1291, longitude: 113.2644 },
      { id: 'shenzhen', name: '深圳', latitude: 22.5431, longitude: 114.0579 },
      { id: 'hangzhou', name: '杭州', latitude: 30.2741, longitude: 120.1551 },
      { id: 'nanjing', name: '南京', latitude: 32.0603, longitude: 118.7969 },
      { id: 'chengdu', name: '成都', latitude: 30.5728, longitude: 104.0668 },
      { id: 'wuhan', name: '武汉', latitude: 30.5928, longitude: 114.3055 },
      { id: 'xian', name: '西安', latitude: 34.3416, longitude: 108.9398 },
      { id: 'chongqing', name: '重庆', latitude: 29.4316, longitude: 106.9123 },
      { id: 'tianjin', name: '天津', latitude: 39.0842, longitude: 117.2009 },
      { id: 'suzhou', name: '苏州', latitude: 31.2989, longitude: 120.5853 },
      { id: 'zhengzhou', name: '郑州', latitude: 34.7466, longitude: 113.6254 },
      { id: 'changsha', name: '长沙', latitude: 28.2282, longitude: 112.9388 },
      { id: 'dongguan', name: '东莞', latitude: 23.0207, longitude: 113.7518 },
      { id: 'shenyang', name: '沈阳', latitude: 41.8057, longitude: 123.4315 },
      { id: 'qingdao', name: '青岛', latitude: 36.0671, longitude: 120.3826 },
      { id: 'hefei', name: '合肥', latitude: 31.8206, longitude: 117.2272 },
      { id: 'foshan', name: '佛山', latitude: 23.0218, longitude: 113.1219 },
      { id: 'dalian', name: '大连', latitude: 38.9140, longitude: 121.6147 },
      { id: 'fuzhou', name: '福州', latitude: 26.0745, longitude: 119.2965 },
      { id: 'xiamen', name: '厦门', latitude: 24.4798, longitude: 118.0894 },
      { id: 'jinan', name: '济南', latitude: 36.6512, longitude: 117.1201 },
      { id: 'harbin', name: '哈尔滨', latitude: 45.8038, longitude: 126.5350 },
      { id: 'changchun', name: '长春', latitude: 43.8171, longitude: 125.3235 },
      { id: 'shijiazhuang', name: '石家庄', latitude: 38.0428, longitude: 114.5149 },
      { id: 'kunming', name: '昆明', latitude: 24.8801, longitude: 102.8329 },
      { id: 'nanchang', name: '南昌', latitude: 28.6820, longitude: 115.8579 },
      { id: 'guiyang', name: '贵阳', latitude: 26.6470, longitude: 106.6302 },
      { id: 'nanning', name: '南宁', latitude: 22.8170, longitude: 108.3665 },
      { id: 'wuxi', name: '无锡', latitude: 31.4912, longitude: 120.3119 },
      { id: 'ningbo', name: '宁波', latitude: 29.8683, longitude: 121.5440 },
      { id: 'wenzhou', name: '温州', latitude: 28.0001, longitude: 120.6724 },
      { id: 'changzhou', name: '常州', latitude: 31.8122, longitude: 119.9692 },
      { id: 'nantong', name: '南通', latitude: 31.9802, longitude: 120.8943 },
      { id: 'xuzhou', name: '徐州', latitude: 34.2044, longitude: 117.2848 },
      { id: 'yangzhou', name: '扬州', latitude: 32.3912, longitude: 119.4123 },
      { id: 'zhenjiang', name: '镇江', latitude: 32.1875, longitude: 119.4250 },
      { id: 'huizhou', name: '惠州', latitude: 23.1115, longitude: 114.4152 },
      { id: 'zhuhai', name: '珠海', latitude: 22.2769, longitude: 113.5678 },
      { id: 'zhongshan', name: '中山', latitude: 22.5170, longitude: 113.3927 },
      { id: 'jiangmen', name: '江门', latitude: 22.5787, longitude: 113.0949 },
      { id: 'shaoxing', name: '绍兴', latitude: 30.0326, longitude: 120.5820 },
      { id: 'jiaxing', name: '嘉兴', latitude: 30.7468, longitude: 120.7507 },
      { id: 'jinhua', name: '金华', latitude: 29.0789, longitude: 119.6478 },
      { id: 'taizhou', name: '台州', latitude: 28.6563, longitude: 121.4208 },
      { id: 'yantai', name: '烟台', latitude: 37.4638, longitude: 121.4478 },
      { id: 'weifang', name: '潍坊', latitude: 36.7067, longitude: 119.1619 },
      { id: 'linyi', name: '临沂', latitude: 35.1041, longitude: 118.3564 },
      { id: 'zibo', name: '淄博', latitude: 36.8131, longitude: 118.0549 },
      { id: 'taiyuan', name: '太原', latitude: 37.8706, longitude: 112.5489 },
      { id: 'lanzhou', name: '兰州', latitude: 36.0611, longitude: 103.8343 }
    ]
    this.globalData.cities = cities
  },

  setWeatherTimer: function(callback, interval) {
    this.clearWeatherTimer()
    this.globalData.weatherTimer = setInterval(callback, interval)
  },

  clearWeatherTimer: function() {
    if (this.globalData.weatherTimer) {
      clearInterval(this.globalData.weatherTimer)
      this.globalData.weatherTimer = null
    }
  }
})
