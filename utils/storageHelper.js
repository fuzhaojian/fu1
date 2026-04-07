var CACHE_KEY = 'weather_cache'
var HISTORY_KEY = 'weather_history'
var LAST_CITY_KEY = 'weather_last_city'
var MAX_HISTORY = 20
var CACHE_EXPIRE = 5 * 60 * 1000

function getCache() {
  try {
    var cache = wx.getStorageSync(CACHE_KEY)
    if (cache) {
      return JSON.parse(cache)
    }
  } catch (e) {
    console.log('读取缓存失败', e)
  }
  return null
}

function setCache(data) {
  try {
    var cacheData = {
      data: data,
      timestamp: Date.now()
    }
    wx.setStorageSync(CACHE_KEY, JSON.stringify(cacheData))
  } catch (e) {
    console.log('保存缓存失败', e)
  }
}

function getValidCache(cityId) {
  var cache = getCache()
  if (cache && cache.data && cache.data.cityId === cityId) {
    if (Date.now() - cache.timestamp < CACHE_EXPIRE) {
      return cache.data
    }
  }
  return null
}

function getHistory() {
  try {
    var history = wx.getStorageSync(HISTORY_KEY)
    if (history) {
      return JSON.parse(history)
    }
  } catch (e) {
    console.log('读取历史记录失败', e)
  }
  return []
}

function saveWeatherHistory(weatherData) {
  try {
    var history = getHistory()
    var record = {
      timestamp: Date.now(),
      city: {
        id: weatherData.cityId,
        name: weatherData.cityName
      },
      weather: {
        temperature: weatherData.current.temperature,
        humidity: weatherData.current.humidity,
        description: weatherData.current.weatherDescription,
        windSpeed: weatherData.current.windSpeed
      }
    }
    
    history.unshift(record)
    
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY)
    }
    
    wx.setStorageSync(HISTORY_KEY, JSON.stringify(history))
    setCache(weatherData)
    
    console.log('天气历史已保存', record)
  } catch (e) {
    console.log('保存历史记录失败', e)
  }
}

function getLastCity() {
  try {
    var city = wx.getStorageSync(LAST_CITY_KEY)
    if (city) {
      return JSON.parse(city)
    }
  } catch (e) {
    console.log('读取上次城市失败', e)
  }
  return null
}

function saveLastCity(city) {
  try {
    wx.setStorageSync(LAST_CITY_KEY, JSON.stringify(city))
  } catch (e) {
    console.log('保存上次城市失败', e)
  }
}

function clearHistory() {
  try {
    wx.removeStorageSync(HISTORY_KEY)
    wx.removeStorageSync(CACHE_KEY)
  } catch (e) {
    console.log('清除历史记录失败', e)
  }
}

module.exports = {
  getCache: getCache,
  setCache: setCache,
  getValidCache: getValidCache,
  getHistory: getHistory,
  saveWeatherHistory: saveWeatherHistory,
  getLastCity: getLastCity,
  saveLastCity: saveLastCity,
  clearHistory: clearHistory
}
