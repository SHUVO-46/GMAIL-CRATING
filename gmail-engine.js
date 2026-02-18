// gmail-engine.js - মেইন ইঞ্জিন
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
    
    async createGmail(firstName, lastName, username, password, birthYear) {
        this.stats.total++;
        
        try {
            // ইউজারনেম প্রস্তুত
            let finalUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            // ইউজারনেম চেক
            let available = await this.checkUsername(finalUsername);
            
            if (!available) {
                finalUsername = finalUsername + Math.floor(100 + Math.random() * 900);
                available = await this.checkUsername(finalUsername);
                if (!available) {
                    throw new Error('Username not available');
                }
            }
            
            // র‍্যান্ডম ডাটা
            const month = Math.floor(1 + Math.random() * 12);
            const day = Math.floor(1 + Math.random() * 28);
            const gender = Math.floor(1 + Math.random() * 3);
            
            // ফর্ম ডাটা প্রস্তুত
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
            
            // একাউন্ট তৈরি
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
