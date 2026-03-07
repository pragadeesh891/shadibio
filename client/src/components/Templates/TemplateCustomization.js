import React, { useState, useEffect } from 'react';

const TemplateCustomization = ({ formData, updateFormData }) => {
  const [customization, setCustomization] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Arial, sans-serif',
    fontSize: 'medium',
    theme: 'light'
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (formData && formData.customization) {
      setCustomization({
        ...customization,
        ...formData.customization
      });
    }
  }, [formData]);

  const handleCustomizationChange = (property, value) => {
    const newCustomization = {
      ...customization,
      [property]: value
    };

    setCustomization(newCustomization);
    updateFormData({ customization: newCustomization });
  };

  // Color options for customization
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Indigo', value: '#6366F1' }
  ];

  // Font options for customization
  const fontOptions = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' }
  ];

  // Font size options
  const fontSizeOptions = [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' },
    { name: 'Extra Large', value: 'x-large' }
  ];

  // Theme options
  const themeOptions = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'Professional', value: 'professional' }
  ];

  return React.createElement(
    'div',
    { className: 'glass rounded-[2rem] shadow-2xl-custom p-8 border border-white/20' },
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-2' },
        'Template Customization'
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-gray-600' },
        'Customize the appearance of your biodata template to match your preferences.'
      )
    ),

    React.createElement(
      'div',
      { className: 'space-y-6' },
      // Color Customization
      React.createElement(
        'div',
        null,
        React.createElement(
          'h4',
          { className: 'text-md font-medium text-gray-800 mb-3' },
          'Color Scheme'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          // Primary Color
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-2' },
              'Primary Color'
            ),
            React.createElement(
              'div',
              { className: 'flex flex-wrap gap-2 mb-2' },
              colorOptions.map(color =>
                React.createElement(
                  'button',
                  {
                    key: color.value,
                    type: 'button',
                    onClick: () => handleCustomizationChange('primaryColor', color.value),
                    className: `w-8 h-8 rounded-full border-2 ${customization.primaryColor === color.value
                        ? 'border-gray-800 ring-2 ring-offset-2 ring-indigo-500'
                        : 'border-gray-300 hover:border-gray-500'
                      }`,
                    style: { backgroundColor: color.value },
                    title: color.name
                  }
                )
              )
            ),
            React.createElement('input', {
              type: 'color',
              value: customization.primaryColor,
              onChange: (e) => handleCustomizationChange('primaryColor', e.target.value),
              className: 'w-12 h-10 rounded border border-gray-300'
            })
          ),

          // Secondary Color
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-2' },
              'Secondary Color'
            ),
            React.createElement(
              'div',
              { className: 'flex flex-wrap gap-2 mb-2' },
              colorOptions.map(color =>
                React.createElement(
                  'button',
                  {
                    key: color.value,
                    type: 'button',
                    onClick: () => handleCustomizationChange('secondaryColor', color.value),
                    className: `w-8 h-8 rounded-full border-2 ${customization.secondaryColor === color.value
                        ? 'border-gray-800 ring-2 ring-offset-2 ring-indigo-500'
                        : 'border-gray-300 hover:border-gray-500'
                      }`,
                    style: { backgroundColor: color.value },
                    title: color.name
                  }
                )
              )
            ),
            React.createElement('input', {
              type: 'color',
              value: customization.secondaryColor,
              onChange: (e) => handleCustomizationChange('secondaryColor', e.target.value),
              className: 'w-12 h-10 rounded border border-gray-300'
            })
          )
        )
      ),

      // Typography Customization
      React.createElement(
        'div',
        null,
        React.createElement(
          'h4',
          { className: 'text-md font-medium text-gray-800 mb-3' },
          'Typography'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          // Font Family
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'fontFamily', className: 'block text-sm font-medium text-gray-700 mb-2' },
              'Font Family'
            ),
            React.createElement('select', {
              id: 'fontFamily',
              value: customization.fontFamily,
              onChange: (e) => handleCustomizationChange('fontFamily', e.target.value),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              fontOptions.map(font =>
                React.createElement('option', { key: font.value, value: font.value }, font.name)
              )
            )
          ),

          // Font Size
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'fontSize', className: 'block text-sm font-medium text-gray-700 mb-2' },
              'Font Size'
            ),
            React.createElement('select', {
              id: 'fontSize',
              value: customization.fontSize,
              onChange: (e) => handleCustomizationChange('fontSize', e.target.value),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              fontSizeOptions.map(size =>
                React.createElement('option', { key: size.value, value: size.value }, size.name)
              )
            )
          )
        )
      ),

      // Theme Customization
      React.createElement(
        'div',
        null,
        React.createElement(
          'h4',
          { className: 'text-md font-medium text-gray-800 mb-3' },
          'Theme'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
          themeOptions.map(theme =>
            React.createElement(
              'div',
              {
                key: theme.value,
                className: `border-2 rounded-lg p-3 cursor-pointer transition-all ${customization.theme === theme.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                  }`
              },
              React.createElement('input', {
                type: 'radio',
                id: `theme-${theme.value}`,
                name: 'theme',
                checked: customization.theme === theme.value,
                onChange: () => handleCustomizationChange('theme', theme.value),
                className: 'h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 float-left mt-1'
              }),
              React.createElement(
                'label',
                {
                  htmlFor: `theme-${theme.value}`,
                  className: 'block text-sm font-medium text-gray-700 ml-6'
                },
                theme.name
              )
            )
          )
        )
      ),

      // Live Preview Section
      React.createElement(
        'div',
        { className: 'border-t pt-6 mt-6' },
        React.createElement(
          'h4',
          { className: 'text-md font-medium text-gray-800 mb-3' },
          'Live Preview'
        ),
        React.createElement(
          'div',
          {
            className: 'p-4 border rounded-lg bg-gray-50',
            style: {
              fontFamily: customization.fontFamily,
              fontSize: customization.fontSize
            }
          },
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement(
              'h5',
              {
                className: 'font-bold',
                style: { color: customization.secondaryColor }
              },
              'Sample Preview Text'
            ),
            React.createElement(
              'p',
              { style: { color: '#374151' } },
              'This is a sample of your biodata with the current customization settings.'
            ),
            React.createElement(
              'div',
              { className: 'flex space-x-2' },
              React.createElement('span', {
                className: 'inline-block px-2 py-1 rounded',
                style: {
                  backgroundColor: customization.primaryColor,
                  color: 'white'
                }
              }, 'Sample Badge')
            )
          )
        )
      )
    )
  );
};

export default TemplateCustomization;