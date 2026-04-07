var storageHelper = require('../../utils/storageHelper.js')

Page({
  data: {
    cities: [],
    filteredCities: [],
    searchKeyword: '',
    currentCityId: null
  },

  onLoad: function (options) {
    var cities = getApp().globalData.cities
    var lastCity = storageHelper.getLastCity()
    
    this.setData({
      cities: cities,
      filteredCities: cities,
      currentCityId: lastCity ? lastCity.id : null
    })
  },

  onSearchInput: function (e) {
    var keyword = e.detail.value.toLowerCase()
    this.filterCities(keyword)
  },

  onSearchConfirm: function (e) {
    var keyword = e.detail.value.toLowerCase()
    this.filterCities(keyword)
  },

  filterCities: function (keyword) {
    var cities = this.data.cities
    var filtered = cities

    if (keyword) {
      filtered = cities.filter(function (city) {
        return city.name.toLowerCase().indexOf(keyword) !== -1 ||
               city.id.toLowerCase().indexOf(keyword) !== -1
      })
    }

    this.setData({
      searchKeyword: keyword,
      filteredCities: filtered
    })
  },

  onCitySelect: function (e) {
    var cityId = e.currentTarget.dataset.id
    var city = this.data.cities.find(function (c) {
      return c.id === cityId
    })

    if (city) {
      storageHelper.saveLastCity(city)
      
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  onClearSearch: function () {
    this.setData({
      searchKeyword: '',
      filteredCities: this.data.cities
    })
  }
})
