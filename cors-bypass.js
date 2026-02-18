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
        'https://cors-proxy4.p.rapidapi.com/?url=',
        'https://proxy.cors.sh/',
        'https://cors.5sos.us.kg/'
    ],
    
    // গুগল API এন্ডপয়েন্ট
    googleEndpoints: {
        signup: 'https://accounts.google.com/signup/v2/webcreateaccount',
        checkUsername: 'https://accounts.google.com/_/signup/usernameavailability',
        createAccount: 'https://accounts.google.com/_/signup/webcreateaccount'
    },
    
    // JSONP ফলের জন্য (আরেকটি পদ্ধতি)
    jsonpCallbackIndex: 0,
    
    // প্রধান ফেচ ফাংশন (CORS বাইপাস সহ)
    async fetchWithBypass(url, options = {}) {
        // প্রথমে সরাসরি চেষ্টা করো
        try {
            const response = await fetch(url, {
                ...options,
                mode: 'cors',
                credentials: 'omit'
            });
            if (response.ok) return response;
        } catch (e) {
            console.log('Direct fetch failed, trying proxy...');
        }
        
        // CORS প্রক্সি দিয়ে চেষ্টা করো
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
        
        // শেষ চেষ্টা হিসেবে JSONP ব্যবহার করো
        return this.jsonpFetch(url, options);
    },
    
    // JSONP পদ্ধতি (সবচেয়ে পুরনো কিন্তু কাজ করে)
    jsonpFetch(url, options) {
        return new Promise((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + (this.jsonpCallbackIndex++);
            const script = document.createElement('script');
            
            // URL এ callback যোগ করো
            const separator = url.includes('?') ? '&' : '?';
            const jsonpUrl = url + separator + 'callback=' + callbackName;
            
            // গ্লোবাল কলব্যাক ফাংশন
            window[callbackName] = function(data) {
                delete window[callbackName];
                document.body.removeChild(script);
                
                // ফেক রেসপন্স বানাও
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
    
    // গুগল ইউজারনেম চেক (CORS বাইপাস সহ)
    async checkUsername(username) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: formData
        };
        
        try {
            const response = await this.fetchWithBypass(
                this.googleEndpoints.checkUsername,
                options
            );
            const text = await response.text();
            return text.includes('VALID') || text.includes('true');
        } catch (error) {
            console.log('Username check error:', error);
            return true; // অনিশ্চিত হলে ট্রাই করো
        }
    },
    
    // গুগল একাউন্ট ক্রিয়েট (CORS বাইপাস সহ)
    async createAccount(formData) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams(formData)
        };
        
        try {
            const response = await this.fetchWithBypass(
                this.googleEndpoints.createAccount,
                options
            );
            const text = await response.text();
            return {
                success: text.includes('accountId') || text.includes('success'),
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
