var APP_CONFIG = require('../config/appConfig.js')
var STORAGE_KEYS = APP_CONFIG.storageKeys

function setStorageSync(key, data) {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (e) {
    console.error('存储失败:', e)
    return false
  }
}

function getStorageSync(key, defaultValue) {
  if (defaultValue === undefined) {
    defaultValue = null
  }
  try {
    var data = wx.getStorageSync(key)
    return data !== '' ? data : defaultValue
  } catch (e) {
    console.error('读取存储失败:', e)
    return defaultValue
  }
}

function saveCurrentCity(city) {
  return setStorageSync(STORAGE_KEYS.currentCity, city)
}

function getCurrentCity() {
  return getStorageSync(STORAGE_KEYS.currentCity)
}

function saveWeatherCache(cityId, weatherData) {
  var cache = getStorageSync(STORAGE_KEYS.weatherCache, {})
  cache[cityId] = {
    data: weatherData,
    timestamp: Date.now()
  }

  var cityIds = Object.keys(cache)
  if (cityIds.length > APP_CONFIG.weather.maxCacheCities) {
    var sorted = cityIds.sort(function (a, b) {
      return cache[a].timestamp - cache[b].timestamp
    })
    delete cache[sorted[0]]
  }

  return setStorageSync(STORAGE_KEYS.weatherCache, cache)
}

function getWeatherCache(cityId) {
  var cache = getStorageSync(STORAGE_KEYS.weatherCache, {})
  return cache[cityId] || null
}

function addHistoryRecord(city, weatherData) {
  var history = getStorageSync(STORAGE_KEYS.history, [])
  var record = {
    id: Date.now(),
    cityId: city.code,
    cityName: city.name,
    province: city.province,
    weather: weatherData,
    timestamp: Date.now(),
    timeStr: new Date().toLocaleString()
  }

  history.unshift(record)

  if (history.length > APP_CONFIG.weather.maxHistoryRecords) {
    history.splice(APP_CONFIG.weather.maxHistoryRecords)
  }

  return setStorageSync(STORAGE_KEYS.history, history)
}

function getHistoryRecords() {
  return getStorageSync(STORAGE_KEYS.history, [])
}

function addRecentCity(city) {
  var recent = getStorageSync(STORAGE_KEYS.recentCities, [])
  var filtered = []
  for (var i = 0; i < recent.length; i++) {
    if (recent[i].code !== city.code) {
      filtered.push(recent[i])
    }
  }
  filtered.unshift(city)

  if (filtered.length > 5) {
    filtered.splice(5)
  }

  return setStorageSync(STORAGE_KEYS.recentCities, filtered)
}

function getRecentCities() {
  return getStorageSync(STORAGE_KEYS.recentCities, [])
}

module.exports = {
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  saveCurrentCity: saveCurrentCity,
  getCurrentCity: getCurrentCity,
  saveWeatherCache: saveWeatherCache,
  getWeatherCache: getWeatherCache,
  addHistoryRecord: addHistoryRecord,
  getHistoryRecords: getHistoryRecords,
  addRecentCity: addRecentCity,
  getRecentCities: getRecentCities
}
