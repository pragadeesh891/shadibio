const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log('Reloading chatbot route to pick up new API key...');

// Raasi and Nakshatra Knowledge Base for fallback
const knowledgeBase = {
  raasi: [
    "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Karkat (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)",
    "Dhanus (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
  ],
  matching_rules: "In traditional Tamil/Hindu astrology, compatibility is often based on 10 poruthams (matches) between the boy's and girl's raasi and nakshatra.",
  website_info: "ShadiBio helps you create professional biodatas for marriage. You can fill in your personal, family, and horoscope details."
};

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are a professional Vedic Astrologer and AI assistant for ShadiBio, a marriage biodata platform. 
        
        Your character:
        - You are wise, respectful, and expert in Porutham (horoscope matching).
        - You speak multiple languages fluently: English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and Malayalam (മലയാളം).
        - Respond in the same language the user uses.
        
        Your Goals:
        1. Answer questions about ShadiBio (biodata creation, templates, registration).
        2. Provide expert guidance on Raasi and Nakshatra (Star) comparisons for marriage.
        3. Explain the importance of the 10 Poruthams (matches) in traditional matching.
        
        Website Info: ${knowledgeBase.website_info}
        
        User Question: ${message}
        
        Response Guidelines:
        - Keep answers helpful and concise.
        - If matching looks difficult, suggest consulting a senior astrologer with full birth charts.
        - Always wish the user "Vanakkam" or "Namaste" based on the language.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      return res.json({ success: true, response: responseText });
    } else {
      // Fallback response logic
      let response = "I am the ShadiBio assistant. ";
      const msg = message.toLowerCase();

      if (msg.includes('raasi') || msg.includes('rashi') || msg.includes('nakshatra') || msg.includes('star')) {
        response += "Raasi and Nakshatra are important for horoscope matching. On ShadiBio, you can add these details in the Horoscope section. For specific compatibility matching, it's best to consult a professional astrologer or use a Porutham matching tool.";
      } else if (msg.includes('how to') || msg.includes('website') || msg.includes('biodata')) {
        response += "You can create your biodata by registering and filling out the forms on your dashboard. We offer various templates like Traditional and Modern.";
      } else {
        response += "I'm here to help with your ShadiBio queries and Raasi/Nakshatra doubts. What would you like to know?";
      }

      return res.json({ success: true, response });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, message: 'Failed to get response from AI', detail: error.message });
  }
});

module.exports = router;
