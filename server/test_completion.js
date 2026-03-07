const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: 'c:/Users/jeeva/Downloads/spot-track-pay/OneDrive/no no/shadibio/.env' });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key:', apiKey ? 'Found' : 'Missing');
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listResponse.json();
        const modelNames = listData.models ? listData.models.map(m => m.name) : [];
        console.log('Available Models:', modelNames);

        if (modelNames.length > 0) {
            // Try the first one that is supported (not natural language audio etc)
            const myModelName = modelNames.find(n => n.includes('flash')) || modelNames[0];
            console.log('Testing model:', myModelName);
            const model = genAI.getGenerativeModel({ model: myModelName.replace('models/', '') });
            const result = await model.generateContent("Say hi");
            console.log('Result:', result.response.text());
        }
    } catch (err) {
        console.error('Error during test:', err);
    }
}

test();
