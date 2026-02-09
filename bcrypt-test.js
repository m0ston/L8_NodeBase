const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function hashPasswords() {
  const passwords = [
    'password1', 'password2', 'password3',
    'password4', 'password5', 'password6',
    'password7', 'password8', 'password9',
    'password10', 'password11', 'password12',
    'password13'
  ];

  const times = [];

  for (let i = 0; i < passwords.length; i++) {
    const start = Date.now();
    const hash = await bcrypt.hash(passwords[i], saltRounds);
    const end = Date.now();
    const time = end - start;
    times.push(time);
    console.log(`Пароль ${i + 1}: ${time}ms`);
  }

  console.log('\nАнализ времени:');
  console.log(`Минимальное время: ${Math.min(...times)}ms`);
  console.log(`Максимальное время: ${Math.max(...times)}ms`);
  console.log(`Среднее время: ${(times.reduce((a, b) => a + b) / times.length).toFixed(2)}ms`);
  
  console.log('\nВывод о времени:');
  console.log('1. Время хеширования может варьироваться из-за разной сложности паролей');
  console.log('2. Bcrypt использует "соль" (salt) для усиления безопасности');
  console.log('3. Время зависит от количества раундов (saltRounds)');
  console.log('4. Более длинные пароли занимают больше времени');
}

hashPasswords();