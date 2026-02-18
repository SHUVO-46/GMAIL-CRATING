// proxy-list.js - ১০০০০+ ফ্রি প্রক্সি
const ProxyList = {
    sources: [
        'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
        'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
        'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS.txt',
        'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list.txt',
        'https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt',
        'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
        'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
        'https://raw.githubusercontent.com/elliottophellia/yakumo/master/results/http.txt',
        'https://raw.githubusercontent.com/Anonym0usWork-1221/Free-Proxies/main/proxy_files/http_proxies.txt',
        'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt',
        'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies.txt',
        'https://raw.githubusercontent.com/themiralay/Proxy-List-World/main/http.txt',
        'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all',
        'https://www.proxy-list.download/api/v1/get?type=http',
        'https://www.proxyscan.io/download?type=http',
        'https://openproxy.space/list/http',
        'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
        'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
        'https://raw.githubusercontent.com/MuRong11/Proxy-Scanner/master/proxy_list/http.txt',
        'https://raw.githubusercontent.com/UserR3X/proxy-list/main/http.txt',
        'https://raw.githubusercontent.com/enseitankado/proxy-list/master/http.txt',
        'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
        'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt'
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
            console.log('Error fetching from', url);
            return [];
        }
    },
    
    async getProxies() {
        if (this.cache.length > 0) return this.cache;
        
        const allProxies = [];
        const promises = [];
        
        for (let i = 0; i < Math.min(10, this.sources.length); i++) {
            promises.push(this.fetchFromSource(this.sources[i]));
        }
        
        const results = await Promise.all(promises);
        for (let proxies of results) {
            allProxies.push(...proxies);
        }
        
        // ডুপ্লিকেট রিমুভ
        this.cache = [...new Set(allProxies)];
        
        console.log(`✅ Loaded ${this.cache.length} unique proxies`);
        return this.cache;
    }
};

window.ProxyList = ProxyList;
