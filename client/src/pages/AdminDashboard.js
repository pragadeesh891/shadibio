import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

    if (loading) return React.createElement('div', { className: 'dash-loading' },
        React.createElement('div', { className: 'dash-spinner' })
    );

    return React.createElement(
        'div', { className: 'dash-root' },
        React.createElement('div', { className: 'dash-bg' },
            React.createElement('div', { className: 'dash-blob dash-blob-1' }),
            React.createElement('div', { className: 'dash-blob dash-blob-2' })
        ),

        React.createElement('main', { className: 'dash-main', style: { marginLeft: 0 } },
            React.createElement('header', { className: 'dash-topbar' },
                React.createElement('button', {
                    className: 'dash-action-btn dash-action-btn-ghost',
                    onClick: () => navigate('/dashboard'),
                    style: { marginRight: '15px' }
                }, '← Back'),
                React.createElement('div', { className: 'dash-topbar-title-area' },
                    React.createElement('h1', { className: 'dash-page-title' }, '🛡️ Admin Dashboard'),
                    React.createElement('p', { className: 'dash-page-subtitle' }, 'Manage users and platform status')
                )
            ),

            React.createElement('div', { className: 'dash-body' },
                error && React.createElement('div', { className: 'dash-alert dash-alert-error' }, error),

                React.createElement('div', { className: 'dash-card' },
                    React.createElement('div', { className: 'dash-card-header' },
                        React.createElement('h2', { className: 'dash-card-title' }, 'User Management'),
                        React.createElement('p', { className: 'dash-card-subtitle' }, `Total registered users: ${users.length}`)
                    ),

                    React.createElement('div', { style: { overflowX: 'auto' } },
                        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', color: 'var(--c-text-b)' } },
                            React.createElement('thead', { style: { background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--c-border)' } },
                                React.createElement('tr', null,
                                    ['Name', 'Email', 'Status', 'Actions'].map(h =>
                                        React.createElement('th', { key: h, style: { textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--c-text-muted)' } }, h)
                                    )
                                )
                            ),
                            React.createElement('tbody', null,
                                users.map(u => React.createElement('tr', {
                                    key: u._id,
                                    style: { borderBottom: '1px solid var(--c-border)', transition: 'background 0.2s' }
                                },
                                    React.createElement('td', { style: { padding: '16px', fontSize: '14px' } }, u.name),
                                    React.createElement('td', { style: { padding: '16px', fontSize: '14px' } }, u.email),
                                    React.createElement('td', { style: { padding: '16px' } },
                                        React.createElement('span', {
                                            style: {
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                background: u.isPremium ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                                color: u.isPremium ? '#10b981' : 'var(--c-text-muted)',
                                                border: `1px solid ${u.isPremium ? 'rgba(16, 185, 129, 0.3)' : 'var(--c-border)'}`
                                            }
                                        }, u.isPremium ? 'PREMIUM' : 'FREE')
                                    ),
                                    React.createElement('td', { style: { padding: '16px' } },
                                        !u.isPremium && React.createElement('button', {
                                            className: 'dash-action-btn dash-action-btn-primary',
                                            style: { padding: '6px 12px', fontSize: '12px' },
                                            onClick: () => makePremium(u._id)
                                        }, 'Upgrade to Premium')
                                    )
                                ))
                            )
                        )
                    )
                )
            )
        )
    );
};

export default AdminDashboard;
