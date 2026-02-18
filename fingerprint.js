// fingerprint.js - ডিভাইস ফিঙ্গারপ্রিন্ট
const FingerprintGenerator = {
    devices: [
        { brand: 'samsung', model: 'SM-S918B', name: 'Galaxy S23 Ultra', android: '14' },
        { brand: 'samsung', model: 'SM-S911B', name: 'Galaxy S23', android: '14' },
        { brand: 'google', model: 'Pixel 8 Pro', name: 'Pixel 8 Pro', android: '14' },
        { brand: 'google', model: 'Pixel 8', name: 'Pixel 8', android: '14' },
        { brand: 'xiaomi', model: '23127PN0CC', name: 'Xiaomi 14 Ultra', android: '14' },
        { brand: 'oneplus', model: 'CPH2581', name: 'OnePlus 12', android: '14' }
    ],
    
    getDevices() {
        return this.devices;
    },
    
    generate() {
        const device = this.devices[Math.floor(Math.random() * this.devices.length)];
        
        const androidId = 'AP' + Math.random().toString(36).substring(2, 15);
        
        let imei = '';
        for (let i = 0; i < 15; i++) {
            imei += Math.floor(Math.random() * 10);
        }
        
        let mac = [];
        for (let i = 0; i < 6; i++) {
            mac.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
        }
        
        return {
            id: androidId.substring(0, 8),
            device: device.name,
            androidVersion: device.android,
            androidId: androidId,
            imei: imei,
            mac: mac.join(':')
        };
    }
};

window.FingerprintGenerator = FingerprintGenerator;
