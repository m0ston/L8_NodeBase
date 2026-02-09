const os = require('os');
require('dotenv').config();

function getOSInfo() {
  console.log('Платформа:', os.platform());
  console.log('Свободная память (GB):', os.freemem() / 1024 / 1024 / 1024);
  console.log('Главная директория:', os.homedir());
  console.log('Имя хоста:', os.hostname());
  console.log('Сетевые интерфейсы:', os.networkInterfaces());
}

function checkMemory() {
  const freeMemGB = os.freemem() / 1024 / 1024 / 1024;
  return freeMemGB > 4;
}

function runIfAdmin() {
  if (process.env.MODE === 'admin') {
    getOSInfo();
  } else {
    console.log('Доступ запрещен');
  }
}

module.exports = { getOSInfo, checkMemory, runIfAdmin };