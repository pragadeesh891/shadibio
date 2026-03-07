const axios = require('axios');

async function testChatbot() {
    try {
        const response = await axios.post('http://localhost:5000/api/chatbot', {
            message: 'Hello'
        });
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

testChatbot();
