import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // In a real implementation, add admin role check. Since role might not be fully active
        // in AuthContext, we just check if they are logged in.
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

                // Fetch all users (mocking endpoint for now or using a newly created one)
                const response = await fetch(`${API_URL}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();
                if (response.ok) {
                    setUsers(data.data.users);
                } else {
                    setError(data.message || 'Failed to fetch users');
                }
            } catch (err) {
                setError('Error loading dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user, navigate]);

    const makePremium = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/users/${userId}/premium`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setUsers(users.map(u => u._id === userId ? { ...u, isPremium: true } : u));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return React.createElement('div', { className: 'min-h-screen flex items-center justify-center' }, 'Loading admin data...');

    return React.createElement(
        'div',
        { className: 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8' },
        React.createElement(
            'div',
            { className: 'max-w-7xl mx-auto' },
            React.createElement(
                'div',
                { className: 'text-center mb-12' },
                React.createElement('h1', { className: 'text-4xl font-extrabold text-gray-900' }, 'Admin Dashboard'),
                React.createElement('p', { className: 'mt-2 text-lg text-gray-600' }, 'Manage users and platform settings')
            ),
            error && React.createElement('div', { className: 'bg-red-50 text-red-600 p-4 rounded-lg mb-6' }, error),
            React.createElement(
                'div',
                { className: 'bg-white shadow overflow-hidden sm:rounded-lg' },
                React.createElement(
                    'table',
                    { className: 'min-w-full divide-y divide-gray-200' },
                    React.createElement(
                        'thead',
                        { className: 'bg-gray-50' },
                        React.createElement(
                            'tr',
                            null,
                            React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Name'),
                            React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Email'),
                            React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Status'),
                            React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Actions')
                        )
                    ),
                    React.createElement(
                        'tbody',
                        { className: 'bg-white divide-y divide-gray-200' },
                        users.map(u =>
                            React.createElement(
                                'tr',
                                { key: u._id },
                                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, u.name),
                                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, u.email),
                                React.createElement(
                                    'td',
                                    { className: 'px-6 py-4 whitespace-nowrap' },
                                    React.createElement(
                                        'span',
                                        { className: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' + (u.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800') },
                                        u.isPremium ? 'Premium' : 'Free'
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium' },
                                    !u.isPremium && React.createElement(
                                        'button',
                                        { onClick: () => makePremium(u._id), className: 'text-indigo-600 hover:text-indigo-900' },
                                        'Make Premium'
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};

export default AdminDashboard;
