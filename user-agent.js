// user-agent.js - ১০০০০+ ইউজার এজেন্ট
const UserAgentGenerator = {
    generate() {
        const androidVersions = ['14', '13', '12', '11', '10'];
        const chromeVersions = [
            '120.0.6099.210', '119.0.6045.163', '118.0.5993.112',
            '117.0.5938.140', '116.0.5845.163', '115.0.5790.168',
            '114.0.5735.196', '113.0.5672.163', '112.0.5615.136'
        ];
        
        const models = [
            'SM-S918B', 'SM-S911B', 'SM-F946B', 'Pixel 8 Pro', 'Pixel 8',
            '23127PN0CC', '2312DRA50C', 'CPH2581', 'CPH2487', 'V2324A',
            'RMX3840', 'XT2363-4', 'SM-A546E', 'Pixel 7 Pro', 'CPH2449'
        ];
        
        const android = androidVersions[Math.floor(Math.random() * androidVersions.length)];
        const model = models[Math.floor(Math.random() * models.length)];
        const chrome = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
        
        return `Mozilla/5.0 (Linux; Android ${android}; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chrome} Mobile Safari/537.36`;
    },
    
    generateBatch(count = 10000) {
        const uas = [];
        for (let i = 0; i < count; i++) {
            uas.push(this.generate());
        }
        return uas;
    },
    
    getUserAgents() {
        return this.generateBatch(10000);
    }
};

window.UserAgentGenerator = UserAgentGenerator;
