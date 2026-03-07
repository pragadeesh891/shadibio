import React, { useState, useEffect } from 'react';
import { calculateAge } from '../../utils/helpers';

const PersonalDetailsForm = ({ formData, updateFormData }) => {
  const [localData, setLocalData] = useState({
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    maritalStatus: 'Never Married',
    height: { feet: '', inches: '' },
    weight: '',
    bloodGroup: '',
    complexion: ''
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (formData && formData.personalDetails) {
      setLocalData({
        ...localData,
        ...formData.personalDetails,
        dateOfBirth: formData.personalDetails.dateOfBirth || '',
        age: formData.personalDetails.age || ''
      });
    }
  }, [formData]);

  // Calculate age when date of birth changes
  useEffect(() => {
    if (localData.dateOfBirth) {
      const age = calculateAge(localData.dateOfBirth);
      if (age !== null) {
        const updatedData = { ...localData, age };
        setLocalData(updatedData);
        updateFormData({ personalDetails: updatedData });
      }
    }
  }, [localData.dateOfBirth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      const updatedAddress = { ...localData.address, [field]: value };
      const updatedData = { ...localData, address: updatedAddress };
      
      setLocalData(updatedData);
      updateFormData({ personalDetails: updatedData });
    } else {
      const updatedData = { ...localData, [name]: value };
      
      setLocalData(updatedData);
      updateFormData({ personalDetails: updatedData });
    }
  };

  const handleHeightChange = (e) => {
    const { name, value } = e.target;
    const updatedHeight = { ...localData.height, [name]: value };
    const updatedData = { ...localData, height: updatedHeight };
    
    setLocalData(updatedData);
    updateFormData({ personalDetails: updatedData });
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
      // Full Name
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'fullName', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Full Name *'
        ),
        React.createElement('input', {
          type: 'text',
          id: 'fullName',
          name: 'fullName',
          value: localData.fullName,
          onChange: handleChange,
          required: true,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        })
      ),
      
      // Date of Birth
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'dateOfBirth', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Date of Birth *'
        ),
        React.createElement('input', {
          type: 'date',
          id: 'dateOfBirth',
          name: 'dateOfBirth',
          value: localData.dateOfBirth,
          onChange: handleChange,
          required: true,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        }),
        localData.age && React.createElement(
          'p',
          { className: 'mt-1 text-sm text-gray-600' },
          `Calculated Age: ${localData.age} years`
        )
      ),
      
      // Gender
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'gender', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Gender *'
        ),
        React.createElement('select', {
          id: 'gender',
          name: 'gender',
          value: localData.gender,
          onChange: handleChange,
          required: true,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        },
          React.createElement('option', { value: '' }, 'Select Gender'),
          React.createElement('option', { value: 'Male' }, 'Male'),
          React.createElement('option', { value: 'Female' }, 'Female')
        )
      ),
      
      // Phone
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'phone', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Phone Number *'
        ),
        React.createElement('input', {
          type: 'tel',
          id: 'phone',
          name: 'phone',
          value: localData.phone,
          onChange: handleChange,
          required: true,
          placeholder: 'e.g., 9876543210',
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        })
      ),
      
      // Email
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'email', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Email Address *'
        ),
        React.createElement('input', {
          type: 'email',
          id: 'email',
          name: 'email',
          value: localData.email,
          onChange: handleChange,
          required: true,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        })
      ),
      
      // Marital Status
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'maritalStatus', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Marital Status'
        ),
        React.createElement('select', {
          id: 'maritalStatus',
          name: 'maritalStatus',
          value: localData.maritalStatus,
          onChange: handleChange,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        },
          React.createElement('option', { value: 'Never Married' }, 'Never Married'),
          React.createElement('option', { value: 'Divorced' }, 'Divorced'),
          React.createElement('option', { value: 'Widowed' }, 'Widowed'),
          React.createElement('option', { value: 'Awaiting Divorce' }, 'Awaiting Divorce')
        )
      ),
      
      // Height (Feet)
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'feet', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Height (Feet)'
        ),
        React.createElement('input', {
          type: 'number',
          id: 'feet',
          name: 'feet',
          value: localData.height.feet,
          onChange: handleHeightChange,
          min: '0',
          max: '8',
          step: '0.1',
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        })
      ),
      
      // Height (Inches)
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'inches', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Height (Inches)'
        ),
        React.createElement('input', {
          type: 'number',
          id: 'inches',
          name: 'inches',
          value: localData.height.inches,
          onChange: handleHeightChange,
          min: '0',
          max: '11',
          step: '0.1',
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        })
      ),
      
      // Weight
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'weight', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Weight (kg)'
        ),
        React.createElement('input', {
          type: 'number',
          id: 'weight',
          name: 'weight',
          value: localData.weight,
          onChange: handleChange,
          min: '30',
          max: '200',
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        })
      ),
      
      // Blood Group
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'bloodGroup', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Blood Group'
        ),
        React.createElement('select', {
          id: 'bloodGroup',
          name: 'bloodGroup',
          value: localData.bloodGroup,
          onChange: handleChange,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        },
          React.createElement('option', { value: '' }, 'Select Blood Group'),
          React.createElement('option', { value: 'A+' }, 'A+'),
          React.createElement('option', { value: 'A-' }, 'A-'),
          React.createElement('option', { value: 'B+' }, 'B+'),
          React.createElement('option', { value: 'B-' }, 'B-'),
          React.createElement('option', { value: 'AB+' }, 'AB+'),
          React.createElement('option', { value: 'AB-' }, 'AB-'),
          React.createElement('option', { value: 'O+' }, 'O+'),
          React.createElement('option', { value: 'O-' }, 'O-')
        )
      ),
      
      // Complexion
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { htmlFor: 'complexion', className: 'block text-sm font-medium text-gray-700 mb-1' },
          'Complexion'
        ),
        React.createElement('select', {
          id: 'complexion',
          name: 'complexion',
          value: localData.complexion,
          onChange: handleChange,
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        },
          React.createElement('option', { value: '' }, 'Select Complexion'),
          React.createElement('option', { value: 'Very Fair' }, 'Very Fair'),
          React.createElement('option', { value: 'Fair' }, 'Fair'),
          React.createElement('option', { value: 'Wheatish' }, 'Wheatish'),
          React.createElement('option', { value: 'Wheatish Brown' }, 'Wheatish Brown'),
          React.createElement('option', { value: 'Dark' }, 'Dark')
        )
      )
    ),
    
    // Address Section
    React.createElement(
      'div',
      { className: 'mt-8' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-4' },
        'Address Information'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        // Street
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'address.street', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Street Address'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'address.street',
            name: 'address.street',
            value: localData.address.street,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        ),
        
        // City
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'address.city', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'City'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'address.city',
            name: 'address.city',
            value: localData.address.city,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        ),
        
        // State
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'address.state', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'State'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'address.state',
            name: 'address.state',
            value: localData.address.state,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        ),
        
        // Pincode
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'address.pincode', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Pincode'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'address.pincode',
            name: 'address.pincode',
            value: localData.address.pincode,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        )
      )
    )
  );
};

export default PersonalDetailsForm;