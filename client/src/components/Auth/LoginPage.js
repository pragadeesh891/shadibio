import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import FloatingHearts from '../Effects/FloatingHearts';

const LoginPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard'); // Redirect to dashboard after login
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8', style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } },
    React.createElement(FloatingHearts),
    React.createElement(
      'div',
      { className: 'sm:mx-auto sm:w-full sm:max-w-md' },
      React.createElement(
        'h2',
        { className: 'mt-6 text-center text-4xl font-black text-gray-800' },
        t('signInAccount')
      )
    ),
    React.createElement(
      'div',
      { className: 'mt-8 sm:mx-auto sm:w-full sm:max-w-md' },
      React.createElement(
        'div',
        { className: 'glass py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10' },
        React.createElement(
          'form',
          { className: 'space-y-6', onSubmit: handleSubmit },
          error && React.createElement(
            'div',
            { className: 'bg-red-50/20 border-l-4 border-red-400 p-4 rounded-lg' },
            React.createElement(
              'div',
              { className: 'flex' },
              React.createElement(
                'div',
                { className: 'ml-3' },
                React.createElement(
                  'p',
                  { className: 'text-sm text-red-100' },
                  error
                )
              )
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'email', className: 'block text-sm font-bold text-gray-700' },
              t('emailAddress')
            ),
            React.createElement(
              'div',
              { className: 'mt-1' },
              React.createElement('input', {
                id: 'email',
                name: 'email',
                type: 'email',
                autoComplete: 'email',
                required: true,
                value: formData.email,
                onChange: handleChange,
                className: 'appearance-none block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all'
              })
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'password', className: 'block text-sm font-bold text-gray-700' },
              t('password')
            ),
            React.createElement(
              'div',
              { className: 'mt-1' },
              React.createElement('input', {
                id: 'password',
                name: 'password',
                type: 'password',
                autoComplete: 'current-password',
                required: true,
                value: formData.password,
                onChange: handleChange,
                className: 'appearance-none block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all'
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                id: 'remember-me',
                name: 'remember-me',
                type: 'checkbox',
                className: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-white/20 rounded bg-white/10'
              }),
              React.createElement(
                'label',
                { htmlFor: 'remember-me', className: 'ml-2 block text-sm text-gray-600' },
                t('rememberMe')
              )
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'button',
              {
                type: 'submit',
                disabled: loading,
                className: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform hover:scale-[1.02]'
              },
              loading ? t('signingIn') : t('signIn')
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'mt-6' },
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement(
              'div',
              { className: 'absolute inset-0 flex items-center' },
              React.createElement('div', { className: 'w-full border-t border-white/20' })
            ),
            React.createElement(
              'div',
              { className: 'relative flex justify-center text-sm' },
              React.createElement(
                'span',
                { className: 'px-2 bg-white text-gray-500 rounded-full' },
                t('or')
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'mt-6' },
            React.createElement(
              'p',
              { className: 'mt-2 text-center text-sm text-gray-600' },
              React.createElement(
                Link,
                {
                  to: '/register',
                  className: 'font-bold text-indigo-600 hover:text-indigo-500 underline decoration-2 underline-offset-4'
                },
                t('notHaveAccount')
              )
            )
          )
        )
      )
    )
  );
};

export default LoginPage;