const https = require('https');
const http = require('http');

class DataLoader {
    constructor() {
        this.state = {
            isLoading: false,
            error: null,
            data: null
        };
    }

    async load(url) {
        this.state.isLoading = true;
        this.state.error = null;
        this.state.data = null;

        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            
            const request = protocol.get(url, (response) => {
                let data = '';

                if (response.statusCode !== 200) {
                    this.state.error = `HTTP ${response.statusCode}: ${response.statusMessage}`;
                    this.state.isLoading = false;
                    reject(this._getResult());
                    return;
                }

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    this.state.isLoading = false;
                    try {
                        this.state.data = JSON.parse(data);
                        resolve(this._getResult());
                    } catch (error) {
                        this.state.error = 'Ошибка парсинга JSON: ' + error.message;
                        reject(this._getResult());
                    }
                });
            });

            request.on('error', (error) => {
                this.state.isLoading = false;
                this.state.error = 'Ошибка сети: ' + error.message;
                reject(this._getResult());
            });

            request.setTimeout(10000, () => {
                request.destroy();
                this.state.isLoading = false;
                this.state.error = 'Таймаут запроса';
                reject(this._getResult());
            });
        });
    }

    _getResult() {
        return {
            data: this.state.data,
            isLoading: this.state.isLoading,
            error: this.state.error
        };
    }

    static async fetch(url) {
        const loader = new DataLoader();
        return loader.load(url);
    }
}

module.exports = {
    DataLoader,
    fetchData: DataLoader.fetch
};