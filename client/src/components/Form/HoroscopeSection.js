import React, { useState, useEffect } from 'react';

const HoroscopeSection = ({ formData, updateFormData }) => {
  const [showHoroscope, setShowHoroscope] = useState(false);
  const [localData, setLocalData] = useState({
    rashi: '',
    nakshatra: '',
    manglik: '',
    timeOfBirth: '',
    placeOfBirth: '',
    gotra: ''
  });

  // Load existing data and show/hide state when component mounts
  useEffect(() => {
    if (formData && formData.horoscopeDetails) {
      setLocalData({
        ...formData.horoscopeDetails
      });
      setShowHoroscope(true); // Show if data exists
    }
  }, [formData]);

  const handleToggle = () => {
    const newState = !showHoroscope;
    setShowHoroscope(newState);
    
    if (!newState) {
      // If hiding, clear the data
      setLocalData({
        rashi: '',
        nakshatra: '',
        manglik: '',
        timeOfBirth: '',
        placeOfBirth: '',
        gotra: ''
      });
      updateFormData({ horoscopeDetails: {} });
    } else {
      // If showing, update with current local data
      updateFormData({ horoscopeDetails: localData });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...localData, [name]: value };
    setLocalData(updatedData);
    updateFormData({ horoscopeDetails: updatedData });
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement('input', {
          type: 'checkbox',
          id: 'showHoroscope',
          checked: showHoroscope,
          onChange: handleToggle,
          className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
        }),
        React.createElement(
          'label',
          { htmlFor: 'showHoroscope', className: 'ml-2 block text-sm font-medium text-gray-700' },
          'Include Horoscope Details'
        )
      )
    ),
    
    showHoroscope && React.createElement(
      'div',
      { className: 'border border-gray-200 rounded-lg p-6 bg-gray-50' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-4' },
        'Horoscope Information'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        // Rashi
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'rashi', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Rashi (Moon Sign)'
          ),
          React.createElement('select', {
            id: 'rashi',
            name: 'rashi',
            value: localData.rashi,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          },
            React.createElement('option', { value: '' }, 'Select Rashi'),
            React.createElement('option', { value: 'Mesh (Aries)' }, 'Mesh (Aries)'),
            React.createElement('option', { value: 'Vrishabh (Taurus)' }, 'Vrishabh (Taurus)'),
            React.createElement('option', { value: 'Mithun (Gemini)' }, 'Mithun (Gemini)'),
            React.createElement('option', { value: 'Karkat (Cancer)' }, 'Karkat (Cancer)'),
            React.createElement('option', { value: 'Simha (Leo)' }, 'Simha (Leo)'),
            React.createElement('option', { value: 'Kanya (Virgo)' }, 'Kanya (Virgo)'),
            React.createElement('option', { value: 'Tula (Libra)' }, 'Tula (Libra)'),
            React.createElement('option', { value: 'Vrishchik (Scorpio)' }, 'Vrishchik (Scorpio)'),
            React.createElement('option', { value: 'Dhanus (Sagittarius)' }, 'Dhanus (Sagittarius)'),
            React.createElement('option', { value: 'Makar (Capricorn)' }, 'Makar (Capricorn)'),
            React.createElement('option', { value: 'Kumbh (Aquarius)' }, 'Kumbh (Aquarius)'),
            React.createElement('option', { value: 'Meen (Pisces)' }, 'Meen (Pisces)')
          )
        ),
        
        // Nakshatra
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'nakshatra', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Nakshatra'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'nakshatra',
            name: 'nakshatra',
            value: localData.nakshatra,
            onChange: handleChange,
            placeholder: 'Enter your Nakshatra',
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        ),
        
        // Manglik
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'manglik', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Manglik Status'
          ),
          React.createElement('select', {
            id: 'manglik',
            name: 'manglik',
            value: localData.manglik,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          },
            React.createElement('option', { value: '' }, 'Select Manglik Status'),
            React.createElement('option', { value: 'Yes' }, 'Yes'),
            React.createElement('option', { value: 'No' }, 'No'),
            React.createElement('option', { value: 'Partial' }, 'Partial')
          )
        ),
        
        // Time of Birth
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'timeOfBirth', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Time of Birth'
          ),
          React.createElement('input', {
            type: 'time',
            id: 'timeOfBirth',
            name: 'timeOfBirth',
            value: localData.timeOfBirth,
            onChange: handleChange,
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        ),
        
        // Place of Birth
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'placeOfBirth', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Place of Birth'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'placeOfBirth',
            name: 'placeOfBirth',
            value: localData.placeOfBirth,
            onChange: handleChange,
            placeholder: 'Enter place of birth',
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        ),
        
        // Gotra
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'gotra', className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Gotra'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'gotra',
            name: 'gotra',
            value: localData.gotra,
            onChange: handleChange,
            placeholder: 'Enter your Gotra',
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          })
        )
      )
    )
  );
};

export default HoroscopeSection;