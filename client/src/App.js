import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import DashboardPage from './pages/DashboardPage';
import HoroscopeMatchPage from './pages/HoroscopeMatchPage';
import ChatBot from './components/ChatBot/ChatBot';
import './App.css';

function App() {
  return React.createElement(
    LanguageProvider,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        Router,
        null,
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: '/', element: React.createElement(HomePage, null) }),
            React.createElement(Route, { path: '/login', element: React.createElement(LoginPage, null) }),
            React.createElement(Route, { path: '/register', element: React.createElement(RegisterPage, null) }),
            React.createElement(Route, { path: '/forgot-password', element: React.createElement(ForgotPassword, null) }),
            React.createElement(Route, { path: '/match', element: React.createElement(HoroscopeMatchPage, null) }),
            React.createElement(Route, {
              path: '/dashboard',
              element: React.createElement(ProtectedRoute, null, React.createElement(DashboardPage, null))
            })
          ),
          React.createElement(ChatBot, null)
        )
      )
    )
  );
}

export default App;