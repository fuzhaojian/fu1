var APP_CONFIG = require('../../config/appConfig.js')
var weatherApi = require('../../utils/weatherApi.js')
var cityHelper = require('../../utils/cityHelper.js')
var storageHelper = require('../../utils/storageHelper.js')

Page({
  data: {
    currentCity: null,
    weather: null,
    loading: true,
    error: '',
    timer: null,
    showHistory: false,
    historyRecords: []
  },

  onLoad: function() {
    var that = this
    that.initCity()
  },

  onShow: function() {
    var that = this
    that.startTimer()
  },

  onHide: function() {
    var that = this
    that.stopTimer()
  },

  onUnload: function() {
    var that = this
    that.stopTimer()
  },

  initCity: function() {
    var that = this
    var city = storageHelper.getCurrentCity()
    if (!city) {
      city = cityHelper.getDefaultCity()
    }
    that.setData({ currentCity: city })
    that.fetchWeather()
  },

  startTimer: function() {
    var that = this
    that.stopTimer()
    var interval = APP_CONFIG.weather.requestInterval
    that.data.timer = setInterval(function() {
      that.fetchWeather()
    }, interval)
  },

  stopTimer: function() {
    var that = this
    if (that.data.timer) {
      clearInterval(that.data.timer)
      that.data.timer = null
    }
  },

  fetchWeather: function() {
    var that = this
    var city = that.data.currentCity
    if (!city) return

    var cached = storageHelper.getWeatherCache(city.code)
    if (cached && Date.now() - cached.timestamp < 300000) {
      that.setData({
        weather: cached.data,
        loading: false
      })
      return
    }

    that.setData({ loading: true, error: '' })

    weatherApi.fetchWeather(city)
      .then(function(weatherData) {
        storageHelper.saveWeatherCache(city.code, weatherData)
        storageHelper.addHistoryRecord(city, weatherData)
        storageHelper.addRecentCity(city)
        
        that.setData({
          weather: weatherData,
          loading: false,
          error: ''
        })
      })
      .catch(function(err) {
        var cached = storageHelper.getWeatherCache(city.code)
        if (cached) {
          that.setData({
            weather: cached.data,
            loading: false,
            error: err.message + '（显示缓存数据）'
          })
        } else {
          that.setData({
            loading: false,
            error: err.message
          })
        }
      })
  },

  onRetry: function() {
    var that = this
    that.fetchWeather()
  },

  goToCitySelect: function() {
    wx.navigateTo({
      url: '/pages/city/city'
    })
  },

  toggleHistory: function() {
    var that = this
    if (!that.data.showHistory) {
      var records = storageHelper.getHistoryRecords()
      that.setData({
        historyRecords: records,
        showHistory: true
      })
    } else {
      that.setData({
        showHistory: false
      })
    }
  },

  onPullDownRefresh: function() {
    var that = this
    that.fetchWeather()
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
