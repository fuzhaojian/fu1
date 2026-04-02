var CITIES = require('../config/cities.js')

function getAllCities() {
  return CITIES
}

function getCitiesByProvince(province) {
  return CITIES.filter(function (city) {
    return city.province === province
  })
}

function getAllProvinces() {
  var provinces = []
  var provinceSet = {}
  for (var i = 0; i < CITIES.length; i++) {
    var p = CITIES[i].province
    if (!provinceSet[p]) {
      provinceSet[p] = true
      provinces.push(p)
    }
  }
  return provinces.sort()
}

function searchCities(keyword) {
  if (!keyword || keyword.trim() === '') {
    return []
  }

  var lowerKeyword = keyword.toLowerCase().trim()

  return CITIES.filter(function (city) {
    return city.name.toLowerCase().indexOf(lowerKeyword) > -1 ||
      city.pinyin.toLowerCase().indexOf(lowerKeyword) > -1 ||
      city.code.indexOf(keyword) > -1
  })
}

function getCityByCode(code) {
  for (var i = 0; i < CITIES.length; i++) {
    if (CITIES[i].code === code) {
      return CITIES[i]
    }
  }
  return null
}

function getDefaultCity() {
  return CITIES[0]
}

module.exports = {
  getAllCities: getAllCities,
  getCitiesByProvince: getCitiesByProvince,
  getAllProvinces: getAllProvinces,
  searchCities: searchCities,
  getCityByCode: getCityByCode,
  getDefaultCity: getDefaultCity
}
