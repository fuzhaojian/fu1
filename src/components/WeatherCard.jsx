import React from 'react'
import './WeatherCard.css'

function WeatherCard({ weatherData, loading, error, isOnline }) {
  if (loading) {
    return (
      <div className="weather-card loading">
        <div className="spinner"></div>
        <p>正在获取天气数据...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-card error">
        <div className="error-icon">⚠️</div>
        <h3>获取天气失败</h3>
        <p>{error}</p>
        {!isOnline && (
          <p className="offline-tip">网络已断开，请检查网络连接</p>
        )}
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="weather-card empty">
        <div className="empty-icon">🌤️</div>
        <p>请选择城市查看天气</p>
      </div>
    )
  }

  const { weather, city } = weatherData

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2 className="city-name">{city.name}</h2>
        <div className="update-time">
          更新时间：{new Date(weather.updateTime).toLocaleString('zh-CN')}
        </div>
      </div>

      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{weather.temperature}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-desc">{weather.weatherDescription}</div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">💧</div>
          <div className="detail-label">湿度</div>
          <div className="detail-value">{weather.humidity}%</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">🍃</div>
          <div className="detail-label">风向</div>
          <div className="detail-value">{weather.windDirection}风</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">🌬️</div>
          <div className="detail-label">风速</div>
          <div className="detail-value">{weather.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
