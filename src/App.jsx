import React, { useState, useEffect, useCallback } from 'react'
import WeatherCard from './components/WeatherCard.jsx'
import configLoader from './utils/configLoader.js'
import weatherApi from './services/weatherApi.js'
import fileHelper from './utils/fileHelper.js'
import './App.css'

function App() {
  const [config, setConfig] = useState(null)
  const [cities, setCities] = useState([])
  const [currentCity, setCurrentCity] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const initConfig = async () => {
      const cfg = await configLoader.loadConfig()
      setConfig(cfg)
      setCities(cfg.cities || [])
      const defaultCity = cfg.cities?.find(c => c.id === cfg.defaultCity) || cfg.cities?.[0]
      if (defaultCity) {
        setCurrentCity(defaultCity)
      }
    }
    initConfig()
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchWeather = useCallback(async () => {
    if (!currentCity) return
    
    setLoading(true)
    setError(null)
    
    const result = await weatherApi.fetchWeather(currentCity)
    
    if (result.success) {
      setWeatherData(result.data)
      const historyData = fileHelper.getHistory(20)
      setHistory(historyData)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }, [currentCity])

  useEffect(() => {
    if (currentCity && config) {
      const interval = config.schedule?.interval || 30000
      weatherApi.startAutoFetch(currentCity, (result) => {
        if (result.success) {
          setWeatherData(result.data)
          const historyData = fileHelper.getHistory(20)
          setHistory(historyData)
        } else {
          setError(result.error)
        }
      }, interval)

      return () => {
        weatherApi.stopAutoFetch()
      }
    }
  }, [currentCity, config])

  const handleCityChange = (e) => {
    const cityId = e.target.value
    const city = cities.find(c => c.id === cityId)
    if (city) {
      setCurrentCity(city)
      setWeatherData(null)
      setError(null)
    }
  }

  const handleExport = () => {
    fileHelper.exportHistory()
  }

  const handleClearHistory = () => {
    if (confirm('确定要清除所有历史数据吗？')) {
      fileHelper.clearHistory()
      setHistory([])
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🌤️ 天气监控</h1>
        <div className="status">
          <span className={`online-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 在线' : '🔴 离线'}
          </span>
        </div>
      </header>

      <main className="main">
        <div className="city-selector">
          <label htmlFor="city">选择城市：</label>
          <select id="city" value={currentCity?.id || ''} onChange={handleCityChange}>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <WeatherCard 
          weatherData={weatherData}
          loading={loading}
          error={error}
          isOnline={isOnline}
        />

        <div className="history-section">
          <div className="history-header">
            <h3>📜 历史记录</h3>
            <div className="history-actions">
              <button onClick={handleExport} className="btn-export">
                导出数据
              </button>
              <button onClick={handleClearHistory} className="btn-clear">
                清除历史
              </button>
            </div>
          </div>
          
          {history.length > 0 ? (
            <div className="history-list">
              {history.slice(0, 10).map((record, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">
                    {new Date(record.timestamp).toLocaleString('zh-CN')}
                  </div>
                  <div className="history-city">{record.city?.name}</div>
                  <div className="history-temp">
                    {record.weather?.temperature}°C
                  </div>
                  <div className="history-desc">
                    {record.weather?.weatherDescription}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-history">暂无历史记录</div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>定时刷新间隔：{config?.schedule?.interval / 1000 || 30}秒</p>
        <p>数据来源：Open-Meteo API</p>
      </footer>
    </div>
  )
}

export default App
