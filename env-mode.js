const path = require('path');
const fs = require('fs');

function loadEnvFile() {
  const env = process.env.NODE_ENV || 'development';
  let envFile;
  
  switch(env) {
    case 'production':
      envFile = '.env.production';
      break;
    case 'domain':
      envFile = '.env.domain';
      break;
    default:
      envFile = '.env.development';
  }
  
  if (fs.existsSync(path.join(__dirname, envFile))) {
    require('dotenv').config({ path: envFile });
    console.log(`Загружен файл: ${envFile}`);
    console.log(`Режим работы: ${process.env.MODE}`);
    console.log(`Порт: ${process.env.PORT}`);
  } else {
    console.error(`Файл ${envFile} не найден!`);
  }
}

module.exports = { loadEnvFile };