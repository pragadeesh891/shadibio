import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/resetpassword/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please try again.');
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
                    'Create New Password'
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
                        { htmlFor: 'password', className: 'block text-sm font-bold text-gray-700 mb-2' },
                        'New Password'
                    ),
                    React.createElement(
                        'input',
                        {
                            id: 'password',
                            type: 'password',
                            required: true,
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                            className: 'appearance-none relative block w-full px-4 py-4 border-2 border-gray-300 placeholder-gray-500 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all',
                            placeholder: 'Enter new password'
                        }
                    ),
                    React.createElement(
                        'label',
                        { htmlFor: 'confirm-password', className: 'block text-sm font-bold text-gray-700 mt-4 mb-2' },
                        'Confirm New Password'
                    ),
                    React.createElement(
                        'input',
                        {
                            id: 'confirm-password',
                            type: 'password',
                            required: true,
                            value: confirmPassword,
                            onChange: (e) => setConfirmPassword(e.target.value),
                            className: 'appearance-none relative block w-full px-4 py-4 border-2 border-gray-300 placeholder-gray-500 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all',
                            placeholder: 'Confirm new password'
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
                    'Password reset successful! Redirecting to login...'
                ),

                React.createElement(
                    'button',
                    {
                        type: 'submit',
                        disabled: loading || success,
                        className: 'group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl'
                    },
                    loading ? 'Resetting...' : 'Reset Password'
                )
            )
        )
    );
};

export default ResetPassword;
