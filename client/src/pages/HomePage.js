import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

import FloatingHearts from '../components/Effects/FloatingHearts';

const HomePage = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const isAuthenticated = !!localStorage.getItem('token');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
  ];

  const features = [
    { icon: '🎨', title: t('beautifulTemplates'), desc: t('traditionalModern'), color: 'from-pink-500 via-red-500 to-yellow-500' },
    { icon: '⚡', title: t('realTimePreview'), desc: t('liveUpdates'), color: 'from-cyan-500 via-blue-500 to-purple-500' },
    { icon: '📄', title: t('pdfDownload'), desc: t('highQualityPdfs'), color: 'from-green-500 via-teal-500 to-cyan-500' },
    { icon: '🔒', title: t('privacyControls'), desc: t('yourDataControl'), color: 'from-purple-500 via-pink-500 to-red-500' },
    { icon: '🌍', title: t('multiLanguage'), desc: t('languagesSupported'), color: 'from-orange-500 via-amber-500 to-yellow-500' },
    { icon: '✨', title: t('smartFeatures'), desc: t('autoCalcHistory'), color: 'from-indigo-500 via-purple-500 to-pink-500' }
  ];

  const stats = [
    { number: '10K+', label: t('happyUsers') },
    { number: '50K+', label: t('biodatasCreated') },
    { number: '99.9%', label: t('uptime') },
    { number: '4.9★', label: t('userRating') }
  ];

  const pricingPlans = [
    {
      name: t('free'),
      price: '₹0',
      period: t('forever'),
      features: ['3 Biodatas', t('beautifulTemplates'), t('pdfDownload'), 'With Watermark'],
      cta: t('getStarted'),
      popular: false
    },
    {
      name: t('premium'),
      price: '₹299',
      period: t('month'),
      features: ['Unlimited Biodatas', 'All Premium Templates', 'No Watermark', 'Priority Support', 'Version History'],
      cta: t('goPremium'),
      popular: true
    },
    {
      name: t('lifetime'),
      price: '₹999',
      period: t('oneTime'),
      features: ['Everything in Premium', 'Lifetime Access', 'Early Access Features', 'VIP Support'],
      cta: t('getLifetime'),
      popular: false
    }
  ];

  return React.createElement('div', {
    className: 'min-h-screen relative overflow-hidden',
    style: {
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradient-xy 15s ease infinite'
    }
  },
    // Animated Particles
    React.createElement('div', { className: 'absolute inset-0 overflow-hidden pointer-events-none' },
      particles.map(p =>
        React.createElement('div', {
          key: p.id,
          className: 'absolute rounded-full bg-white opacity-20',
          style: {
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`
          }
        })
      )
    ),

    // Floating Hearts Animation
    React.createElement(FloatingHearts),

    // Glassmorphism Navigation
    React.createElement('nav', { className: 'glass sticky top-0 z-50 shadow-xl' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex justify-between items-center h-20' },
          // Logo
          React.createElement('div', { className: 'flex items-center space-x-3 group cursor-pointer' },
            React.createElement('div', {
              className: 'w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 neon-blue'
            }, React.createElement('span', { className: 'text-2xl' }, '💕')),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-3xl font-black gradient-text leading-tight' }, 'ShadiBio'),
              React.createElement('p', { className: 'text-xs text-gray-600 font-medium tracking-wide' }, t('tagline'))
            )
          ),
          // Nav Links
          React.createElement('div', { className: 'hidden md:flex items-center space-x-8' },
            React.createElement('a', { href: '#features', className: 'text-gray-700 hover:text-indigo-600 font-semibold' }, t('features')),
            React.createElement('a', { href: '#pricing', className: 'text-gray-700 hover:text-indigo-600 font-semibold' }, t('pricing'))
          ),
          // Auth Buttons & Language
          React.createElement('div', { className: 'flex items-center space-x-4' },
            // Language Switcher
            React.createElement('div', { className: 'relative' },
              React.createElement('button', {
                onClick: () => setShowLanguageMenu(!showLanguageMenu),
                className: 'px-4 py-2 glass rounded-xl flex items-center space-x-2 hover:bg-white transition-all duration-300'
              },
                React.createElement('span', null, languages.find(l => l.code === language)?.flag || '🌍'),
                React.createElement('span', { className: 'hidden sm:inline font-bold text-gray-700' }, languages.find(l => l.code === language)?.name || 'Language')
              ),
              showLanguageMenu && React.createElement('div', {
                className: 'absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-scale-in border border-gray-100'
              },
                languages.map(lang =>
                  React.createElement('button', {
                    key: lang.code,
                    onClick: () => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    },
                    className: `w-full text-left px-6 py-3 hover:bg-indigo-50 flex items-center space-x-3 transition-colors ${language === lang.code ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-700'}`
                  },
                    React.createElement('span', null, lang.flag),
                    React.createElement('span', null, lang.name)
                  )
                )
              )
            ),
            isAuthenticated ?
              React.createElement('button', {
                onClick: () => navigate('/dashboard'),
                className: 'px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 neon-blue'
              }, t('dashboard')) :
              React.createElement(React.Fragment, null,
                React.createElement('button', {
                  onClick: () => navigate('/login'),
                  className: 'px-6 py-3 glass text-gray-800 rounded-2xl font-bold hover:bg-white transition-all duration-300'
                }, t('signIn')),
                React.createElement('button', {
                  onClick: () => navigate('/register'),
                  className: 'px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 neon-blue'
                }, t('getStarted'))
              )
          )
        )
      )
    ),

    // Hero Section
    React.createElement('div', { className: 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h1', {
          className: 'text-6xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl animate-slide-up',
          style: { textShadow: '0 0 40px rgba(255,255,255,0.5)' }
        }, t('heroTitle')),
        React.createElement('p', { className: 'text-2xl text-white mb-12 font-light animate-fade-in' },
          t('heroSubtitle')),
        React.createElement('div', { className: 'flex justify-center space-x-6 animate-scale-in' },
          React.createElement('button', {
            onClick: () => navigate('/match'),
            className: 'px-10 py-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-transparent'
          }, 'Match Horoscope ✨'),
          React.createElement('button', {
            onClick: () => navigate('/register'),
            className: 'px-10 py-5 bg-white text-indigo-600 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300'
          }, t('startFree')),
          React.createElement('button', {
            onClick: () => navigate('/#features'),
            className: 'px-10 py-5 glass-dark text-white rounded-3xl font-bold text-xl border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-300'
          }, t('learnMore'))
        )
      )
    ),

    // Features Grid
    React.createElement('div', { id: 'features', className: 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24' },
      React.createElement('div', { className: 'text-center mb-16' },
        React.createElement('h2', { className: 'text-5xl font-black text-white mb-4' }, t('whyChoose')),
        React.createElement('p', { className: 'text-xl text-white opacity-90' }, t('stunningBiodatas'))
      ),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
        features.map((feature, idx) =>
          React.createElement('div', {
            key: idx,
            className: `card-hover glass p-8 rounded-3xl transform hover:scale-105 transition-all duration-300`,
            style: { animationDelay: `${idx * 0.1}s` }
          },
            React.createElement('div', { className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-4 neon-blue` }, feature.icon),
            React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 mb-2' }, feature.title),
            React.createElement('p', { className: 'text-gray-600' }, feature.desc)
          )
        )
      )
    ),

    // Stats Section
    React.createElement('div', { className: 'relative bg-white/10 backdrop-blur-lg py-16' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-8 text-center' },
          stats.map((stat, idx) =>
            React.createElement('div', { key: idx },
              React.createElement('div', { className: 'text-5xl font-black text-white mb-2' }, stat.number),
              React.createElement('div', { className: 'text-white/80 font-medium' }, stat.label)
            )
          )
        )
      )
    ),

    // Pricing Section
    React.createElement('div', { id: 'pricing', className: 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24' },
      React.createElement('div', { className: 'text-center mb-16' },
        React.createElement('h2', { className: 'text-5xl font-black text-white mb-4' }, t('pricingTitle')),
        React.createElement('p', { className: 'text-xl text-white opacity-90' }, t('pricingSubtitle'))
      ),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
        pricingPlans.map((plan, idx) =>
          React.createElement('div', {
            key: idx,
            className: `glass p-8 rounded-3xl card-hover ${plan.popular ? 'ring-4 ring-indigo-500 transform scale-105' : ''}`
          },
            plan.popular && React.createElement('div', { className: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full inline-block mb-4' }, t('mostPopular')),
            React.createElement('h3', { className: 'text-3xl font-bold text-gray-800 mb-2' }, plan.name),
            React.createElement('div', { className: 'mb-6' },
              React.createElement('span', { className: 'text-5xl font-black gradient-text' }, plan.price),
              React.createElement('span', { className: 'text-gray-600 ml-2' }, plan.period)
            ),
            React.createElement('ul', { className: 'space-y-3 mb-8' },
              plan.features.map((feature, i) =>
                React.createElement('li', { key: i, className: 'flex items-center text-gray-700' },
                  React.createElement('span', { className: 'text-green-500 mr-2 text-xl' }, '✓'),
                  feature
                )
              )
            ),
            React.createElement('button', {
              onClick: () => navigate('/register'),
              className: `w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${plan.popular
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-2xl transform hover:scale-105'
                : 'glass text-gray-800 hover:bg-white'
                }`
            }, plan.cta)
          )
        )
      )
    ),

    // Footer
    React.createElement('footer', { className: 'glass-dark mt-24 py-12' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center' },
        React.createElement('p', { className: 'text-white text-lg' }, t('footerText')),
        React.createElement('div', { className: 'mt-4 space-x-4' },
          React.createElement('a', { href: '#', className: 'text-white/70 hover:text-white' }, t('privacy')),
          React.createElement('a', { href: '#', className: 'text-white/70 hover:text-white' }, t('terms')),
          React.createElement('a', { href: '#', className: 'text-white/70 hover:text-white' }, t('contact'))
        )
      )
    )
  );
};

export default HomePage;
