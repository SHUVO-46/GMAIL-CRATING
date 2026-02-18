// gmail-engine.js - CORS ফিক্স সহ আপডেটেড ভার্সন
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
        this.bypass = window.CORSBypass;
    }
    
    async init() {
        try {
            // প্রক্সি লোড
            this.proxies = await ProxyList.getProxies();
            
            // ডিভাইস লোড
            this.devices = FingerprintGenerator.getDevices();
            
            // ইউজার এজেন্ট লোড
            this.userAgents = UserAgentGenerator.getUserAgents();
            
            // CORS বাইপাস চেক
            console.log('✅ CORS Bypass ready');
            
            return this;
        } catch (error) {
            console.error('Init error:', error);
            return this;
        }
    }
    
    async checkUsername(username) {
        return await this.bypass.checkUsername(username);
    }
    
    async createGmail(firstName, lastName, username, password, birthYear) {
        this.stats.total++;
        
        try {
            // ইউজারনেম চেক
            let finalUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
            let available = await this.checkUsername(finalUsername);
            
            if (!available) {
                finalUsername = finalUsername + Math.floor(100 + Math.random() * 900);
                available = await this.checkUsername(finalUsername);
            }
            
            // সাইনআপ ডাটা প্রস্তুত
            const month = Math.floor(1 + Math.random() * 12);
            const day = Math.floor(1 + Math.random() * 28);
            const gender = Math.floor(1 + Math.random() * 3);
            
            const formData = {
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
            
            // একাউন্ট ক্রিয়েট
            const result = await this.bypass.createAccount(formData);
            
            if (result.success) {
                this.stats.success++;
                return {
                    success: true,
                    email: `${finalUsername}@gmail.com`,
                    password: password,
                    device: 'Generic Device'
                };
            } else {
                throw new Error(result.error || 'Creation failed');
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
