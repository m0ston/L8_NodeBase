const path = require('path');
const os = require('os');
const bcrypt = require('bcryptjs');

console.log('=== ТЕСТ ВСЕХ МОДУЛЕЙ ===\n');

console.log('1. ИНФОРМАЦИЯ О СИСТЕМЕ:');
console.log(`   Платформа: ${os.platform()}`);
console.log(`   Процессор: ${os.cpus()[0].model}`);
console.log(`   Память: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);

console.log('\n2. ТЕСТ ФАЙЛОВОЙ СИСТЕМЫ:');
const fsSync = require('../fs/sync');

fsSync.createDirectory('./modules_test');
fsSync.writeFile('./modules_test/file1.txt', 'Test data 123!');
fsSync.writeFile('./modules_test/file2.txt', 'EXAMPLE 456 XYZ');

const content1 = fsSync.readFile('./modules_test/file1.txt');

fsSync.cleanFileNoise('./modules_test/file2.txt');

fsSync.copyFile('./modules_test/file1.txt', './modules_test/copy.txt');

console.log('\n3. ТЕСТ КАСТОМНЫХ МОДУЛЕЙ:');

const { sortStringsIgnoreSpaces } = require('./sort');
const { fetchData } = require('./fetchData');
const fsModule = require('./fileSystemModule');

const strings = ['John Doe', 'Alice Smith', 'Bob Johnson'];
console.log('   Сортировка:', sortStringsIgnoreSpaces(strings));

async function testFetch() {
    try {
        const result = await fetchData('https://jsonplaceholder.typicode.com/users/1');
        if (!result.error) {
            console.log('   Данные загружены:', result.data.name);
        }
    } catch (error) {
        console.log('   Ошибка загрузки');
    }
}

console.log('   Утилиты FS:', fsModule.utils.getExtension('test.txt'));
console.log('   Существует ли папка:', fsModule.utils.exists('./modules_test'));

setTimeout(() => {
    fsSync.removeDirectory('./modules_test');
}, 1000);

testFetch().then(() => {
    console.log('\n=== ТЕСТ ЗАВЕРШЕН ===');
});