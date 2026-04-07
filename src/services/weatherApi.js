import configLoader from '../utils/configLoader.js'
import fileHelper from '../utils/fileHelper.js'

const weatherApi = {
  timer: null,
  listeners: [],
  isOnline: navigator.onLine,

  fetchWeather: async function(city) {
    try {
      const config = configLoader.getConfig()
      const endpoint = config.api?.endpoint || 'https://api.open-meteo.com/v1/forecast'
      
      const params = new URLSearchParams({
        latitude: city.latitude,
        longitude: city.longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
        timezone: 'auto',
        forecast_days: 1
      })

      const response = await fetch(`${endpoint}?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const weatherData = {
        city: city,
        weather: {
          temperature: data.current?.temperature_2m,
          humidity: data.current?.relative_humidity_2m,
          weatherCode: data.current?.weather_code,
          weatherDescription: this.getWeatherDescription(data.current?.weather_code),
          windSpeed: data.current?.wind_speed_10m,
          windDirection: this.getWindDirection(data.current?.wind_direction_10m),
          updateTime: new Date().toISOString()
        }
      }

      await fileHelper.saveWeatherData(weatherData)
      
      return {
        success: true,
        data: weatherData
      }
    } catch (error) {
      console.error('获取天气数据失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  getWeatherDescription: function(code) {
    const weatherMap = {
      0: '晴朗',
      1: '大部晴朗',
      2: '局部多云',
      3: '阴天',
      45: '雾',
      48: '雾凇',
      51: '小毛毛雨',
      53: '中毛毛雨',
      55: '大毛毛雨',
      61: '小雨',
      63: '中雨',
      65: '大雨',
      71: '小雪',
      73: '中雪',
      75: '大雪',
      80: '小阵雨',
      81: '中阵雨',
      82: '大阵雨',
      95: '雷暴',
      96: '雷暴伴小冰雹',
      99: '雷暴伴大冰雹'
    }
    return weatherMap[code] || '未知'
  },

  getWindDirection: function(degrees) {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  },

  startAutoFetch: function(city, callback, interval = 30000) {
    this.stopAutoFetch()
    
    this.fetchWeather(city).then(result => {
      callback(result)
    })

    this.timer = setInterval(async () => {
      if (this.isOnline) {
        const result = await this.fetchWeather(city)
        callback(result)
      }
    }, interval)

    console.log(`定时获取已启动，间隔: ${interval}ms`)
  },

  stopAutoFetch: function() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
      console.log('定时获取已停止')
    }
  },

  setOnlineStatus: function(status) {
    this.isOnline = status
    if (status) {
      console.log('网络已恢复')
    } else {
      console.log('网络已断开')
    }
  },

  getOnlineStatus: function() {
    return this.isOnline
  }
}

window.addEventListener('online', () => {
  weatherApi.setOnlineStatus(true)
})

window.addEventListener('offline', () => {
  weatherApi.setOnlineStatus(false)
})

export default weatherApi
