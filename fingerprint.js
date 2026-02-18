// fingerprint.js - ১০০০+ ডিভাইস ফিঙ্গারপ্রিন্ট
const FingerprintGenerator = {
    devices: [
        // Samsung
        { brand: 'samsung', model: 'SM-S918B', name: 'Galaxy S23 Ultra', android: '14' },
        { brand: 'samsung', model: 'SM-S911B', name: 'Galaxy S23', android: '14' },
        { brand: 'samsung', model: 'SM-F946B', name: 'Galaxy Z Fold 5', android: '14' },
        { brand: 'samsung', model: 'SM-F731B', name: 'Galaxy Z Flip 5', android: '14' },
        { brand: 'samsung', model: 'SM-A546E', name: 'Galaxy A54', android: '14' },
        { brand: 'samsung', model: 'SM-A346E', name: 'Galaxy A34', android: '13' },
        { brand: 'samsung', model: 'SM-S928B', name: 'Galaxy S24 Ultra', android: '14' },
        
        // Google
        { brand: 'google', model: 'Pixel 8 Pro', name: 'Pixel 8 Pro', android: '14' },
        { brand: 'google', model: 'Pixel 8', name: 'Pixel 8', android: '14' },
        { brand: 'google', model: 'Pixel 7 Pro', name: 'Pixel 7 Pro', android: '14' },
        { brand: 'google', model: 'Pixel Fold', name: 'Pixel Fold', android: '14' },
        
        // Xiaomi
        { brand: 'xiaomi', model: '23127PN0CC', name: 'Xiaomi 14 Ultra', android: '14' },
        { brand: 'xiaomi', model: '2312DRA50C', name: 'Redmi Note 13 Pro+', android: '14' },
        { brand: 'xiaomi', model: '23076RA4BR', name: 'POCO F5 Pro', android: '13' },
        
        // OnePlus
        { brand: 'oneplus', model: 'CPH2581', name: 'OnePlus 12', android: '14' },
        { brand: 'oneplus', model: 'CPH2487', name: 'OnePlus 12R', android: '14' },
        { brand: 'oneplus', model: 'CPH2449', name: 'OnePlus 11', android: '14' },
        
        // Oppo
        { brand: 'oppo', model: 'CPH2493', name: 'Find X7 Ultra', android: '14' },
        { brand: 'oppo', model: 'CPH2557', name: 'Reno 11 Pro', android: '14' },
        
        // Vivo
        { brand: 'vivo', model: 'V2324A', name: 'X100 Pro', android: '14' },
        { brand: 'vivo', model: 'V2309A', name: 'X100', android: '14' },
        
        // Realme
        { brand: 'realme', model: 'RMX3840', name: 'GT 5 Pro', android: '14' },
        { brand: 'realme', model: 'RMX3740', name: '11 Pro+', android: '13' }
    ],
    
    timezones: [
        'Asia/Dhaka', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo',
        'America/New_York', 'Europe/London', 'Australia/Sydney',
        'Europe/Paris', 'Asia/Dubai', 'Africa/Cairo'
    ],
    
    languages: ['en-US', 'en-GB', 'en-IN', 'bn-BD', 'hi-IN'],
    
    resolutions: [
        '1080x2400', '1440x3088', '1080x2340', '1440x3040',
        '1080x1920', '720x1600', '1080x2520'
    ],
    
    generate() {
        const device = this.devices[Math.floor(Math.random() * this.devices.length)];
        
        // Android ID
        const androidId = 'AP' + Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
        
        // IMEI
        let imei = '';
        for (let i = 0; i < 15; i++) {
            imei += Math.floor(Math.random() * 10);
        }
        
        // MAC Address
        let mac = [];
        for (let i = 0; i < 6; i++) {
            mac.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
        }
        mac = mac.join(':');
        
        // GAID
        const gaid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        
        return {
            id: androidId.substring(0, 8),
            device: device.name,
            androidVersion: device.android,
            androidId: androidId,
            imei: imei,
            mac: mac,
            gaid: gaid,
            timezone: this.timezones[Math.floor(Math.random() * this.timezones.length)],
            language: this.languages[Math.floor(Math.random() * this.languages.length)],
            resolution: this.resolutions[Math.floor(Math.random() * this.resolutions.length)],
            density: (Math.floor(Math.random() * 20) + 20) / 10, // 2.0 to 4.0
            simOperator: ['310260', '310410', '310150'][Math.floor(Math.random() * 3)]
        };
    },
    
    getDevices() {
        return this.devices;
    }
};

window.FingerprintGenerator = FingerprintGenerator;
