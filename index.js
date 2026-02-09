require('dotenv').config();

const { loadEnvFile } = require('./env-mode');

loadEnvFile();

// вывод информации из .env
console.log(`   Имя: ${process.env.NAME}`);
console.log(`   Фамилия: ${process.env.SURNAME}`);
console.log(`   Группа: ${process.env.GROUP}`);
console.log(`   Номер по списку: ${process.env.LIST_NUMBER}`);
console.log(`   Режим: ${process.env.MODE}`);
console.log(`   Порт: ${process.env.PORT || 'не указан'}`);