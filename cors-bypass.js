// cors-bypass.js - CORS বাইপাস ইউটিলিটি
const CORSBypass = {
    isEnabled: false,
    
    check() {
        return new Promise((resolve) => {
            fetch('https://accounts.google.com', {
                mode: 'no-cors',
                method: 'HEAD'
            }).then(() => {
                this.isEnabled = true;
                resolve(true);
            }).catch(() => {
                this.isEnabled = false;
                resolve(false);
            });
        });
    },
    
    getProxyUrl(url) {
        // CORS proxy services
        const proxies = [
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://cors-proxy.fringe.zone/${url}`
        ];
        
        return proxies[Math.floor(Math.random() * proxies.length)];
    },
    
    async fetchWithBypass(url, options = {}) {
        if (!this.isEnabled) {
            await this.check();
        }
        
        if (!this.isEnabled) {
            // CORS proxy ব্যবহার করো
            const proxyUrl = this.getProxyUrl(url);
            return fetch(proxyUrl, options);
        } else {
            return fetch(url, options);
        }
    }
};

window.CORSBypass = CORSBypass;
