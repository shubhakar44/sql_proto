//Mock cache service
class CacheService {
    constructor() {
        this.cache = new Map();
    }

    async get(key) {
        return this.cache.get(key);
    }

    async set(key, value) {
        this.cache.set(key, value);
    }

    async del(key) {
        this.cache.delete(key);
    }
}

module.exports = new CacheService();
