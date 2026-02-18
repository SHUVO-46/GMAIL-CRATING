// gmail-engine.js - রিয়েল জিমেইল ক্রিয়েশন ইঞ্জিন
class GmailEngine {
    constructor() {
        this.proxies = [];
        this.devices = [];
        this.userAgents = [];
        this.stats = {
            total: 0,
            success: 0,
            failed: 0
        };
        this.currentProxy = null;
        this.currentFingerprint = null;
    }
    
    async init() {
        // প্রক্সি লোড
        this.proxies = await ProxyList.getProxies();
        
        // ডিভাইস লোড
        this.devices = FingerprintGenerator.getDevices();
        
        // ইউজার এজেন্ট লোড
        this.userAgents = UserAgentGenerator.getUserAgents();
        
        return this;
    }
    
    async getRandomProxy() {
        if (this.proxies.length === 0) {
            this.proxies = await ProxyList.getProxies();
        }
        this.currentProxy = this.proxies[Math.floor(Math.random() * this.proxies.length)];
        return this.currentProxy;
    }
    
    generateFingerprint() {
        this.currentFingerprint = FingerprintGenerator.generate();
        return this.currentFingerprint;
    }
    
    async checkUsername(username, fingerprint) {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            
            const response = await fetch('https://accounts.google.com/_/signup/usernameavailability', {
                method: 'POST',
                headers: {
                    'User-Agent': this.userAgents[Math.floor(Math.random() * this.userAgents.length)],
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Origin': 'https://accounts.google.com',
                    'Referer': 'https://accounts.google.com/signup'
                },
                body: formData,
                mode: 'cors',
                credentials: 'include'
            });
            
            const text = await response.text();
            return text.includes('VALID') || text.includes('valid') || text.includes('true');
        } catch (error) {
            console.log('Username check error:', error);
            return true; // অনিশ্চিত হলে ট্রাই করবো
        }
    }
    
    async createGmail(firstName, lastName, username, password, birthYear) {
        this.stats.total++;
        
        try {
            // স্টেপ 1: প্রক্সি সিলেক্ট
            const proxy = await this.getRandomProxy();
            
            // স্টেপ 2: ফিঙ্গারপ্রিন্ট জেনারেট
            const fingerprint = this.generateFingerprint();
            
            // স্টেপ 3: ইউজার এজেন্ট সিলেক্ট
            const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
            
            // স্টেপ 4: ইউজারনেম চেক
            let finalUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
            let available = await this.checkUsername(finalUsername, fingerprint);
            
            if (!available) {
                finalUsername = finalUsername + Math.floor(100 + Math.random() * 900);
                available = await this.checkUsername(finalUsername, fingerprint);
                if (!available) {
                    throw new Error('Username not available');
                }
            }
            
            // স্টেপ 5: সাইনআপ ডাটা প্রস্তুত
            const month = Math.floor(1 + Math.random() * 12);
            const day = Math.floor(1 + Math.random() * 28);
            const gender = Math.floor(1 + Math.random() * 3);
            
            const signupData = {
                firstName: firstName,
                lastName: lastName,
                username: finalUsername,
                password: password,
                confirmPassword: password,
                month: month.toString(),
                day: day.toString(),
                year: birthYear,
                gender: gender.toString(),
                recoveryEmail: '',
                phoneCountryCode: 'US',
                phoneNumber: '',
                skipPhoneVerification: 'true'
            };
            
            // স্টেপ 6: একাউন্ট ক্রিয়েট
            const formData = new URLSearchParams();
            for (let key in signupData) {
                formData.append(key, signupData[key]);
            }
            
            const response = await fetch('https://accounts.google.com/_/signup/webcreateaccount', {
                method: 'POST',
                headers: {
                    'User-Agent': userAgent,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Origin': 'https://accounts.google.com',
                    'Referer': 'https://accounts.google.com/signup',
                    'X-Same-Domain': '1',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData,
                mode: 'cors',
                credentials: 'include'
            });
            
            const responseText = await response.text();
            
            if (responseText.includes('accountId') || 
                responseText.includes('success') || 
                responseText.includes('redirect')) {
                
                this.stats.success++;
                
                return {
                    success: true,
                    email: `${finalUsername}@gmail.com`,
                    password: password,
                    device: fingerprint.device,
                    proxy: proxy,
                    fingerprint: fingerprint.id
                };
            } else {
                throw new Error('Account creation failed');
            }
            
        } catch (error) {
            this.stats.failed++;
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    getSuccessRate() {
        if (this.stats.total === 0) return '0%';
        return ((this.stats.success / this.stats.total) * 100).toFixed(1) + '%';
    }
}

window.GmailEngine = GmailEngine;
