// gmail-engine.js - মেইন ইঞ্জিন
class GmailEngine {
    constructor() {
        this.proxies = [];
        this.devices = [];
        this.userAgents = [];
        this.stats = {
            total: 0,
            success: 0,
            failed: 0,
            captcha: 0,
            phoneRequired: 0
        };
        this.bypass = window.CORSBypass;
    }
    
    async init() {
        try {
            // প্রক্সি লোড
            if (window.ProxyList) {
                this.proxies = await ProxyList.getProxies();
            }
            
            // ডিভাইস লোড
            if (window.FingerprintGenerator) {
                this.devices = FingerprintGenerator.getDevices();
            }
            
            // ইউজার এজেন্ট লোড
            if (window.UserAgentGenerator) {
                this.userAgents = UserAgentGenerator.getUserAgents();
            }
            
            console.log('✅ Engine initialized');
            return this;
        } catch (error) {
            console.error('Init error:', error);
            return this;
        }
    }
    
    async checkUsername(username) {
        if (!this.bypass) return true;
        return await this.bypass.checkUsername(username);
    }
    
    generateBirthData() {
        const month = Math.floor(1 + Math.random() * 12);
        const day = Math.floor(1 + Math.random() * 28);
        const year = Math.floor(1980 + Math.random() * 25);
        const gender = Math.floor(1 + Math.random() * 3);
        
        return { month, day, year, gender };
    }
    
    async createGmail(firstName, lastName, username, password) {
        this.stats.total++;
        
        try {
            // ইউজারনেম ক্লিন
            let finalUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (finalUsername.length < 3) {
                finalUsername = 'user' + finalUsername;
            }
            
            // ইউজারনেম চেক
            let available = await this.checkUsername(finalUsername);
            let attempts = 0;
            
            while (!available && attempts < 5) {
                finalUsername = finalUsername + Math.floor(10 + Math.random() * 90);
                available = await this.checkUsername(finalUsername);
                attempts++;
            }
            
            if (!available) {
                this.stats.failed++;
                return {
                    success: false,
                    error: 'Username not available after multiple attempts'
                };
            }
            
            // জন্ম তারিখ জেনারেট
            const birth = this.generateBirthData();
            
            // ফর্ম ডাটা প্রস্তুত
            const formData = {
                firstName: firstName,
                lastName: lastName,
                username: finalUsername,
                password: password,
                confirmPassword: password,
                month: birth.month.toString(),
                day: birth.day.toString(),
                year: birth.year.toString(),
                gender: birth.gender.toString(),
                recoveryEmail: '',
                phoneCountryCode: 'US',
                phoneNumber: '',
                skipPhoneVerification: 'true'
            };
            
            // একাউন্ট তৈরি
            const result = await this.bypass.createAccount(formData);
            
            if (result.success) {
                this.stats.success++;
                return {
                    success: true,
                    email: `${finalUsername}@gmail.com`,
                    password: password
                };
            } else {
                if (result.error.includes('CAPTCHA')) {
                    this.stats.captcha++;
                } else if (result.error.includes('Phone')) {
                    this.stats.phoneRequired++;
                }
                
                this.stats.failed++;
                return {
                    success: false,
                    error: result.error
                };
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
    
    getStats() {
        return {
            ...this.stats,
            successRate: this.getSuccessRate()
        };
    }
}

window.GmailEngine = GmailEngine;
