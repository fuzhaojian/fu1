var APP_CONFIG = require('../config/appConfig.js')

var WEATHER_CODES = {
  0: { description: '晴朗', icon: '☀️' },
  1: { description: '大部晴朗', icon: '🌤️' },
  2: { description: '多云', icon: '⛅' },
  3: { description: '阴天', icon: '☁️' },
  45: { description: '雾', icon: '🌫️' },
  48: { description: '雾凇', icon: '🌫️' },
  51: { description: '小毛毛雨', icon: '🌧️' },
  53: { description: '毛毛雨', icon: '🌧️' },
  55: { description: '大毛毛雨', icon: '🌧️' },
  56: { description: '冻毛毛雨', icon: '🌧️' },
  57: { description: '强冻毛毛雨', icon: '🌧️' },
  61: { description: '小雨', icon: '🌧️' },
  63: { description: '中雨', icon: '🌧️' },
  65: { description: '大雨', icon: '🌧️' },
  66: { description: '冻雨', icon: '🌧️' },
  67: { description: '强冻雨', icon: '🌧️' },
  71: { description: '小雪', icon: '❄️' },
  73: { description: '中雪', icon: '❄️' },
  75: { description: '大雪', icon: '❄️' },
  77: { description: '雪粒', icon: '❄️' },
  80: { description: '小阵雨', icon: '🌦️' },
  81: { description: '阵雨', icon: '🌦️' },
  82: { description: '强阵雨', icon: '🌦️' },
  85: { description: '小阵雪', icon: '🌨️' },
  86: { description: '大阵雪', icon: '🌨️' },
  95: { description: '雷暴', icon: '⛈️' },
  96: { description: '雷暴伴小冰雹', icon: '⛈️' },
  99: { description: '雷暴伴大冰雹', icon: '⛈️' }
}

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { description: '未知', icon: '❓' }
}

function fetchWeather(city) {
  return new Promise(function (resolve, reject) {
    if (!city || !city.latitude || !city.longitude) {
      reject(new Error('城市信息不完整'))
      return
    }

    var baseUrl = APP_CONFIG.api.baseUrl
    var url = baseUrl + '?latitude=' + city.latitude + '&longitude=' + city.longitude + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7'

    wx.request({
      url: url,
      method: 'GET',
      timeout: APP_CONFIG.api.timeout,
      success: function (res) {
        if (res.statusCode === 200 && res.data) {
          var parsedData = parseWeatherData(res.data, city)
          resolve(parsedData)
        } else {
          reject(new Error('API请求失败: ' + res.statusCode))
        }
      },
      fail: function (err) {
        console.error('天气API请求失败:', err)
        reject(new Error('网络请求失败，请检查网络连接'))
      }
    })
  })
}

function parseWeatherData(rawData, city) {
  var current = rawData.current
  var hourly = rawData.hourly
  var daily = rawData.daily
  var weatherInfo = getWeatherInfo(current.weather_code)

  var hourlyForecast = []
  for (var i = 0; i < 24; i++) {
    var hourTime = new Date(hourly.time[i])
    hourlyForecast.push({
      time: hourTime,
      timeStr: formatHour(hourTime),
      temperature: Math.round(hourly.temperature_2m[i]),
      weatherInfo: getWeatherInfo(hourly.weather_code[i])
    })
  }

  var dailyForecast = []
  for (var i = 0; i < 7; i++) {
    var date = new Date(daily.time[i])
    dailyForecast.push({
      date: date,
      dateStr: formatDate(date),
      weekDay: getWeekDay(date),
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      weatherInfo: getWeatherInfo(daily.weather_code[i])
    })
  }

  return {
    cityId: city.code,
    cityName: city.name,
    province: city.province,
    current: {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      weatherDescription: weatherInfo.description,
      weatherIcon: weatherInfo.icon,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      windDirection: current.wind_direction_10m,
      windDirectionStr: getWindDirectionStr(current.wind_direction_10m),
      aqi: getRandomAQI()
    },
    hourlyForecast: hourlyForecast,
    dailyForecast: dailyForecast,
    timestamp: Date.now(),
    fetchedAt: new Date().toLocaleString()
  }
}

function formatHour(date) {
  var hours = date.getHours()
  return (hours < 10 ? '0' : '') + hours + ':00'
}

function formatDate(date) {
  var month = date.getMonth() + 1
  var day = date.getDate()
  return month + '/' + day
}

function getWeekDay(date) {
  var weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDays[date.getDay()]
}

function getWindDirectionStr(degree) {
  var directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
  var index = Math.round(degree / 45) % 8
  return directions[index] + '风'
}

function getRandomAQI() {
  var level = Math.floor(Math.random() * 3)
  if (level === 0) {
    return { value: Math.floor(Math.random() * 50) + 1, level: '优', color: '#67c23a' }
  } else if (level === 1) {
    return { value: Math.floor(Math.random() * 50) + 51, level: '良', color: '#e6a23c' }
  } else {
    return { value: Math.floor(Math.random() * 50) + 101, level: '轻度', color: '#f56c6c' }
  }
}

module.exports = {
  fetchWeather: fetchWeather,
  getWeatherInfo: getWeatherInfo,
  WEATHER_CODES: WEATHER_CODES
}
