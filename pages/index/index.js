var weatherApi = require('../../utils/weatherApi.js')
var storageHelper = require('../../utils/storageHelper.js')

Page({
  data: {
    currentCity: null,
    weatherData: null,
    loading: false,
    error: null,
    isOnline: true,
    updateTime: ''
  },

  weatherTimer: null,

  onLoad: function (options) {
    this.loadDefaultCity()
  },

  onShow: function () {
    var that = this
    this.checkNetworkStatus()
    this.startAutoRefresh()

    wx.onNetworkStatusChange(function (res) {
      that.setData({ isOnline: res.isConnected })
      if (res.isConnected && that.data.error) {
        that.fetchWeatherData()
      }
    })

    var newCity = storageHelper.getLastCity()
    if (newCity && (!this.data.currentCity || newCity.id !== this.data.currentCity.id)) {
      this.setData({ currentCity: newCity })
      this.fetchWeatherData()
    }
  },

  onHide: function () {
    this.stopAutoRefresh()
  },

  onPullDownRefresh: function () {
    this.fetchWeatherData(function () {
      wx.stopPullDownRefresh()
    })
  },

  checkNetworkStatus: function () {
    var that = this
    wx.getNetworkType({
      success: function (res) {
        that.setData({
          isOnline: res.networkType !== 'none'
        })
      }
    })
  },

  loadDefaultCity: function () {
    var lastCity = storageHelper.getLastCity()
    if (lastCity) {
      this.setData({ currentCity: lastCity })
      this.fetchWeatherData()
    } else {
      var cities = getApp().globalData.cities
      if (cities && cities.length > 0) {
        this.setData({ currentCity: cities[0] })
        this.fetchWeatherData()
      }
    }
  },

  fetchWeatherData: function (callback) {
    var that = this
    var city = this.data.currentCity

    if (!city) {
      this.setData({ error: '请先选择城市' })
      if (callback) callback()
      return
    }

    this.setData({ loading: true, error: null })

    weatherApi.fetchWeather(city, {
      success: function (data) {
        that.setData({
          weatherData: data,
          loading: false,
          updateTime: data.updateTime
        })
        storageHelper.saveWeatherHistory(data)
        storageHelper.saveLastCity(city)
        if (callback) callback()
      },
      fail: function (error) {
        that.setData({
          error: error.message || '获取天气失败',
          loading: false
        })
        if (callback) callback()
      }
    })
  },

  startAutoRefresh: function () {
    var that = this
    this.stopAutoRefresh()

    this.weatherTimer = setInterval(function () {
      if (that.data.isOnline) {
        that.fetchWeatherData()
      }
    }, 30000)
  },

  stopAutoRefresh: function () {
    if (this.weatherTimer) {
      clearInterval(this.weatherTimer)
      this.weatherTimer = null
    }
  },

  onRetry: function () {
    this.fetchWeatherData()
  },

  onSwitchCity: function () {
    wx.navigateTo({
      url: '/pages/city/city'
    })
  },

  onCityChange: function (e) {
    var cities = getApp().globalData.cities
    var index = e.detail.value
    var city = cities[index]

    this.setData({
      currentCity: city,
      weatherData: null
    })

    this.fetchWeatherData()
  }
})
