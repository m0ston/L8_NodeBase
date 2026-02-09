const os = require('os');

function getOSInfo() {
    console.log('=== Информация об ОС ===');
    console.log('Платформа:', os.platform());
    console.log('Архитектура:', os.arch());
    console.log('Версия:', os.version());
    console.log('Имя хоста:', os.hostname());
    console.log('Свободная память:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
    console.log('Общая память:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
    console.log('Главная директория:', os.homedir());
    console.log('Время работы:', (os.uptime() / 3600).toFixed(2), 'часов');
}

function checkMemory(minGB = 4) {
    const freeMemGB = os.freemem() / 1024 / 1024 / 1024;
    const hasEnoughMemory = freeMemGB > minGB;
    console.log(`Свободной памяти: ${freeMemGB.toFixed(2)}GB`);
    console.log(`Требуется: >${minGB}GB`);
    console.log(`Статус: ${hasEnoughMemory ? '✅ Достаточно' : '❌ Недостаточно'}`);
    return hasEnoughMemory;
}

function checkAccessMode() {
    const mode = process.env.MODE;
    console.log('=== Проверка режима доступа ===');
    console.log('Текущий режим:', mode);
    
    if (mode === 'admin' || mode === 'development') {
        console.log('✅ Доступ разрешен к функциям ОС');
        return true;
    } else {
        console.log('⚠️  Доступ ограничен. Только базовые функции');
        return false;
    }
}

module.exports = {
    getOSInfo,
    checkMemory,
    checkAccessMode
};