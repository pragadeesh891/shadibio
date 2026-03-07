import React, { useState, useEffect } from 'react';

const TemplateSelection = ({ formData, updateFormData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(formData?.templateSelected || 'Traditional');
  const [customization, setCustomization] = useState({
    primaryColor: '#3B82F6', // Default blue
    secondaryColor: '#1E40AF', // Default dark blue
    fontFamily: 'Arial, sans-serif'
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (formData) {
      if (formData.templateSelected) {
        setSelectedTemplate(formData.templateSelected);
      }
      if (formData.customization) {
        setCustomization({
          ...customization,
          ...formData.customization
        });
      }
    }
  }, [formData]);

  const handleTemplateChange = (templateName) => {
    setSelectedTemplate(templateName);
    updateFormData({
      templateSelected: templateName,
      customization: customization
    });
  };

  const handleCustomizationChange = (property, value) => {
    const newCustomization = {
      ...customization,
      [property]: value
    };
    setCustomization(newCustomization);

    // Update form data with both template and customization
    updateFormData({
      templateSelected: selectedTemplate,
      customization: newCustomization
    });
  };

  // Color options for customization
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' }
  ];

  // Font options for customization
  const fontOptions = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Courier New', value: '"Courier New", monospace' }
  ];

  return React.createElement(
    'div',
    { className: 'glass rounded-[2rem] shadow-2xl-custom p-8 border border-white/20' },
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-4' },
        'Select Template'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        // Traditional Template Option
        React.createElement(
          'div',
          {
            className: `border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === 'Traditional'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
              }`,
            onClick: () => handleTemplateChange('Traditional')
          },
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement('input', {
              type: 'radio',
              id: 'traditional',
              name: 'template',
              checked: selectedTemplate === 'Traditional',
              onChange: () => { },
              className: 'h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500'
            }),
            React.createElement(
              'label',
              { htmlFor: 'traditional', className: 'ml-3 block text-sm font-medium text-gray-700' },
              'Traditional Template'
            )
          ),
          React.createElement(
            'p',
            { className: 'mt-2 text-sm text-gray-500 ml-7' },
            'Classic and elegant design suitable for traditional families'
          )
        ),

        // Modern Template Option
        React.createElement(
          'div',
          {
            className: `border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === 'Modern'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
              }`,
            onClick: () => handleTemplateChange('Modern')
          },
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement('input', {
              type: 'radio',
              id: 'modern',
              name: 'template',
              checked: selectedTemplate === 'Modern',
              onChange: () => { },
              className: 'h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500'
            }),
            React.createElement(
              'label',
              { htmlFor: 'modern', className: 'ml-3 block text-sm font-medium text-gray-700' },
              'Modern Template'
            )
          ),
          React.createElement(
            'p',
            { className: 'mt-2 text-sm text-gray-500 ml-7' },
            'Contemporary and clean design for modern preferences'
          )
        )
      )
    ),

    // Customization Options
    React.createElement(
      'div',
      { className: 'border-t pt-6' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-4' },
        'Customize Appearance'
      ),
      React.createElement(
        'div',
        { className: 'space-y-6' },
        // Primary Color Selection
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
            { className: 'flex flex-wrap gap-2' },
            colorOptions.map(color =>
              React.createElement(
                'button',
                {
                  key: color.value,
                  type: 'button',
                  onClick: () => handleCustomizationChange('primaryColor', color.value),
                  className: `w-8 h-8 rounded-full border-2 ${customization.primaryColor === color.value
                      ? 'border-gray-800 ring-2 ring-offset-2 ring-indigo-500'
                      : 'border-gray-300'
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
            className: 'mt-2 w-12 h-10 rounded border border-gray-300'
          })
        ),

        // Secondary Color Selection
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
            { className: 'flex flex-wrap gap-2' },
            colorOptions.map(color =>
              React.createElement(
                'button',
                {
                  key: color.value,
                  type: 'button',
                  onClick: () => handleCustomizationChange('secondaryColor', color.value),
                  className: `w-8 h-8 rounded-full border-2 ${customization.secondaryColor === color.value
                      ? 'border-gray-800 ring-2 ring-offset-2 ring-indigo-500'
                      : 'border-gray-300'
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
            className: 'mt-2 w-12 h-10 rounded border border-gray-300'
          })
        ),

        // Font Selection
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
        )
      )
    )
  );
};

export default TemplateSelection;