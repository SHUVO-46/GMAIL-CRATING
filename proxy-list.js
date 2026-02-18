// proxy-list.js - প্রক্সি কালেক্টর
const ProxyList = {
    sources: [
        'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
        'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
        'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS.txt',
        'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all'
    ],
    
    cache: [],
    
    async fetchFromSource(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const text = await response.text();
            const lines = text.split('\n');
            const proxies = [];
            
            for (let line of lines) {
                const match = line.match(/\b(?:\d{1,3}\.){3}\d{1,3}:\d{2,5}\b/);
                if (match) {
                    proxies.push(match[0]);
                }
            }
            
            return proxies;
        } catch (error) {
            return [];
        }
    },
    
    async getProxies() {
        if (this.cache.length > 0) return this.cache;
        
        const allProxies = [];
        
        for (let source of this.sources) {
            const proxies = await this.fetchFromSource(source);
            allProxies.push(...proxies);
        }
        
        this.cache = [...new Set(allProxies)];
        return this.cache;
    }
};

window.ProxyList = ProxyList;
