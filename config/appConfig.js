module.exports = {
  api: {
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    timeout: 10000
  },
  weather: {
    requestInterval: 1800000,
    maxCacheCities: 5,
    maxHistoryRecords: 20
  },
  storageKeys: {
    currentCity: 'weather_currentCity',
    weatherCache: 'weather_cache',
    history: 'weather_history',
    recentCities: 'weather_recentCities'
  }
}
