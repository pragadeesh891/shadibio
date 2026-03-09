import React, { useState, useEffect } from 'react';

const FamilyDetailsForm = ({ formData, updateFormData }) => {
  const [localData, setLocalData] = useState({
    father: {
      name: '',
      occupation: '',
      companyName: ''
    },
    mother: {
      name: '',
      occupation: '',
      companyName: ''
    },
    siblings: {
      brothers: {
        total: 0,
        married: 0
      },
      sisters: {
        total: 0,
        married: 0
      }
    },
    familyType: 'Nuclear',
    familyStatus: 'Middle Class',
    familyValues: 'Traditional',
    aboutFamily: ''
  });

  const [hasHydrated, setHasHydrated] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    if (formData?.familyDetails && !hasHydrated) {
      setLocalData(prev => ({
        ...prev,
        ...formData.familyDetails,
        father: { ...prev.father, ...(formData.familyDetails.father || {}) },
        mother: { ...prev.mother, ...(formData.familyDetails.mother || {}) },
        siblings: {
          brothers: { ...prev.siblings.brothers, ...(formData.familyDetails.siblings?.brothers || {}) },
          sisters: { ...prev.siblings.sisters, ...(formData.familyDetails.siblings?.sisters || {}) }
        }
      }));
      setHasHydrated(true);
    }
  }, [formData, hasHydrated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...localData };

    if (name.includes('.')) {
      const parts = name.split('.');

      if (parts.length === 2) {
        const [parent, child] = parts;
        updatedData[parent] = { ...updatedData[parent], [child]: value };
      } else if (parts.length === 3) {
        const [p1, p2, p3] = parts;
        updatedData[p1] = {
          ...updatedData[p1],
          [p2]: {
            ...updatedData[p1][p2],
            [p3]: name.includes('total') || name.includes('married') ? (parseInt(value) || 0) : value
          }
        };
      }
    } else {
      updatedData = { ...localData, [name]: value };
    }

    setLocalData(updatedData);
    updateFormData({ familyDetails: updatedData });
  };

  const handleAboutChange = (e) => {
    const updatedData = { ...localData, aboutFamily: e.target.value };
    setLocalData(updatedData);
    updateFormData({ familyDetails: updatedData });
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'space-y-8' },
      // Father's Details
      React.createElement(
        'div',
        { className: 'border-b border-gray-200 pb-8' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-4' },
          'Father\'s Information'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          // Father's Name
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'father.name', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Father\'s Name *'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'father.name',
              name: 'father.name',
              value: localData.father.name,
              onChange: handleChange,
              required: true,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),

          // Father's Occupation
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'father.occupation', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Father\'s Occupation'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'father.occupation',
              name: 'father.occupation',
              value: localData.father.occupation,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),

          // Father's Company
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'father.companyName', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Company Name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'father.companyName',
              name: 'father.companyName',
              value: localData.father.companyName,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          )
        )
      ),

      // Mother's Details
      React.createElement(
        'div',
        { className: 'border-b border-gray-200 pb-8' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-4' },
          'Mother\'s Information'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          // Mother's Name
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'mother.name', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Mother\'s Name *'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'mother.name',
              name: 'mother.name',
              value: localData.mother.name,
              onChange: handleChange,
              required: true,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),

          // Mother's Occupation
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'mother.occupation', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Mother\'s Occupation'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'mother.occupation',
              name: 'mother.occupation',
              value: localData.mother.occupation,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),

          // Mother's Company
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'mother.companyName', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Company Name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'mother.companyName',
              name: 'mother.companyName',
              value: localData.mother.companyName,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          )
        )
      ),

      // Siblings Information
      React.createElement(
        'div',
        { className: 'border-b border-gray-200 pb-8' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-4' },
          'Sibling Information'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
          // Brothers
          React.createElement(
            'div',
            null,
            React.createElement(
              'h4',
              { className: 'text-md font-medium text-gray-800 mb-3' },
              'Brothers'
            ),
            React.createElement(
              'div',
              { className: 'space-y-4' },
              // Total Brothers
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'siblings.brothers.total', className: 'block text-sm font-medium text-gray-700 mb-1' },
                  'Total Brothers'
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'siblings.brothers.total',
                  name: 'siblings.brothers.total',
                  value: localData.siblings.brothers.total,
                  onChange: handleChange,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  className: 'w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                })
              ),

              // Married Brothers
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'siblings.brothers.married', className: 'block text-sm font-medium text-gray-700 mb-1' },
                  'Married Brothers'
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'siblings.brothers.married',
                  name: 'siblings.brothers.married',
                  value: localData.siblings.brothers.married,
                  onChange: handleChange,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  className: 'w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                })
              )
            )
          ),

          // Sisters
          React.createElement(
            'div',
            null,
            React.createElement(
              'h4',
              { className: 'text-md font-medium text-gray-800 mb-3' },
              'Sisters'
            ),
            React.createElement(
              'div',
              { className: 'space-y-4' },
              // Total Sisters
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'siblings.sisters.total', className: 'block text-sm font-medium text-gray-700 mb-1' },
                  'Total Sisters'
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'siblings.sisters.total',
                  name: 'siblings.sisters.total',
                  value: localData.siblings.sisters.total,
                  onChange: handleChange,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  className: 'w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                })
              ),

              // Married Sisters
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'siblings.sisters.married', className: 'block text-sm font-medium text-gray-700 mb-1' },
                  'Married Sisters'
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'siblings.sisters.married',
                  name: 'siblings.sisters.married',
                  value: localData.siblings.sisters.married,
                  onChange: handleChange,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  className: 'w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                })
              )
            )
          )
        )
      ),

      // Family Information
      React.createElement(
        'div',
        { className: 'space-y-6' },
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          // Family Type
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'familyType', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Family Type'
            ),
            React.createElement('select', {
              id: 'familyType',
              name: 'familyType',
              value: localData.familyType,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              React.createElement('option', { value: 'Nuclear' }, 'Nuclear'),
              React.createElement('option', { value: 'Joint' }, 'Joint'),
              React.createElement('option', { value: 'Extended' }, 'Extended')
            )
          ),

          // Family Status
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'familyStatus', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Family Status'
            ),
            React.createElement('select', {
              id: 'familyStatus',
              name: 'familyStatus',
              value: localData.familyStatus,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              React.createElement('option', { value: 'Middle Class' }, 'Middle Class'),
              React.createElement('option', { value: 'Upper Middle Class' }, 'Upper Middle Class'),
              React.createElement('option', { value: 'High Class' }, 'High Class'),
              React.createElement('option', { value: 'Rich' }, 'Rich')
            )
          ),

          // Family Values
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'familyValues', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Family Values'
            ),
            React.createElement('select', {
              id: 'familyValues',
              name: 'familyValues',
              value: localData.familyValues,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              React.createElement('option', { value: 'Traditional' }, 'Traditional'),
              React.createElement('option', { value: 'Orthodox' }, 'Orthodox'),
              React.createElement('option', { value: 'Liberal' }, 'Liberal'),
              React.createElement('option', { value: 'Moderate' }, 'Moderate')
            )
          )
        ),

        // About Family
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'aboutFamily', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'About Your Family'
          ),
          React.createElement('textarea', {
            id: 'aboutFamily',
            name: 'aboutFamily',
            rows: '4',
            value: localData.aboutFamily,
            onChange: handleAboutChange,
            placeholder: 'Describe your family background...',
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        )
      )
    )
  );
};

export default FamilyDetailsForm;