const fileHelper = {
  historyPath: './data/history/',

  saveWeatherData: async function(data) {
    try {
      const timestamp = Date.now()
      const fileName = `weather_${timestamp}.json`
      const record = {
        timestamp: timestamp,
        datetime: new Date(timestamp).toISOString(),
        city: data.city,
        weather: data.weather
      }

      const history = this.getHistoryFromStorage()
      history.unshift(record)
      
      const maxRecords = 100
      if (history.length > maxRecords) {
        history.splice(maxRecords)
      }

      localStorage.setItem('weather_history', JSON.stringify(history))
      console.log(`天气数据已保存: ${fileName}`)
      
      return {
        success: true,
        fileName: fileName,
        record: record
      }
    } catch (error) {
      console.error('保存天气数据失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  getHistoryFromStorage: function() {
    try {
      const data = localStorage.getItem('weather_history')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('读取历史数据失败:', error)
      return []
    }
  },

  getHistory: function(limit = 20) {
    const history = this.getHistoryFromStorage()
    return history.slice(0, limit)
  },

  getHistoryByCity: function(cityId, limit = 10) {
    const history = this.getHistoryFromStorage()
    return history
      .filter(record => record.city?.id === cityId)
      .slice(0, limit)
  },

  clearHistory: function() {
    try {
      localStorage.removeItem('weather_history')
      console.log('历史数据已清除')
      return { success: true }
    } catch (error) {
      console.error('清除历史数据失败:', error)
      return { success: false, error: error.message }
    }
  },

  exportHistory: function() {
    const history = this.getHistoryFromStorage()
    const dataStr = JSON.stringify(history, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `weather_history_${Date.now()}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    return { success: true }
  },

  formatFileSize: function(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  getStorageInfo: function() {
    const history = this.getHistoryFromStorage()
    const dataStr = JSON.stringify(history)
    return {
      recordCount: history.length,
      size: this.formatFileSize(new Blob([dataStr]).size)
    }
  }
}

export default fileHelper
