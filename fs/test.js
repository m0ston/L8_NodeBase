// Тест синхронных функций
console.log('=== Тест синхронных функций ===');
const syncFS = require('./sync');

// 1. Создаем тестовую директорию
syncFS.createDirectory('./test_sync');

// 2. Записываем файл
syncFS.writeFile('./test_sync/test.txt', 'Hello 123 WORLD!');

// 3. Читаем файл
const content = syncFS.readFile('./test_sync/test.txt');

// 4. Перезаписываем файл
syncFS.rewriteFile('./test_sync/test.txt', 'New content 456!');

// 5. Очищаем шум
syncFS.cleanFileNoise('./test_sync/test.txt');

// 6. Копируем файл
syncFS.copyFile('./test_sync/test.txt', './test_sync/copy.txt');

// 7. Получаем список файлов
syncFS.getAllProjectFiles();

// 8. Очищаем файл
syncFS.clearFile('./test_sync/test.txt');

// 9. Удаляем директорию
setTimeout(() => {
    syncFS.removeDirectory('./test_sync');
}, 1000);

// Тест асинхронных функций
console.log('\n=== Тест асинхронных функций ===');
const asyncFS = require('./async');

async function testAsync() {
    // 1. Создаем тестовую директорию
    await asyncFS.createDirectory('./test_async');
    
    // 2. Записываем файл
    await asyncFS.writeFile('./test_async/test.txt', 'Hello 789 WORLD!');
    
    // 3. Читаем файл
    await asyncFS.readFile('./test_async/test.txt');
    
    // 4. Перезаписываем файл
    await asyncFS.rewriteFile('./test_async/test.txt', 'New async content 123!');
    
    // 5. Очищаем шум
    await asyncFS.cleanFileNoise('./test_async/test.txt');
    
    // 6. Копируем файл
    await asyncFS.copyFile('./test_async/test.txt', './test_async/copy.txt');
    
    // 7. Получаем список файлов
    await asyncFS.getAllProjectFiles();
    
    // 8. Очищаем файл
    await asyncFS.clearFile('./test_async/test.txt');
    
    // 9. Удаляем директорию
    setTimeout(async () => {
        await asyncFS.removeDirectory('./test_async');
    }, 1000);
}

testAsync();