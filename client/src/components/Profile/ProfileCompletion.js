import React, { useState, useEffect } from 'react';

const ProfileCompletion = ({ formData }) => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completionDetails, setCompletionDetails] = useState({
    personalDetails: 0,
    familyDetails: 0,
    educationDetails: 0,
    profilePhoto: 0,
    horoscopeDetails: 0
  });

  const calculateCompletion = (data) => {
    const details = {
      personalDetails: 0,
      familyDetails: 0,
      educationDetails: 0,
      profilePhoto: 0,
      horoscopeDetails: 0
    };

    const personalData = data?.personalDetails || {};
    const familyData = data?.familyDetails || {};
    const educationData = data?.educationDetails || {};
    const horoscopeData = data?.horoscopeDetails || {};

    // Personal Details (30% weight)
    const personalFields = [
      personalData.fullName,
      personalData.dateOfBirth,
      personalData.gender,
      personalData.phone,
      personalData.email
    ];
    const personalComplete = personalFields.filter(Boolean).length;
    details.personalDetails = (personalComplete / personalFields.length) * 30;

    // Family Details (25% weight)
    const familyFields = [
      familyData.father?.name,
      familyData.mother?.name,
      familyData.familyType,
      familyData.familyStatus,
      familyData.familyValues
    ];
    const familyComplete = familyFields.filter(Boolean).length;
    details.familyDetails = (familyComplete / familyFields.length) * 25;

    // Education Details (25% weight)
    const educationFields = [
      educationData.highestEducation,
      educationData.occupation,
      educationData.companyName,
      educationData.workLocation
    ];
    const educationComplete = educationFields.filter(Boolean).length;
    details.educationDetails = (educationComplete / educationFields.length) * 25;

    // Profile Photo (10% weight)
    details.profilePhoto = personalData.profilePhoto ? 10 : 0;

    // Horoscope Details (10% weight)
    const horoscopeFields = [
      horoscopeData.rashi,
      horoscopeData.nakshatra,
      horoscopeData.manglik
    ];
    const horoscopeComplete = horoscopeFields.filter(Boolean).length;
    details.horoscopeDetails = (horoscopeComplete / horoscopeFields.length) * 10;

    // Calculate total percentage
    const total = Object.values(details).reduce((sum, value) => sum + value, 0);
    const percentage = Math.round(total);

    return { percentage, details };
  };

  useEffect(() => {
    const { percentage, details } = calculateCompletion(formData);
    setCompletionPercentage(percentage);
    setCompletionDetails(details);
  }, [formData]);

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionText = (percentage) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 75) return 'Great!';
    if (percentage >= 50) return 'Good';
    if (percentage >= 25) return 'Needs improvement';
    return 'Incomplete';
  };

  return React.createElement(
    'div',
    { className: 'bg-white rounded-lg shadow-md p-6 border border-gray-200' },
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center mb-2' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900' },
          'Profile Completion'
        ),
        React.createElement(
          'span',
          { 
            className: `px-3 py-1 rounded-full text-sm font-medium ${
              completionPercentage >= 80 ? 'bg-green-100 text-green-800' :
              completionPercentage >= 60 ? 'bg-blue-100 text-blue-800' :
              completionPercentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`
          },
          `${completionPercentage}% ${getCompletionText(completionPercentage)}`
        )
      ),
      React.createElement(
        'div',
        { className: 'w-full bg-gray-200 rounded-full h-3' },
        React.createElement('div', {
          className: `h-3 rounded-full transition-all duration-500 ease-in-out ${getCompletionColor(completionPercentage)}`,
          style: { width: `${completionPercentage}%` }
        })
      )
    ),

    React.createElement(
      'div',
      { className: 'space-y-4' },
      // Personal Details Progress
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'flex justify-between items-center mb-1' },
          React.createElement(
            'span',
            { className: 'text-sm font-medium text-gray-700' },
            'Personal Information'
          ),
          React.createElement(
            'span',
            { className: 'text-sm text-gray-500' },
            `${Math.round(completionDetails.personalDetails / 30 * 100)}%`
          )
        ),
        React.createElement(
          'div',
          { className: 'w-full bg-gray-200 rounded-full h-2' },
          React.createElement('div', {
            className: 'bg-blue-500 h-2 rounded-full',
            style: { width: `${completionDetails.personalDetails / 30 * 100}%` }
          })
        )
      ),

      // Family Details Progress
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'flex justify-between items-center mb-1' },
          React.createElement(
            'span',
            { className: 'text-sm font-medium text-gray-700' },
            'Family Information'
          ),
          React.createElement(
            'span',
            { className: 'text-sm text-gray-500' },
            `${Math.round(completionDetails.familyDetails / 25 * 100)}%`
          )
        ),
        React.createElement(
          'div',
          { className: 'w-full bg-gray-200 rounded-full h-2' },
          React.createElement('div', {
            className: 'bg-green-500 h-2 rounded-full',
            style: { width: `${completionDetails.familyDetails / 25 * 100}%` }
          })
        )
      ),

      // Education Details Progress
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'flex justify-between items-center mb-1' },
          React.createElement(
            'span',
            { className: 'text-sm font-medium text-gray-700' },
            'Education & Profession'
          ),
          React.createElement(
            'span',
            { className: 'text-sm text-gray-500' },
            `${Math.round(completionDetails.educationDetails / 25 * 100)}%`
          )
        ),
        React.createElement(
          'div',
          { className: 'w-full bg-gray-200 rounded-full h-2' },
          React.createElement('div', {
            className: 'bg-purple-500 h-2 rounded-full',
            style: { width: `${completionDetails.educationDetails / 25 * 100}%` }
          })
        )
      ),

      // Additional Sections
      React.createElement(
        'div',
        { className: 'grid grid-cols-2 gap-4 pt-2' },
        React.createElement(
          'div',
          { className: 'flex items-center' },
          React.createElement('span', { className: 'text-sm text-gray-600 mr-2' }, '📷'),
          React.createElement(
            'span',
            { className: 'text-sm font-medium' },
            `Profile Photo: ${completionDetails.profilePhoto > 0 ? 'Complete' : 'Missing'}`
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center' },
          React.createElement('span', { className: 'text-sm text-gray-600 mr-2' }, '🔮'),
          React.createElement(
            'span',
            { className: 'text-sm font-medium' },
            `Horoscope: ${completionDetails.horoscopeDetails > 0 ? 'Complete' : 'Optional'}`
          )
        )
      )
    ),

    // Suggestions for improvement
    completionPercentage < 100 && React.createElement(
      'div',
      { className: 'mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200' },
      React.createElement(
        'div',
        { className: 'flex items-start' },
        React.createElement('span', { className: 'text-blue-500 mr-2 mt-0.5' }, '💡'),
        React.createElement(
          'div',
          null,
          React.createElement(
            'h4',
            { className: 'text-sm font-medium text-blue-800' },
            'Improve Your Profile'
          ),
          React.createElement(
            'ul',
            { className: 'mt-2 text-sm text-blue-700 list-disc list-inside space-y-1' },
            completionDetails.personalDetails < 30 && React.createElement('li', null, 'Complete your personal information'),
            completionDetails.familyDetails < 25 && React.createElement('li', null, 'Add complete family details'),
            completionDetails.educationDetails < 25 && React.createElement('li', null, 'Fill in education and profession details'),
            completionDetails.profilePhoto === 0 && React.createElement('li', null, 'Upload a profile photo'),
            completionPercentage < 90 && React.createElement('li', null, 'Add more details to increase your profile completeness')
          )
        )
      )
    )
  );
};

export default ProfileCompletion;