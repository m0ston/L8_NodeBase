const fs = require('fs/promises');
const path = require('path');

// 1. ф записи в файл 
async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, data);
        console.log(`Файл ${filePath} успешно записан`);
    } catch (error) {
        console.error(`Ошибка записи в файл ${filePath}:`, error.message);
    }
}

// 2. ф чтения из файла 
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        console.log(`Содержимое файла ${filePath}:`, data);
        return data;
    } catch (error) {
        console.error(`Ошибка чтения файла ${filePath}:`, error.message);
        return null;
    }
}

// 3. ф изменения информации в файле 
async function rewriteFile(filePath, newData) {
    try {
        await fs.writeFile(filePath, newData);
        console.log(`Файл ${filePath} полностью перезаписан`);
    } catch (error) {
        console.error(`Ошибка перезаписи файла ${filePath}:`, error.message);
    }
}

// 4. ф удаления информации из файла
async function clearFile(filePath) {
    try {
        await fs.writeFile(filePath, '');
        console.log(`Файл ${filePath} очищен`);
    } catch (error) {
        console.error(`Ошибка очистки файла ${filePath}:`, error.message);
    }
}

// 5. ф удаления шума из файла 
async function cleanFileNoise(filePath) {
    try {
        let content = await fs.readFile(filePath, 'utf8');
        content = content.replace(/\d/g, '').toLowerCase();
        await fs.writeFile(filePath, content);
        console.log(`Шум из файла ${filePath} удален`);
    } catch (error) {
        console.error(`Ошибка очистки шума в файле ${filePath}:`, error.message);
    }
}

// 6. ф копирования файла 
async function copyFile(sourcePath, destPath) {
    try {
        const data = await fs.readFile(sourcePath, 'utf8');
        await fs.writeFile(destPath, data);
        console.log(`Файл скопирован из ${sourcePath} в ${destPath}`);
    } catch (error) {
        console.error(`Ошибка копирования файла:`, error.message);
    }
}

// 7. ф создания папки 
async function createDirectory(dirPath) {
    try {
        await fs.access(dirPath).catch(async () => {
            await fs.mkdir(dirPath, { recursive: true });
            console.log(`Директория ${dirPath} создана`);
        });
        console.log(`Директория ${dirPath} уже существует`);
    } catch (error) {
        console.error(`Ошибка создания директории ${dirPath}:`, error.message);
    }
}

// 8. ф удаления папки 
async function removeDirectory(dirPath) {
    try {
        await fs.access(dirPath);
        await fs.rm(dirPath, { recursive: true, force: true });
        console.log(`Директория ${dirPath} удалена`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`Директория ${dirPath} не существует`);
        } else {
            console.error(`Ошибка удаления директории ${dirPath}:`, error.message);
        }
    }
}

// 9. ф вывода всех файлов проекта
async function getAllProjectFiles(rootDir = __dirname) {
    const ignoreDirs = ['node_modules', '.git', '.vscode'];
    const ignoreFiles = ['.env', '.gitignore', 'package-lock.json'];
    
    async function scanDir(currentPath) {
        let fileList = [];
        
        try {
            const items = await fs.readdir(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = await fs.stat(fullPath);
                
                if (stat.isDirectory()) {
                    if (ignoreDirs.includes(item)) continue;
                    const subFiles = await scanDir(fullPath);
                    fileList = fileList.concat(subFiles);
                } else {
                    if (ignoreFiles.includes(item)) continue;
                    fileList.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Ошибка сканирования директории ${currentPath}:`, error.message);
        }
        
        return fileList;
    }
    
    const files = await scanDir(rootDir);
    console.log('Все файлы проекта:');
    files.forEach(file => console.log(`  - ${file}`));
    return files;
}

// 10. ф очистки проекта 
async function cleanProject(rootDir = __dirname) {
    const protectedItems = ['node_modules', '.git', '.env', 'package.json', 'package-lock.json', '.gitignore'];
    
    async function removeItem(itemPath) {
        try {
            const stat = await fs.stat(itemPath);
            
            if (stat.isDirectory()) {
                const items = await fs.readdir(itemPath);
                for (const item of items) {
                    await removeItem(path.join(itemPath, item));
                }
                await fs.rmdir(itemPath);
                console.log(`Удалена директория: ${itemPath}`);
            } else {
                await fs.unlink(itemPath);
                console.log(`Удален файл: ${itemPath}`);
            }
        } catch (error) {
            console.error(`Ошибка удаления ${itemPath}:`, error.message);
        }
    }
    
    try {
        const items = await fs.readdir(rootDir);
        
        for (const item of items) {
            const fullPath = path.join(rootDir, item);
            
            if (protectedItems.includes(item)) continue;
            
            await removeItem(fullPath);
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