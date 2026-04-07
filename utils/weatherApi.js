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

function formatHour(dateStr) {
  var date = new Date(dateStr)
  var hours = date.getHours()
  return (hours < 10 ? '0' : '') + hours + ':00'
}

function formatDate(dateStr) {
  var date = new Date(dateStr)
  var month = date.getMonth() + 1
  var day = date.getDate()
  return month + '/' + day
}

function getWeekDay(dateStr) {
  var date = new Date(dateStr)
  var weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDays[date.getDay()]
}

function getWindDirectionStr(degree) {
  var directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
  var index = Math.round(degree / 45) % 8
  return directions[index]
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

function formatUpdateTime() {
  var now = new Date()
  var year = now.getFullYear()
  var month = (now.getMonth() + 1).toString().padStart(2, '0')
  var day = now.getDate().toString().padStart(2, '0')
  var hours = now.getHours().toString().padStart(2, '0')
  var minutes = now.getMinutes().toString().padStart(2, '0')
  var seconds = now.getSeconds().toString().padStart(2, '0')
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

function fetchWeather(city, callbacks) {
  if (!city || !city.latitude || !city.longitude) {
    if (callbacks.fail) {
      callbacks.fail({ message: '城市信息不完整' })
    }
    return
  }

  var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + city.latitude + 
            '&longitude=' + city.longitude + 
            '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m' +
            '&hourly=temperature_2m,weather_code' +
            '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
            '&timezone=auto&forecast_days=7'

  wx.request({
    url: url,
    method: 'GET',
    timeout: 10000,
    success: function (res) {
      if (res.statusCode === 200) {
        try {
          var data = parseWeatherData(res.data, city)
          if (callbacks.success) {
            callbacks.success(data)
          }
        } catch (e) {
          if (callbacks.fail) {
            callbacks.fail({ message: '数据解析失败: ' + e.message })
          }
        }
      } else {
        if (callbacks.fail) {
          callbacks.fail({ message: 'API请求失败: ' + res.statusCode })
        }
      }
    },
    fail: function (err) {
      if (callbacks.fail) {
        callbacks.fail({ message: '网络请求失败: ' + (err.errMsg || '未知错误') })
      }
    }
  })
}

function parseWeatherData(rawData, city) {
  var current = rawData.current
  var hourly = rawData.hourly
  var daily = rawData.daily
  var weatherInfo = getWeatherInfo(current.weather_code)

  var hourlyForecast = []
  for (var i = 0; i < 24 && i < hourly.time.length; i++) {
    hourlyForecast.push({
      timeStr: formatHour(hourly.time[i]),
      temperature: Math.round(hourly.temperature_2m[i]),
      weatherInfo: getWeatherInfo(hourly.weather_code[i])
    })
  }

  var dailyForecast = []
  for (var j = 0; j < 7 && j < daily.time.length; j++) {
    dailyForecast.push({
      dateStr: formatDate(daily.time[j]),
      weekDay: getWeekDay(daily.time[j]),
      maxTemp: Math.round(daily.temperature_2m_max[j]),
      minTemp: Math.round(daily.temperature_2m_min[j]),
      weatherInfo: getWeatherInfo(daily.weather_code[j])
    })
  }

  return {
    cityId: city.id,
    cityName: city.name,
    current: {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      weatherDescription: weatherInfo.description,
      weatherIcon: weatherInfo.icon,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      windDirection: getWindDirectionStr(current.wind_direction_10m),
      aqi: getRandomAQI()
    },
    hourlyForecast: hourlyForecast,
    dailyForecast: dailyForecast,
    timestamp: Date.now(),
    updateTime: formatUpdateTime()
  }
}

module.exports = {
  fetchWeather: fetchWeather
}
