// Quick test to verify Xendit API keys
require('dotenv').config();
const axios = require('axios');

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

async function testXenditKeys() {
    console.log('🔑 Testing Xendit API Keys...');
    console.log('Secret Key:', XENDIT_SECRET_KEY ? XENDIT_SECRET_KEY.substring(0, 20) + '...' : 'NOT SET');
    
    try {
        const response = await axios.get('https://api.xendit.co/balance', {
            headers: {
                'Authorization': `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`
            }
        });
        
        console.log('✅ API Keys are VALID!');
        console.log('Balance:', response.data);
        process.exit(0);
    } catch (error) {
        console.log('❌ API Keys are INVALID or there\'s an error');
        console.log('Error:', error.response?.data || error.message);
        console.log('\n📝 What to do:');
        console.log('1. Go to: https://dashboard.xendit.co/register');
        console.log('2. Sign up for a FREE account');
        console.log('3. Go to: Settings → Developers → API Keys');
        console.log('4. Copy your TEST keys');
        console.log('5. Update IAS/backend/.env file');
        console.log('6. Restart backend: npm run dev');
        process.exit(1);
    }
}

testXenditKeys();
