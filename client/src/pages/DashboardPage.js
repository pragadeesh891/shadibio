import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { useLanguage } from '../contexts/LanguageContext';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { biodataService } from '../services/api';
import MultiStepForm from '../components/Form/MultiStepForm';
import PersonalDetailsForm from '../components/Form/PersonalDetailsForm';
import FamilyDetailsForm from '../components/Form/FamilyDetailsForm';
import EducationProfessionForm from '../components/Form/EducationProfessionForm';
import HoroscopeSection from '../components/Form/HoroscopeSection';
import ProfilePhotoUpload from '../components/Form/ProfilePhotoUpload';
import TemplateSelection from '../components/Preview/TemplateSelection';
import PrivacyControls from '../components/Privacy/PrivacyControls';
import TemplateCustomization from '../components/Templates/TemplateCustomization';
import ProfileCompletion from '../components/Profile/ProfileCompletion';
import TraditionalTemplate from '../components/Templates/TraditionalTemplate';
import ModernTemplate from '../components/Templates/ModernTemplate';
import BiodataPreview from '../components/Preview/BiodataPreview';

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ stat, index }) => React.createElement(
  'div',
  {
    className: 'stat-card',
    style: { animationDelay: `${index * 80}ms` }
  },
  React.createElement('div', { className: 'stat-card-inner' },
    React.createElement('div', { className: `stat-icon-wrap stat-color-${index}` },
      React.createElement('span', { className: 'stat-icon' }, stat.icon)
    ),
    React.createElement('div', { className: 'stat-info' },
      React.createElement('span', { className: 'stat-value' }, stat.value),
      React.createElement('span', { className: 'stat-label' }, stat.label)
    )
  ),
  stat.label === 'Profile Completion' && React.createElement(
    'div', { className: 'stat-progress-wrap' },
    React.createElement('div', { className: 'stat-progress-track' },
      React.createElement('div', {
        className: 'stat-progress-fill',
        style: { width: stat.value }
      })
    )
  )
);

const NavItem = ({ tab, activeTab, onClick }) => React.createElement(
  'button',
  {
    onClick: () => onClick(tab.id),
    className: `nav-item ${activeTab === tab.id ? 'nav-item-active' : ''}`,
    title: tab.desc
  },
  React.createElement('span', { className: 'nav-icon' }, tab.icon),
  React.createElement('span', { className: 'nav-label' }, tab.name)
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const stats = [
    { label: 'Profile Completion', value: biodata ? '85%' : '0%', icon: '📊', progress: biodata ? 85 : 0 },
    { label: 'Profile Views', value: '127', icon: '👁️' },
    { label: 'Interests', value: '23', icon: '💌' },
    { label: 'Shortlisted', value: '8', icon: '⭐' },
  ];

  const navTabs = [
    { id: 'create', name: t('Create') || 'Create', icon: '✏️', desc: 'Build your biodata' },
    { id: 'preview', name: t('Preview') || 'Preview', icon: '👁️', desc: 'See how it looks' },
    { id: 'customize', name: t('Customize') || 'Customize', icon: '🎨', desc: 'Style it' },
    { id: 'privacy', name: t('Privacy') || 'Privacy', icon: '🔒', desc: 'Control visibility' },
    { id: 'history', name: 'History', icon: '📜', desc: 'Version history' },
    { id: 'profile', name: t('profile') || 'Profile', icon: '👤', desc: 'Manage profile' },
  ];

  useEffect(() => {
    const loadBiodata = async () => {
      try {
        const response = await biodataService.getUserBiodata();
        if (response.success) setBiodata(response.data.biodata);
      } catch (error) {
        if (error.response?.status !== 404) {
          setMessage({ type: 'error', text: 'Failed to load biodata' });
        }
      } finally {
        setLoading(false);
      }
    };
    loadBiodata();
  }, []);

  const handleFormComplete = async (formData) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = biodata
        ? await biodataService.updateBiodata(biodata._id, formData)
        : await biodataService.createBiodata(formData);
      if (response.success) {
        setBiodata(response.data.biodata);
        setMessage({ type: 'success', text: biodata ? 'Biodata updated! ✨' : 'Biodata created! 🎉' });
        setActiveTab('preview');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save biodata' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleDownloadPDF = async () => {
    if (!biodata) return;
    try {
      const API_URL = process.env.REACT_APP_API_URL ||
        (window.location.hostname === 'localhost'
          ? 'http://localhost:5000/api'
          : 'https://shadibio.onrender.com/api');

      setSaving(true); // Show loading state
      const response = await fetch(`${API_URL}/biodata/${biodata._id}/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ template: biodata.templateSelected, customization: biodata.customization })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `biodata_${biodata?.personalDetails?.fullName?.replace(/\s+/g, '_') || 'download'}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage({ type: 'success', text: 'PDF Downloaded! 📄 The PDF is password protected. Use your birthdate (DDMMYYYY) to open it.' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: errorData.message || 'Server failed to generate PDF. If you just updated your profile, please wait 10 seconds and try again.' });
      }
    } catch (error) {
      console.error('PDF Download Error:', error);
      setMessage({ type: 'error', text: 'Network error while downloading PDF. Please check your connection.' });
    } finally {
      setSaving(false); // Reuse saving state as a loading indicator
    }
  };

  const renderTemplatePreview = () => {
    const template = biodata?.templateSelected || 'Traditional';
    const customization = biodata?.customization || {};
    return template === 'Modern'
      ? React.createElement(ModernTemplate, { biodata, customization })
      : React.createElement(TraditionalTemplate, { biodata, customization });
  };

  // ─── Loading Screen ────────────────────────────────────────────────────────

  if (loading) return React.createElement(
    'div', { className: 'dash-loading' },
    React.createElement('div', { className: 'dash-loading-inner' },
      React.createElement('div', { className: 'dash-spinner' }),
      React.createElement('p', { className: 'dash-loading-text' }, 'Loading your dashboard…')
    )
  );

  // ─── Main Layout ───────────────────────────────────────────────────────────

  const userName = user?.name?.split(' ')[0] || 'Friend';
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return React.createElement(
    'div', { className: 'dash-root' },

    // ── Background: gradient + animated blobs ──────────────────────────────
    React.createElement('div', { className: 'dash-bg' },
      React.createElement('div', { className: 'dash-blob dash-blob-1' }),
      React.createElement('div', { className: 'dash-blob dash-blob-2' }),
      React.createElement('div', { className: 'dash-blob dash-blob-3' })
    ),

    // ── Mobile Overlay ────────────────────────────────────────────────────
    mobileNavOpen && React.createElement('div', {
      className: 'dash-overlay animate-fade-in',
      onClick: () => setMobileNavOpen(false)
    }),

    // ── Side Navigation ───────────────────────────────────────────────────
    React.createElement(
      'aside', { className: `dash-sidebar ${mobileNavOpen ? 'dash-sidebar-open' : ''}` },

      // Logo
      React.createElement('div', { className: 'dash-logo' },
        React.createElement('div', { className: 'dash-logo-icon' }, '💕'),
        React.createElement('div', null,
          React.createElement('span', { className: 'dash-logo-title' }, 'ShadiBio'),
          React.createElement('span', { className: 'dash-logo-sub' }, 'Matrimonial')
        )
      ),

      // User Avatar & Quick Info
      React.createElement('div', { className: 'dash-sidebar-profile' },
        React.createElement('div', { className: 'dash-avatar' }, userInitials),
        React.createElement('div', { className: 'dash-sidebar-profile-info' },
          React.createElement('p', { className: 'dash-sidebar-name' }, user?.name || 'Welcome'),
          React.createElement('span', {
            className: 'dash-sidebar-badge',
            style: user?.isPremium ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white' } : {}
          }, user?.isPremium ? '⭐ Premium' : '✦ Free')
        )
      ),

      // Navigation Items
      React.createElement('nav', { className: 'dash-nav' },
        React.createElement('p', { className: 'dash-nav-section-label' }, 'WORKSPACE'),
        ...navTabs.map(tab =>
          React.createElement(NavItem, {
            key: tab.id,
            tab,
            activeTab,
            onClick: (id) => { setActiveTab(id); setMobileNavOpen(false); }
          })
        )
      ),

      // Bottom: Admin link + Logout
      React.createElement('div', { className: 'dash-sidebar-footer' },
        user?.isPremium && React.createElement('button', {
          className: 'dash-logout-btn',
          style: { marginBottom: '8px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white' },
          onClick: () => navigate('/admin')
        },
          React.createElement('span', null, '🛡️'),
          React.createElement('span', null, 'Admin Panel')
        ),
        React.createElement('button', { className: 'dash-logout-btn', onClick: handleLogout },
          React.createElement('span', null, '🚪'),
          React.createElement('span', null, t('Logout') || 'Logout')
        )
      )
    ),

    // ── Main Content ─────────────────────────────────────────────────────────
    React.createElement(
      'div', { className: 'dash-main' },

      // ── Top Bar ────────────────────────────────────────────────────────────
      React.createElement('header', { className: 'dash-topbar' },
        // Mobile menu toggle
        React.createElement('button', {
          className: 'dash-mobile-menu-btn',
          onClick: () => setMobileNavOpen(!mobileNavOpen)
        }, '☰'),

        // Page title area
        React.createElement('div', { className: 'dash-topbar-title-area' },
          React.createElement('h1', { className: 'dash-page-title' },
            navTabs.find(t => t.id === activeTab)?.icon,
            ' ',
            navTabs.find(t => t.id === activeTab)?.name === 'Create' ? 'Create Biodata' :
              navTabs.find(t => t.id === activeTab)?.name + ' Biodata'
          ),
          React.createElement('p', { className: 'dash-page-subtitle' },
            navTabs.find(t => t.id === activeTab)?.desc
          )
        ),

        // Actions
        React.createElement('div', { className: 'dash-topbar-actions' },
          biodata && React.createElement('button', {
            className: 'dash-action-btn dash-action-btn-ghost',
            onClick: handleDownloadPDF
          },
            React.createElement('span', null, '📄'),
            React.createElement('span', { className: 'dash-btn-label' }, t('Download PDF') || 'Download PDF')
          ),
          React.createElement('div', { className: 'dash-topbar-avatar' }, userInitials)
        )
      ),

      // ── Content Body ────────────────────────────────────────────────────────
      React.createElement('div', { className: 'dash-body' },

        // ── Alert Message ────────────────────────────────────────────────────
        message.text && React.createElement(
          'div', {
          className: `dash-alert ${message.type === 'success' ? 'dash-alert-success' : 'dash-alert-error'}`,
          onClick: () => setMessage({ type: '', text: '' })
        },
          React.createElement('span', null, message.type === 'success' ? '✅' : '❌'),
          React.createElement('span', null, message.text),
          React.createElement('button', { className: 'dash-alert-close' }, '×')
        ),

        // ── Stats Row ─────────────────────────────────────────────────────────
        React.createElement('div', { className: 'dash-stats-grid' },
          ...stats.map((stat, i) => React.createElement(StatCard, { key: i, stat, index: i }))
        ),

        // ── Tab Content ─────────────────────────────────────────────────────────

        // CREATE tab
        activeTab === 'create' && React.createElement(
          'div', { className: 'dash-create-layout' },

          // Left: Hero CTA + Form
          React.createElement('div', { className: 'dash-create-main' },

            // CTA Banner
            !biodata && React.createElement('div', { className: 'dash-cta-banner' },
              React.createElement('div', { className: 'dash-cta-banner-content' },
                React.createElement('div', { className: 'dash-cta-banner-text' },
                  React.createElement('h2', { className: 'dash-cta-title' }, '✨ Start Your Journey'),
                  React.createElement('p', { className: 'dash-cta-desc' },
                    'Create a stunning biodata that showcases your personality and attracts the right match.'
                  )
                ),
                React.createElement('div', { className: 'dash-cta-banner-decoration' }, '💕')
              )
            ),

            // Form card
            React.createElement('div', { className: 'dash-card' },
              React.createElement(MultiStepForm, { onComplete: handleFormComplete },
                React.createElement(MultiStepForm.Step, { title: 'Personal Information' },
                  (props) => React.createElement(PersonalDetailsForm, props)
                ),
                React.createElement(MultiStepForm.Step, { title: 'Family Details' },
                  (props) => React.createElement(FamilyDetailsForm, props)
                ),
                React.createElement(MultiStepForm.Step, { title: 'Education & Profession' },
                  (props) => React.createElement(EducationProfessionForm, props)
                ),
                React.createElement(MultiStepForm.Step, { title: 'Additional Details' },
                  (props) => React.createElement('div', { className: 'dash-additional-steps' },
                    React.createElement(HoroscopeSection, props),
                    React.createElement(ProfilePhotoUpload, props),
                    React.createElement(TemplateSelection, props)
                  )
                )
              )
            )
          ),

          // Right: Mini Preview Card
          React.createElement('aside', { className: 'dash-create-sidebar' },
            React.createElement(BiodataPreview, { formData: biodata || {} })
          )
        ),

        // PREVIEW tab
        activeTab === 'preview' && React.createElement(
          'div', { className: 'dash-preview-layout' },
          React.createElement('div', { className: 'dash-card dash-preview-card' },
            React.createElement('div', { className: 'dash-card-header' },
              React.createElement('h2', { className: 'dash-card-title' }, '👁️ Biodata Preview'),
              React.createElement('div', { className: 'dash-card-actions' },
                React.createElement('button', {
                  className: 'dash-action-btn dash-action-btn-ghost',
                  onClick: () => setActiveTab('customize')
                }, '🎨 Customize'),
                React.createElement('button', {
                  className: 'dash-action-btn dash-action-btn-primary',
                  onClick: handleDownloadPDF, disabled: !biodata
                }, '📄 Download PDF')
              )
            ),
            biodata
              ? React.createElement('div', { className: 'dash-preview-template-wrap' }, renderTemplatePreview())
              : React.createElement('div', { className: 'dash-empty-state' },
                React.createElement('div', { className: 'dash-empty-icon' }, '📝'),
                React.createElement('h3', { className: 'dash-empty-title' }, 'No biodata yet'),
                React.createElement('p', { className: 'dash-empty-desc' }, 'Create your biodata first to preview it here.'),
                React.createElement('button', {
                  className: 'dash-action-btn dash-action-btn-primary',
                  onClick: () => setActiveTab('create')
                }, '✏️ Create Biodata')
              )
          )
        ),

        // CUSTOMIZE tab
        activeTab === 'customize' && React.createElement(
          'div', { className: 'dash-two-col' },
          React.createElement('div', { className: 'dash-card' },
            React.createElement('div', { className: 'dash-card-header' },
              React.createElement('h2', { className: 'dash-card-title' }, '🎨 Customize Design')
            ),
            React.createElement(TemplateCustomization, {
              formData: biodata || {},
              updateFormData: (data) => {
                setBiodata(prev => ({ ...prev, ...data }));
                if (biodata) biodataService.updateBiodata(biodata._id, data);
              }
            })
          ),
          React.createElement('div', { className: 'dash-card' },
            React.createElement('div', { className: 'dash-card-header' },
              React.createElement('h2', { className: 'dash-card-title' }, '🖼️ Choose Template')
            ),
            React.createElement(TemplateSelection, {
              formData: biodata || {},
              updateFormData: (data) => {
                setBiodata(prev => ({ ...prev, ...data }));
                if (biodata) biodataService.updateBiodata(biodata._id, data);
              }
            })
          )
        ),

        // HISTORY tab
        activeTab === 'history' && React.createElement(
          'div', { className: 'dash-single-col' },
          React.createElement('div', { className: 'dash-card' },
            React.createElement('div', { className: 'dash-card-header' },
              React.createElement('h2', { className: 'dash-card-title' }, '📜 Version History'),
              React.createElement('p', { className: 'dash-card-subtitle' }, 'Snapshots of your biodata saved automatically on each edit')
            ),
            biodata && biodata.history && biodata.history.length > 0
              ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' } },
                [...biodata.history].reverse().map((entry, i) =>
                  React.createElement('div', {
                    key: i,
                    style: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                  },
                    React.createElement('div', null,
                      React.createElement('p', { style: { fontWeight: 'bold', color: '#374151' } },
                        'Version ' + (biodata.history.length - i)
                      ),
                      React.createElement('p', { style: { fontSize: '13px', color: '#6b7280', marginTop: '4px' } },
                        '🕒 Saved: ' + new Date(entry.savedAt).toLocaleString()
                      ),
                      React.createElement('p', { style: { fontSize: '13px', color: '#9ca3af', marginTop: '2px' } },
                        entry.snapshot?.personalDetails?.fullName || 'Unnamed Biodata'
                      )
                    ),
                    React.createElement('span', {
                      style: { background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }
                    }, i === 0 ? 'Latest Backup' : `Backup ${biodata.history.length - i}`)
                  )
                )
              )
              : React.createElement('div', { className: 'dash-empty-state' },
                React.createElement('div', { className: 'dash-empty-icon' }, '📜'),
                React.createElement('h3', { className: 'dash-empty-title' }, 'No history yet'),
                React.createElement('p', { className: 'dash-empty-desc' }, 'Version snapshots appear here automatically each time you edit and save your biodata.')
              )
          )
        ),

        // PRIVACY tab
        activeTab === 'privacy' && React.createElement(
          'div', { className: 'dash-single-col' },
          React.createElement('div', { className: 'dash-card' },
            React.createElement('div', { className: 'dash-card-header' },
              React.createElement('h2', { className: 'dash-card-title' }, '🔒 Privacy Settings'),
              React.createElement('p', { className: 'dash-card-subtitle' }, 'Control what others can see in your biodata')
            ),
            React.createElement(PrivacyControls, {
              formData: biodata || {},
              updateFormData: (data) => {
                setBiodata(prev => ({ ...prev, ...data }));
                if (biodata) biodataService.updateBiodata(biodata._id, data);
              }
            })
          )
        ),

        // PROFILE tab
        activeTab === 'profile' && React.createElement(
          'div', { className: 'dash-two-col' },

          // Profile Summary
          React.createElement('div', { className: 'dash-card' },
            React.createElement('div', { className: 'dash-profile-hero' },
              React.createElement('div', { className: 'dash-profile-avatar-wrap' },
                biodata?.profilePhoto
                  ? React.createElement('img', {
                    src: biodata.profilePhoto,
                    alt: 'Profile',
                    className: 'dash-profile-photo'
                  })
                  : React.createElement('div', { className: 'dash-profile-avatar-placeholder' }, userInitials)
              ),
              React.createElement('div', { className: 'dash-profile-info' },
                React.createElement('h2', { className: 'dash-profile-name' },
                  biodata?.personalDetails?.fullName || user?.name || 'Your Name'
                ),
                React.createElement('p', { className: 'dash-profile-meta' },
                  biodata?.personalDetails?.age ? `${biodata.personalDetails.age} yrs` : '',
                  biodata?.educationProfession?.profession
                    ? ` · ${biodata.educationProfession.profession}` : ''
                ),
                React.createElement('span', { className: 'dash-profile-status' }, '● Active Profile')
              )
            ),
            React.createElement(ProfileCompletion, { formData: biodata || {} })
          ),

          // Quick Actions
          React.createElement('div', { className: 'dash-card' },
            React.createElement('div', { className: 'dash-card-header' },
              React.createElement('h2', { className: 'dash-card-title' }, '⚡ Quick Actions')
            ),
            React.createElement('div', { className: 'dash-quick-actions' },
              React.createElement('button', {
                className: 'dash-qaction',
                onClick: () => setActiveTab('create')
              },
                React.createElement('span', { className: 'dash-qaction-icon dash-qaction-indigo' }, '✏️'),
                React.createElement('div', null,
                  React.createElement('p', { className: 'dash-qaction-title' }, 'Edit Biodata'),
                  React.createElement('p', { className: 'dash-qaction-desc' }, 'Update your information')
                ),
                React.createElement('span', { className: 'dash-qaction-arrow' }, '›')
              ),
              React.createElement('button', {
                className: 'dash-qaction',
                onClick: handleDownloadPDF
              },
                React.createElement('span', { className: 'dash-qaction-icon dash-qaction-emerald' }, '📄'),
                React.createElement('div', null,
                  React.createElement('p', { className: 'dash-qaction-title' }, 'Download PDF'),
                  React.createElement('p', { className: 'dash-qaction-desc' }, 'Save to your device')
                ),
                React.createElement('span', { className: 'dash-qaction-arrow' }, '›')
              ),
              React.createElement('button', {
                className: 'dash-qaction',
                onClick: () => setActiveTab('preview')
              },
                React.createElement('span', { className: 'dash-qaction-icon dash-qaction-purple' }, '👁️'),
                React.createElement('div', null,
                  React.createElement('p', { className: 'dash-qaction-title' }, 'Preview Biodata'),
                  React.createElement('p', { className: 'dash-qaction-desc' }, 'See how it looks')
                ),
                React.createElement('span', { className: 'dash-qaction-arrow' }, '›')
              ),
              React.createElement('button', {
                className: 'dash-qaction',
                onClick: () => setActiveTab('customize')
              },
                React.createElement('span', { className: 'dash-qaction-icon dash-qaction-pink' }, '🎨'),
                React.createElement('div', null,
                  React.createElement('p', { className: 'dash-qaction-title' }, 'Customize Design'),
                  React.createElement('p', { className: 'dash-qaction-desc' }, 'Pick colors & templates')
                ),
                React.createElement('span', { className: 'dash-qaction-arrow' }, '›')
              ),
              React.createElement('button', {
                className: 'dash-qaction',
                onClick: () => navigate('/match')
              },
                React.createElement('span', { className: 'dash-qaction-icon', style: { background: 'linear-gradient(135deg, #ffd700, #ff007f)', color: 'white' } }, '✨'),
                React.createElement('div', null,
                  React.createElement('p', { className: 'dash-qaction-title' }, 'Match Horoscope'),
                  React.createElement('p', { className: 'dash-qaction-desc' }, 'Check 36 Guna compatibility')
                ),
                React.createElement('span', { className: 'dash-qaction-arrow' }, '›')
              )
            )
          )
        )
      )
    ),

    // Mobile overlay
    mobileNavOpen && React.createElement('div', {
      className: 'dash-overlay',
      onClick: () => setMobileNavOpen(false)
    })
  );
};

export default DashboardPage;