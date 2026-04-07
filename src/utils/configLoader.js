import yaml from 'js-yaml'

const configLoader = {
  config: null,

  loadConfig: async function() {
    try {
      const response = await fetch('./config/appConfig.yaml')
      const text = await response.text()
      this.config = yaml.load(text)
      return this.config
    } catch (error) {
      console.error('加载配置文件失败:', error)
      return this.getDefaultConfig()
    }
  },

  getDefaultConfig: function() {
    return {
      api: {
        endpoint: 'https://api.open-meteo.com/v1/forecast',
        timeout: 10000
      },
      schedule: {
        interval: 30000
      },
      defaultCity: 'beijing',
      cities: [
        { id: 'beijing', name: '北京', latitude: 39.9042, longitude: 116.4074 },
        { id: 'shanghai', name: '上海', latitude: 31.2304, longitude: 121.4737 },
        { id: 'guangzhou', name: '广州', latitude: 23.1291, longitude: 113.2644 },
        { id: 'shenzhen', name: '深圳', latitude: 22.5431, longitude: 114.0579 },
        { id: 'hangzhou', name: '杭州', latitude: 30.2741, longitude: 120.1551 }
      ],
      history: {
        maxRecords: 100,
        savePath: './data/history/'
      }
    }
  },

  getConfig: function() {
    return this.config || this.getDefaultConfig()
  },

  getCities: function() {
    const config = this.getConfig()
    return config.cities || []
  },

  getDefaultCity: function() {
    const config = this.getConfig()
    const cities = config.cities || []
    const defaultId = config.defaultCity || 'beijing'
    return cities.find(city => city.id === defaultId) || cities[0]
  },

  getInterval: function() {
    const config = this.getConfig()
    return config.schedule?.interval || 30000
  },

  getApiEndpoint: function() {
    const config = this.getConfig()
    return config.api?.endpoint || 'https://api.open-meteo.com/v1/forecast'
  }
}

export default configLoader
