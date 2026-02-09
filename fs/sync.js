const fs = require('fs');
const path = require('path');

// 1. ф записи в файл
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
        console.log(`Файл ${filePath} успешно записан`);
    } catch (error) {
        console.error(`Ошибка записи в файл ${filePath}:`, error.message);
    }
}

// 2. ф чтения из файла
function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(`Содержимое файла ${filePath}:`, data);
        return data;
    } catch (error) {
        console.error(`Ошибка чтения файла ${filePath}:`, error.message);
        return null;
    }
}

// 3. ф изменения информации в файле (полная перезапись)
function rewriteFile(filePath, newData) {
    try {
        fs.writeFileSync(filePath, newData);
        console.log(`Файл ${filePath} полностью перезаписан`);
    } catch (error) {
        console.error(`Ошибка перезаписи файла ${filePath}:`, error.message);
    }
}

// 4. ф удаления информации из файла (очистка)
function clearFile(filePath) {
    try {
        fs.writeFileSync(filePath, '');
        console.log(`Файл ${filePath} очищен`);
    } catch (error) {
        console.error(`Ошибка очистки файла ${filePath}:`, error.message);
    }
}

// 5. ф удаления шума из файла
function cleanFileNoise(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Удаляем все цифры
        content = content.replace(/\d/g, '');
        // Переводим все большие буквы в маленькие
        content = content.toLowerCase();
        fs.writeFileSync(filePath, content);
        console.log(`Шум из файла ${filePath} удален`);
    } catch (error) {
        console.error(`Ошибка очистки шума в файле ${filePath}:`, error.message);
    }
}

// 6. ф копирования файла
function copyFile(sourcePath, destPath) {
    try {
        const data = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(destPath, data);
        console.log(`Файл скопирован из ${sourcePath} в ${destPath}`);
    } catch (error) {
        console.error(`Ошибка копирования файла:`, error.message);
    }
}

// 7. ф создания папки
function createDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Директория ${dirPath} создана`);
        } else {
            console.log(`Директория ${dirPath} уже существует`);
        }
    } catch (error) {
        console.error(`Ошибка создания директории ${dirPath}:`, error.message);
    }
}

// 8. ф удаления папки
function removeDirectory(dirPath) {
    try {
        if (fs.existsSync(dirPath)) {
            // Рекурсивно удаляем все содержимое папки
            fs.rmdirSync(dirPath, { recursive: true });
            console.log(`Директория ${dirPath} удалена`);
        } else {
            console.log(`Директория ${dirPath} не существует`);
        }
    } catch (error) {
        console.error(`Ошибка удаления директории ${dirPath}:`, error.message);
    }
}

// 9. ф вывода всех файлов проекта
function getAllProjectFiles(rootDir = __dirname) {
    const ignoreDirs = ['node_modules', '.git', '.vscode'];
    const ignoreFiles = ['.env', '.gitignore', 'package-lock.json'];
    
    function scanDir(currentPath) {
        let fileList = [];
        
        try {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                // Пропускаем игнорируемые директории
                if (stat.isDirectory()) {
                    if (ignoreDirs.includes(item)) continue;
                    fileList = fileList.concat(scanDir(fullPath));
                } else {
                    // Пропускаем игнорируемые файлы
                    if (ignoreFiles.includes(item)) continue;
                    fileList.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Ошибка сканирования директории ${currentPath}:`, error.message);
        }
        
        return fileList;
    }
    
    const files = scanDir(rootDir);
    console.log('Все файлы проекта:');
    files.forEach(file => console.log(`  - ${file}`));
    return files;
}

// 10. ф очистки проекта
function cleanProject(rootDir = __dirname) {
    const protectedItems = ['node_modules', '.git', '.env', 'package.json', 'package-lock.json', '.gitignore'];
    
    function removeItem(itemPath) {
        try {
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                const items = fs.readdirSync(itemPath);
                for (const item of items) {
                    removeItem(path.join(itemPath, item));
                }
                fs.rmdirSync(itemPath);
                console.log(`Удалена директория: ${itemPath}`);
            } else {
                fs.unlinkSync(itemPath);
                console.log(`Удален файл: ${itemPath}`);
            }
        } catch (error) {
            console.error(`Ошибка удаления ${itemPath}:`, error.message);
        }
    }
    
    try {
        const items = fs.readdirSync(rootDir);
        
        for (const item of items) {
            const fullPath = path.join(rootDir, item);
            
            if (protectedItems.includes(item)) continue;
            
            removeItem(fullPath);
        }
        
        console.log('Проект очищен (кроме служебных файлов/папок)');
    } catch (error) {
        console.error('Ошибка очистки проекта:', error.message);
    }
}

module.exports = {
    writeFile,
    readFile,
    rewriteFile,
    clearFile,
    cleanFileNoise,
    copyFile,
    createDirectory,
    removeDirectory,
    getAllProjectFiles,
    cleanProject
};