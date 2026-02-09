const fs = require('fs');
const path = require('path');

const syncFS = require('../fs/sync');
const asyncFS = require('../fs/async');

class FileSystemModule {
    constructor() {
        this.sync = syncFS;
        this.async = asyncFS;
    }

    get utils() {
        return {
            getExtension: (filename) => path.extname(filename),
            getBasename: (filepath) => path.basename(filepath),
            getFilename: (filepath) => path.basename(filepath, path.extname(filepath)),
            join: (...paths) => path.join(...paths),
            exists: (filepath) => fs.existsSync(filepath),
            resolve: (...paths) => path.resolve(...paths),
            relative: (from, to) => path.relative(from, to),
            getDirname: (filepath) => path.dirname(filepath),
            normalize: (filepath) => path.normalize(filepath)
        };
    }

    get helpers() {
        return {
            findFilesByExtension: (dir, extension) => {
                const files = [];
                
                function scan(currentPath) {
                    const items = fs.readdirSync(currentPath);
                    
                    for (const item of items) {
                        const fullPath = path.join(currentPath, item);
                        const stat = fs.statSync(fullPath);
                        
                        if (stat.isDirectory()) {
                            scan(fullPath);
                        } else if (path.extname(item) === extension) {
                            files.push(fullPath);
                        }
                    }
                }
                
                scan(dir);
                return files;
            },
            readAllFilesInDir: (dir) => {
                const result = {};
                
                function scan(currentPath) {
                    const items = fs.readdirSync(currentPath);
                    
                    for (const item of items) {
                        const fullPath = path.join(currentPath, item);
                        const stat = fs.statSync(fullPath);
                        
                        if (stat.isDirectory()) {
                            scan(fullPath);
                        } else {
                            const content = fs.readFileSync(fullPath, 'utf8');
                            const relativePath = path.relative(dir, fullPath);
                            result[relativePath] = content;
                        }
                    }
                }
                
                scan(dir);
                return result;
            },

            createStructureFromObject: (basePath, structure) => {
                for (const [key, value] of Object.entries(structure)) {
                    const itemPath = path.join(basePath, key);
                    
                    if (typeof value === 'string') {
                        fs.writeFileSync(itemPath, value);
                    } else if (typeof value === 'object' && value !== null) {
                        fs.mkdirSync(itemPath, { recursive: true });
                        this.helpers.createStructureFromObject(itemPath, value);
                    }
                }
            }
        };
    }


    async getStats(dirPath = '.') {
        let totalFiles = 0;
        let totalSize = 0;
        let extensions = {};
        
        function scan(currentPath) {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scan(fullPath);
                } else {
                    totalFiles++;
                    totalSize += stat.size;
                    
                    const ext = path.extname(item) || 'без расширения';
                    extensions[ext] = (extensions[ext] || 0) + 1;
                }
            }
        }
        
        scan(dirPath);
        
        return {
            totalFiles,
            totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
            extensions,
            averageFileSize: `${(totalSize / totalFiles / 1024).toFixed(2)} KB`
        };
    }
}

const fileSystemModule = new FileSystemModule();
module.exports = fileSystemModule;