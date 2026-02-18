// cors-bypass.js - CORS সমস্যার সম্পূর্ণ সমাধান
const CORSBypass = {
    // মাল্টিপল CORS প্রক্সি সার্ভার (ফ্রি)
    proxyServers: [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://cors-proxy.fringe.zone/',
        'https://thingproxy.freeboard.io/fetch/',
        'https://cors.bridged.cc/',
        'https://proxy.cors.sh/',
        'https://cors-proxy4.p.rapidapi.com/?url='
    ],
    
    // গুগল API এন্ডপয়েন্ট
    googleEndpoints: {
        checkUsername: 'https://accounts.google.com/_/signup/usernameavailability',
        createAccount: 'https://accounts.google.com/_/signup/webcreateaccount'
    },
    
    // ফেচ করার প্রধান ফাংশন
    async fetchWithBypass(url, options = {}) {
        // প্রথমে সরাসরি চেষ্টা
        try {
            const response = await fetch(url, {
                ...options,
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                console.log('✅ Direct fetch successful');
                return response;
            }
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
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json, text/plain, */*',
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
        
        throw new Error('All CORS bypass methods failed');
    },
    
    // ইউজারনেম চেক
    async checkUsername(username) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('_reqid', Math.floor(Math.random() * 1000000).toString());
        
        const options = {
            method: 'POST',
            body: formData
        };
        
        try {
            const response = await this.fetchWithBypass(this.googleEndpoints.checkUsername, options);
            const text = await response.text();
            
            // গুগলের রেসপন্স পার্স
            if (text.includes('VALID') || text.includes('valid')) {
                return true;
            }
            
            // JSON রেসপন্স পার্স করার চেষ্টা
            try {
                const jsonData = JSON.parse(text);
                if (Array.isArray(jsonData) && jsonData[0] && jsonData[0][0] && jsonData[0][0][0] === 'VALID') {
                    return true;
                }
            } catch (e) {}
            
            return false;
        } catch (error) {
            console.log('Username check error:', error);
            return true; // অনিশ্চিত হলে ট্রাই করো
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
            body: data
        };
        
        try {
            const response = await this.fetchWithBypass(this.googleEndpoints.createAccount, options);
            const text = await response.text();
            
            // সাফল্য চেক
            if (text.includes('accountId') || 
                text.includes('success') || 
                text.includes('redirect') ||
                text.includes('account_id')) {
                return {
                    success: true,
                    response: text
                };
            }
            
            // ক্যাপচা চেক
            if (text.includes('captcha') || text.includes('CAPTCHA')) {
                return {
                    success: false,
                    error: 'CAPTCHA verification required'
                };
            }
            
            // ফোন ভেরিফিকেশন চেক
            if (text.includes('phone') && text.includes('verification')) {
                return {
                    success: false,
                    error: 'Phone verification required'
                };
            }
            
            return {
                success: false,
                error: 'Account creation failed'
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
