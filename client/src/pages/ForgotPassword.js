import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate password reset email (in production, this would call your backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production: await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full space-y-8 glass p-10 rounded-3xl shadow-2xl-custom animate-slide-up' },
      React.createElement(
        'div',
        null,
        React.createElement(
          'h2',
          { className: 'mt-6 text-center text-4xl font-black gradient-text' },
          'Reset Password'
        ),
        React.createElement(
          'p',
          { className: 'mt-2 text-center text-sm text-gray-600' },
          'Enter your email to receive password reset instructions'
        )
      ),
      React.createElement(
        'form',
        { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'email-address', className: 'block text-sm font-bold text-gray-700 mb-2' },
            'Email Address'
          ),
          React.createElement(
            'input',
            {
              id: 'email-address',
              name: 'email',
              type: 'email',
              autoComplete: 'email',
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: 'appearance-none relative block w-full px-4 py-4 border-2 border-gray-300 placeholder-gray-500 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all',
              placeholder: 'Enter your email'
            }
          )
        ),

        error && React.createElement(
          'div',
          { className: 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm' },
          error
        ),

        success && React.createElement(
          'div',
          { className: 'bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-2xl text-sm' },
          'Password reset link sent! Check your email.'
        ),

        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: loading,
            className: 'group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl'
          },
          loading ? 'Sending...' : 'Send Reset Link'
        ),

        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'div',
            { className: 'text-sm' },
            React.createElement(
              'a',
              {
                href: '#',
                onClick: (e) => { e.preventDefault(); navigate('/login'); },
                className: 'font-medium text-indigo-600 hover:text-indigo-500'
              },
              'Back to Login'
            )
          )
        )
      )
    )
  );
};

export default ForgotPassword;
