// cors-bypass.js - CORS সমস্যার সম্পূর্ণ সমাধান
const CORSBypass = {
    // মাল্টিপল CORS প্রক্সি (ফ্রি)
    proxyServers: [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://cors-proxy.fringe.zone/',
        'https://cors.bridged.cc/',
        'https://thingproxy.freeboard.io/fetch/',
        'https://cors.eu.org/',
        'https://cors.api-tools.workers.dev/?url=',
        'https://proxy.cors.sh/',
        'https://cors.5sos.us.kg/',
        'https://cors-proxy4.p.rapidapi.com/?url='
    ],
    
    // গুগল API এন্ডপয়েন্ট
    googleEndpoints: {
        checkUsername: 'https://accounts.google.com/_/signup/usernameavailability',
        createAccount: 'https://accounts.google.com/_/signup/webcreateaccount'
    },
    
    // JSONP কলব্যাক ইনডেক্স
    jsonpCallbackIndex: 0,
    
    // CORS বাইপাস সহ ফেচ
    async fetchWithBypass(url, options = {}) {
        // প্রথমে সরাসরি চেষ্টা
        try {
            const response = await fetch(url, {
                ...options,
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    ...options.headers,
                    'Origin': window.location.origin
                }
            });
            if (response.ok) return response;
        } catch (e) {
            console.log('Direct fetch failed, trying proxies...');
        }
        
        // CORS প্রক্সি দিয়ে চেষ্টা
        for (let proxy of this.proxyServers) {
            try {
                const proxyUrl = proxy + encodeURIComponent(url);
                const response = await fetch(proxyUrl, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'X-Requested-With': 'XMLHttpRequest',
                        'Origin': window.location.origin
                    }
                });
                
                if (response.ok) {
                    console.log(`✅ Proxy working: ${proxy}`);
                    return response;
                }
            } catch (e) {
                console.log(`❌ Proxy failed: ${proxy}`);
                continue;
            }
        }
        
        // JSONP ফ্যালব্যাক
        return this.jsonpFetch(url, options);
    },
    
    // JSONP পদ্ধতি
    jsonpFetch(url, options) {
        return new Promise((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + (this.jsonpCallbackIndex++);
            const script = document.createElement('script');
            
            const separator = url.includes('?') ? '&' : '?';
            const jsonpUrl = url + separator + 'callback=' + callbackName;
            
            window[callbackName] = function(data) {
                delete window[callbackName];
                document.body.removeChild(script);
                
                const fakeResponse = {
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(data),
                    text: () => Promise.resolve(JSON.stringify(data))
                };
                resolve(fakeResponse);
            };
            
            script.src = jsonpUrl;
            script.onerror = () => {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('JSONP failed'));
            };
            
            document.body.appendChild(script);
        });
    },
    
    // ইউজারনেম চেক
    async checkUsername(username) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('_reqid', Math.floor(Math.random() * 1000000).toString());
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: formData
        };
        
        try {
            const response = await this.fetchWithBypass(this.googleEndpoints.checkUsername, options);
            const text = await response.text();
            return text.includes('VALID') || text.includes('valid') || text.includes('true');
        } catch (error) {
            console.log('Username check error:', error);
            return true;
        }
    },
    
    // একাউন্ট তৈরি
    async createAccount(formData) {
        const data = new URLSearchParams();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        data.append('_reqid', Math.floor(Math.random() * 1000000).toString());
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: data
        };
        
        try {
            const response = await this.fetchWithBypass(this.googleEndpoints.createAccount, options);
            const text = await response.text();
            return {
                success: text.includes('accountId') || text.includes('success') || text.includes('redirect'),
                response: text
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

window.CORSBypass = CORSBypass;
