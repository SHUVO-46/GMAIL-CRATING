// user-agent.js - ইউজার এজেন্ট জেনারেটর
const UserAgentGenerator = {
    generate() {
        const androidVersions = ['14', '13', '12', '11'];
        const chromeVersions = [
            '120.0.6099.210', '119.0.6045.163', '118.0.5993.112',
            '117.0.5938.140', '116.0.5845.163'
        ];
        
        const models = [
            'SM-S918B', 'Pixel 8 Pro', '23127PN0CC', 'CPH2581',
            'Pixel 7 Pro', 'SM-S911B', 'CPH2449'
        ];
        
        const android = androidVersions[Math.floor(Math.random() * androidVersions.length)];
        const model = models[Math.floor(Math.random() * models.length)];
        const chrome = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
        
        return `Mozilla/5.0 (Linux; Android ${android}; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chrome} Mobile Safari/537.36`;
    },
    
    getUserAgents(count = 10000) {
        const uas = [];
        for (let i = 0; i < count; i++) {
            uas.push(this.generate());
        }
        return uas;
    }
};

window.UserAgentGenerator = UserAgentGenerator;
