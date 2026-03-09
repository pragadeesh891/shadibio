import React, { useState, useEffect } from 'react';

const EducationProfessionForm = ({ formData, updateFormData }) => {
  const [localData, setLocalData] = useState({
    highestEducation: '',
    college: '',
    specialization: '',
    additionalQualifications: [],
    occupation: '',
    companyName: '',
    annualIncome: {
      amount: '',
      currency: 'INR'
    },
    workLocation: ''
  });

  // Load data once when available, but avoid overwriting active typing
  useEffect(() => {
    if (formData && formData.educationDetails) {
      // Only auto-fill if the main fields are still empty (initial load)
      const isInitialLoad = !localData.highestEducation && !localData.occupation;
      if (isInitialLoad) {
        setLocalData(prev => ({
          ...prev,
          ...formData.educationDetails,
          annualIncome: {
            amount: formData.educationDetails.annualIncome?.amount || '',
            currency: formData.educationDetails.annualIncome?.currency || 'INR'
          }
        }));
      }
    }
  }, [formData, localData.highestEducation, localData.occupation]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes('.')) {
      const parts = name.split('.');

      if (parts[0] === 'annualIncome') {
        const field = parts[1];
        const updatedAnnualIncome = { ...localData.annualIncome, [field]: value };
        const updatedData = { ...localData, annualIncome: updatedAnnualIncome };

        setLocalData(updatedData);
        updateFormData({ educationDetails: updatedData });
      } else {
        const updatedData = { ...localData, [name]: value };

        setLocalData(updatedData);
        updateFormData({ educationDetails: updatedData });
      }
    } else {
      // Handle top-level fields
      const updatedData = { ...localData, [name]: value };

      setLocalData(updatedData);
      updateFormData({ educationDetails: updatedData });
    }
  };

  const handleQualificationsChange = (e) => {
    const qualification = e.target.value;
    const updatedQualifications = [...localData.additionalQualifications];

    if (e.target.checked) {
      if (!updatedQualifications.includes(qualification)) {
        updatedQualifications.push(qualification);
      }
    } else {
      const index = updatedQualifications.indexOf(qualification);
      if (index > -1) {
        updatedQualifications.splice(index, 1);
      }
    }

    const updatedData = { ...localData, additionalQualifications: updatedQualifications };
    setLocalData(updatedData);
    updateFormData({ educationDetails: updatedData });
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'space-y-8' },
      // Education Information
      React.createElement(
        'div',
        { className: 'border-b border-gray-200 pb-8' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-4' },
          'Educational Information'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          // Highest Education
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'highestEducation', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Highest Education *'
            ),
            React.createElement('select', {
              id: 'highestEducation',
              name: 'highestEducation',
              value: localData.highestEducation,
              onChange: handleChange,
              required: true,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              React.createElement('option', { value: '' }, 'Select Education Level'),
              React.createElement('option', { value: 'High School' }, 'High School'),
              React.createElement('option', { value: 'Bachelor Degree' }, 'Bachelor Degree'),
              React.createElement('option', { value: 'Master Degree' }, 'Master Degree'),
              React.createElement('option', { value: 'Doctorate' }, 'Doctorate'),
              React.createElement('option', { value: 'Diploma' }, 'Diploma'),
              React.createElement('option', { value: 'Professional Degree' }, 'Professional Degree'),
              React.createElement('option', { value: 'Other' }, 'Other')
            )
          ),

          // College/University
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'college', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'College/University'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'college',
              name: 'college',
              value: localData.college,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),

          // Specialization/Major
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'specialization', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Specialization/Major'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'specialization',
              name: 'specialization',
              value: localData.specialization,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          )
        ),

        // Additional Qualifications
        React.createElement(
          'div',
          { className: 'mt-6' },
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-2' },
            'Additional Qualifications'
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 md:grid-cols-3 gap-4' },
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                id: 'certification1',
                value: 'Certified Public Accountant (CPA)',
                checked: localData.additionalQualifications.includes('Certified Public Accountant (CPA)'),
                onChange: handleQualificationsChange,
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement(
                'label',
                { htmlFor: 'certification1', className: 'ml-2 block text-sm text-gray-900' },
                'CPA'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                id: 'certification2',
                value: 'Project Management Professional (PMP)',
                checked: localData.additionalQualifications.includes('Project Management Professional (PMP)'),
                onChange: handleQualificationsChange,
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement(
                'label',
                { htmlFor: 'certification2', className: 'ml-2 block text-sm text-gray-900' },
                'PMP'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                id: 'certification3',
                value: 'Chartered Financial Analyst (CFA)',
                checked: localData.additionalQualifications.includes('Chartered Financial Analyst (CFA)'),
                onChange: handleQualificationsChange,
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement(
                'label',
                { htmlFor: 'certification3', className: 'ml-2 block text-sm text-gray-900' },
                'CFA'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                id: 'certification4',
                value: 'Six Sigma Certification',
                checked: localData.additionalQualifications.includes('Six Sigma Certification'),
                onChange: handleQualificationsChange,
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement(
                'label',
                { htmlFor: 'certification4', className: 'ml-2 block text-sm text-gray-900' },
                'Six Sigma'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                id: 'certification5',
                value: 'Digital Marketing Certification',
                checked: localData.additionalQualifications.includes('Digital Marketing Certification'),
                onChange: handleQualificationsChange,
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement(
                'label',
                { htmlFor: 'certification5', className: 'ml-2 block text-sm text-gray-900' },
                'Digital Marketing'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                id: 'certification6',
                value: 'Other',
                checked: localData.additionalQualifications.includes('Other'),
                onChange: handleQualificationsChange,
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement(
                'label',
                { htmlFor: 'certification6', className: 'ml-2 block text-sm text-gray-900' },
                'Other'
              )
            )
          )
        )
      ),

      // Profession Information
      React.createElement(
        'div',
        { className: 'border-b border-gray-200 pb-8' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-4' },
          'Professional Information'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          // Occupation
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'occupation', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Occupation *'
            ),
            React.createElement('select', {
              id: 'occupation',
              name: 'occupation',
              value: localData.occupation,
              onChange: handleChange,
              required: true,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            },
              React.createElement('option', { value: '' }, 'Select Occupation'),
              React.createElement('option', { value: 'Software Engineer' }, 'Software Engineer'),
              React.createElement('option', { value: 'Doctor' }, 'Doctor'),
              React.createElement('option', { value: 'Engineer' }, 'Engineer'),
              React.createElement('option', { value: 'Teacher' }, 'Teacher'),
              React.createElement('option', { value: 'Business Owner' }, 'Business Owner'),
              React.createElement('option', { value: 'Manager' }, 'Manager'),
              React.createElement('option', { value: 'Consultant' }, 'Consultant'),
              React.createElement('option', { value: 'Lawyer' }, 'Lawyer'),
              React.createElement('option', { value: 'Accountant' }, 'Accountant'),
              React.createElement('option', { value: 'Banker' }, 'Banker'),
              React.createElement('option', { value: 'Other' }, 'Other')
            )
          ),

          // Company Name
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'companyName', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Company Name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'companyName',
              name: 'companyName',
              value: localData.companyName,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),

          // Annual Income
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'annualIncome.amount', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Annual Income'
            ),
            React.createElement(
              'div',
              { className: 'flex space-x-2' },
              React.createElement('select', {
                id: 'annualIncome.currency',
                name: 'annualIncome.currency',
                value: localData.annualIncome.currency,
                onChange: handleChange,
                className: 'w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              },
                React.createElement('option', { value: 'INR' }, 'INR'),
                React.createElement('option', { value: 'USD' }, 'USD'),
                React.createElement('option', { value: 'EUR' }, 'EUR'),
                React.createElement('option', { value: 'GBP' }, 'GBP')
              ),
              React.createElement('input', {
                type: 'number',
                id: 'annualIncome.amount',
                name: 'annualIncome.amount',
                value: localData.annualIncome.amount,
                onChange: handleChange,
                min: '0',
                className: 'flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              })
            )
          ),

          // Work Location
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'workLocation', className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Work Location'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'workLocation',
              name: 'workLocation',
              value: localData.workLocation,
              onChange: handleChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            })
          )
        )
      )
    )
  );
};

export default EducationProfessionForm;