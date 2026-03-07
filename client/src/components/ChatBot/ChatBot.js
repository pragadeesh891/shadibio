import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/api';
import { RiRobot2Line, RiSendPlane2Fill, RiCloseLine, RiMessage3Line, RiMicLine, RiMicFill } from 'react-icons/ri';
import { useLanguage } from '../../contexts/LanguageContext';
import './ChatBot.css';

const getVoiceLangCode = (appLang) => {
    const langMap = {
        'en': 'en-IN', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
        'kn': 'kn-IN', 'ml': 'ml-IN', 'mr': 'mr-IN', 'gu': 'gu-IN',
        'bn': 'bn-IN', 'pa': 'pa-IN', 'ur': 'ur-PK', 'ne': 'ne-NP'
    };
    return langMap[appLang] || 'en-IN';
};

const ChatBot = () => {
    const { language } = useLanguage();
    const voiceLangCode = getVoiceLangCode(language);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'bot', content: 'Vaṇakkam! Namaste! 🙏 I am your ShadiBio Astrologer. I can help you in English, தமிழ், हिन्दी, తెలుగు, ಕನ್ನಡ, or മലയാളം. How can I assist you with Raasi, Nakshatra, or your Biodata today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isLoading]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            // Let the bot listen in the currently selected language
            recognitionRef.current.lang = 'en-IN'; // Initial setup, later updated in effect

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessage(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = voiceLangCode;
        }
    }, [voiceLangCode]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Your browser does not support speech recognition. Please try Chrome or Edge.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await chatbotService.sendMessage(message);
            if (response.success) {
                const botReply = response.response;
                setChatHistory(prev => [...prev, { role: 'bot', content: botReply }]);

                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(botReply);
                    utterance.lang = voiceLangCode;
                    window.speechSynthesis.speak(utterance);
                }
            } else {
                setChatHistory(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong. Please check your internet connection.";
            setChatHistory(prev => [...prev, { role: 'bot', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle neon-purple animate-float ${isOpen ? 'open' : ''}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (isOpen && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                    }
                }}
            >
                {isOpen ? <RiCloseLine size={24} /> : <RiMessage3Line size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window glass animate-scale-in">
                    <div className="chatbot-header gradient-text">
                        <RiRobot2Line className="mr-2" size={24} />
                        <span>ShadiBio AI Bot</span>
                    </div>

                    <div className="chatbot-messages">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`message-wrapper ${chat.role}`}>
                                <div className={`message-bubble ${chat.role === 'bot' ? 'glass' : 'user-bubble'}`}>
                                    {chat.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-wrapper bot">
                                <div className="message-bubble glass typing-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Ask or Speak about Raasi/Natchathiram..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <div className="input-actions">
                            <button
                                type="button"
                                className={`voice-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                disabled={isLoading}
                                title="Speak to AI"
                            >
                                {isListening ? <RiMicFill className="animate-pulse" /> : <RiMicLine />}
                            </button>
                            <button type="submit" className="neon-blue" disabled={isLoading || !message.trim()}>
                                <RiSendPlane2Fill />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
