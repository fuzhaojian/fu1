var cityHelper = require('../../utils/cityHelper.js')
var storageHelper = require('../../utils/storageHelper.js')

Page({
  data: {
    searchKeyword: '',
    allCities: [],
    filteredCities: [],
    recentCities: [],
    provinces: [],
    selectedProvince: ''
  },

  onLoad: function () {
    this.initData()
  },

  onShow: function () {
    var recentCities = storageHelper.getRecentCities()
    this.setData({ recentCities: recentCities })
  },

  initData: function () {
    var allCities = cityHelper.getAllCities()
    var provinces = cityHelper.getAllProvinces()
    var recentCities = storageHelper.getRecentCities()

    this.setData({
      allCities: allCities,
      filteredCities: allCities,
      provinces: provinces,
      recentCities: recentCities
    })
  },

  onSearchInput: function (e) {
    var keyword = e.detail.value
    this.setData({ searchKeyword: keyword })

    if (keyword.trim() === '') {
      this.setData({
        filteredCities: this.data.allCities,
        selectedProvince: ''
      })
    } else {
      var results = cityHelper.searchCities(keyword)
      this.setData({
        filteredCities: results,
        selectedProvince: ''
      })
    }
  },

  onClearSearch: function () {
    this.setData({
      searchKeyword: '',
      filteredCities: this.data.allCities,
      selectedProvince: ''
    })
  },

  onProvinceTap: function (e) {
    var province = e.currentTarget.dataset.province
    if (this.data.selectedProvince === province) {
      this.setData({
        selectedProvince: '',
        filteredCities: this.data.allCities
      })
    } else {
      var cities = cityHelper.getCitiesByProvince(province)
      this.setData({
        selectedProvince: province,
        filteredCities: cities,
        searchKeyword: ''
      })
    }
  },

  onCityTap: function (e) {
    var city = e.currentTarget.dataset.city
    storageHelper.saveCurrentCity(city)

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    if (prevPage) {
      prevPage.setData({ currentCity: city })
      prevPage.fetchWeather()
    }

    wx.showToast({
      title: '已切换至' + city.name,
      icon: 'success'
    })

    setTimeout(function () {
      wx.navigateBack()
    }, 500)
  },

  onRecentCityTap: function (e) {
    this.onCityTap(e)
  }
})
