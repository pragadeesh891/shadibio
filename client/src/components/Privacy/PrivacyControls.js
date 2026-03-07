import React, { useState, useEffect } from 'react';

const PrivacyControls = ({ formData, updateFormData }) => {
  const [privacySettings, setPrivacySettings] = useState({
    hidePhone: false,
    hideEmail: false,
    hideIncome: false
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (formData && formData.privacySettings) {
      setPrivacySettings({
        ...privacySettings,
        ...formData.privacySettings
      });
    }
  }, [formData]);

  const handleToggle = (setting) => {
    const newSettings = {
      ...privacySettings,
      [setting]: !privacySettings[setting]
    };

    setPrivacySettings(newSettings);
    updateFormData({ privacySettings: newSettings });
  };

  const handleToggleAll = (hideAll) => {
    const newSettings = {
      hidePhone: hideAll,
      hideEmail: hideAll,
      hideIncome: hideAll
    };

    setPrivacySettings(newSettings);
    updateFormData({ privacySettings: newSettings });
  };

  return React.createElement(
    'div',
    { className: 'glass rounded-[2rem] shadow-2xl-custom p-8 border border-white/20' },
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-2' },
        'Privacy Controls'
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-gray-600' },
        'Control which information is visible in your biodata. This helps protect your privacy while still allowing others to view your profile.'
      )
    ),

    // Quick actions
    React.createElement(
      'div',
      { className: 'mb-6 flex space-x-4' },
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => handleToggleAll(true),
          className: 'btn-premium btn-premium-rose !px-4 !py-2 !text-xs'
        },
        'Hide All'
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => handleToggleAll(false),
          className: 'btn-premium btn-premium-emerald !px-4 !py-2 !text-xs'
        },
        'Show All'
      )
    ),

    // Individual privacy controls
    React.createElement(
      'div',
      { className: 'space-y-4' },
      // Hide Phone
      React.createElement(
        'div',
        { className: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement('span', { className: 'text-lg mr-2' }, '📱'),
            React.createElement(
              'label',
              { htmlFor: 'hidePhone', className: 'text-sm font-medium text-gray-700' },
              'Hide Phone Number'
            )
          ),
          React.createElement(
            'p',
            { className: 'mt-1 text-xs text-gray-500' },
            'When enabled, your phone number will not be visible in your biodata'
          )
        ),
        React.createElement('input', {
          type: 'checkbox',
          id: 'hidePhone',
          checked: privacySettings.hidePhone,
          onChange: () => handleToggle('hidePhone'),
          className: 'h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
        })
      ),

      // Hide Email
      React.createElement(
        'div',
        { className: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement('span', { className: 'text-lg mr-2' }, '✉️'),
            React.createElement(
              'label',
              { htmlFor: 'hideEmail', className: 'text-sm font-medium text-gray-700' },
              'Hide Email Address'
            )
          ),
          React.createElement(
            'p',
            { className: 'mt-1 text-xs text-gray-500' },
            'When enabled, your email address will not be visible in your biodata'
          )
        ),
        React.createElement('input', {
          type: 'checkbox',
          id: 'hideEmail',
          checked: privacySettings.hideEmail,
          onChange: () => handleToggle('hideEmail'),
          className: 'h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
        })
      ),

      // Hide Income
      React.createElement(
        'div',
        { className: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement('span', { className: 'text-lg mr-2' }, '💰'),
            React.createElement(
              'label',
              { htmlFor: 'hideIncome', className: 'text-sm font-medium text-gray-700' },
              'Hide Annual Income'
            )
          ),
          React.createElement(
            'p',
            { className: 'mt-1 text-xs text-gray-500' },
            'When enabled, your annual income will not be visible in your biodata'
          )
        ),
        React.createElement('input', {
          type: 'checkbox',
          id: 'hideIncome',
          checked: privacySettings.hideIncome,
          onChange: () => handleToggle('hideIncome'),
          className: 'h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
        })
      )
    ),

    // Privacy summary
    React.createElement(
      'div',
      { className: 'mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200' },
      React.createElement(
        'div',
        { className: 'flex items-start' },
        React.createElement('span', { className: 'text-blue-500 mr-2 mt-0.5' }, 'ℹ️'),
        React.createElement(
          'div',
          null,
          React.createElement(
            'h4',
            { className: 'text-sm font-medium text-blue-800' },
            'Privacy Summary'
          ),
          React.createElement(
            'p',
            { className: 'mt-1 text-sm text-blue-700' },
            `Currently ${Object.values(privacySettings).filter(Boolean).length} out of 3 fields are hidden from public view.`
          )
        )
      )
    )
  );
};

export default PrivacyControls;