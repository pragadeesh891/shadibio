const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: 'c:/Users/jeeva/Downloads/spot-track-pay/OneDrive/no no/shadibio/.env' });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key:', apiKey ? 'Found' : 'Missing');
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const listModels = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await listModels.json();
        console.log('Available Models:', data.models ? data.models.map(m => m.name) : 'No models found');
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}

test();
