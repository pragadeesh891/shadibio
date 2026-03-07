import React from 'react';
import { formatDateForInput, calculateAge } from '../../utils/helpers';

const ModernTemplate = ({ biodata, customization = {} }) => {
  const { primaryColor = '#3B82F6', secondaryColor = '#1E40AF', fontFamily = 'Arial, sans-serif' } = customization;

  // Helper function to safely get nested properties
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  };

  // Get privacy settings
  const hidePhone = getNestedValue(biodata, 'privacySettings.hidePhone');
  const hideEmail = getNestedValue(biodata, 'privacySettings.hideEmail');
  const hideIncome = getNestedValue(biodata, 'privacySettings.hideIncome');

  // Get details
  const personalDetails = biodata?.personalDetails || {};
  const familyDetails = biodata?.familyDetails || {};
  const educationDetails = biodata?.educationDetails || {};
  const horoscopeDetails = biodata?.horoscopeDetails || {};

  // Calculate age if not provided
  const age = personalDetails.age || (personalDetails.dateOfBirth ? calculateAge(personalDetails.dateOfBirth) : null);

  const photoUrl = biodata?.profilePhoto || personalDetails?.profilePhoto;

  return React.createElement(
    'div',
    {
      className: 'bg-gradient-to-br from-gray-50 to-gray-100 p-8 max-w-4xl mx-auto rounded-2xl shadow-lg',
      style: { fontFamily: fontFamily }
    },
    // Header
    React.createElement(
      'div',
      {
        className: 'text-center py-6 px-8 rounded-t-2xl',
        style: { backgroundColor: primaryColor, color: 'white' }
      },
      React.createElement(
        'h1',
        {
          className: 'text-3xl font-bold tracking-wide',
          style: { textShadow: '0 2px 4px rgba(0,0,0,0.3)' }
        },
        'MARRIAGE BIO-DATA'
      ),
      React.createElement(
        'div',
        {
          className: 'w-24 h-1 mx-auto mt-2 rounded-full',
          style: { backgroundColor: 'rgba(255,255,255,0.5)' }
        }
      )
    ),

    // Main content
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8 p-8' },
      // Left column - Profile photo and basic info
      React.createElement(
        'div',
        { className: 'lg:col-span-1 flex flex-col items-center' },
        // Profile photo with modern styling
        photoUrl && React.createElement('img', {
          src: photoUrl,
          alt: 'Profile',
          className: 'w-48 h-48 rounded-2xl object-cover shadow-lg border-4 border-white transform transition-transform hover:scale-105'
        }),

        // Personal details
        React.createElement(
          'div',
          { className: 'mt-6 text-center w-full' },
          React.createElement(
            'h2',
            {
              className: 'text-2xl font-bold mb-2',
              style: { color: secondaryColor }
            },
            personalDetails.fullName || 'Name not provided'
          ),
          React.createElement(
            'p',
            { className: 'text-gray-700 mb-4' },
            personalDetails.gender ? `${age ? `${age} years, ` : ''}${personalDetails.gender}` : 'Age and gender not provided'
          ),

          // Contact info cards
          React.createElement(
            'div',
            { className: 'space-y-2' },
            !hidePhone && personalDetails.phone && React.createElement(
              'div',
              {
                className: 'flex items-center justify-center bg-gray-100 rounded-lg p-2',
                style: { borderLeft: `4px solid ${primaryColor}` }
              },
              React.createElement(
                'span',
                { className: 'mr-2 text-gray-600' },
                '📱'
              ),
              React.createElement(
                'span',
                { className: 'text-gray-700 text-sm' },
                personalDetails.phone
              )
            ),
            !hideEmail && personalDetails.email && React.createElement(
              'div',
              {
                className: 'flex items-center justify-center bg-gray-100 rounded-lg p-2',
                style: { borderLeft: `4px solid ${primaryColor}` }
              },
              React.createElement(
                'span',
                { className: 'mr-2 text-gray-600' },
                '✉️'
              ),
              React.createElement(
                'span',
                { className: 'text-gray-700 text-sm' },
                personalDetails.email
              )
            ),
            personalDetails.dateOfBirth && React.createElement(
              'div',
              {
                className: 'flex items-center justify-center bg-gray-100 rounded-lg p-2',
                style: { borderLeft: `4px solid ${primaryColor}` }
              },
              React.createElement(
                'span',
                { className: 'mr-2 text-gray-600' },
                '🎂'
              ),
              React.createElement(
                'span',
                { className: 'text-gray-700 text-sm' },
                formatDateForInput(personalDetails.dateOfBirth)
              )
            )
          )
        )
      ),

      // Right column - Details
      React.createElement(
        'div',
        { className: 'lg:col-span-2 space-y-6' },
        // Personal Information Card
        React.createElement(
          'div',
          {
            className: 'bg-white rounded-xl shadow-md p-6 border-l-4',
            style: { borderLeftColor: primaryColor }
          },
          React.createElement(
            'h3',
            {
              className: 'text-xl font-semibold mb-4 flex items-center',
              style: { color: secondaryColor }
            },
            React.createElement('span', { className: 'mr-2' }, '👤'),
            'Personal Information'
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, 'Marital Status: '),
              React.createElement('span', { className: 'text-gray-600' }, personalDetails.maritalStatus || 'Not specified')
            ),
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, 'Height: '),
              React.createElement(
                'span',
                { className: 'text-gray-600' },
                personalDetails.height?.feet || personalDetails.height?.inches ?
                  `${personalDetails.height.feet}'${personalDetails.height.inches || 0}"` :
                  'Not specified'
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, 'Weight: '),
              React.createElement(
                'span',
                { className: 'text-gray-600' },
                personalDetails.weight ? `${personalDetails.weight} kg` : 'Not specified'
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, 'Blood Group: '),
              React.createElement('span', { className: 'text-gray-600' }, personalDetails.bloodGroup || 'Not specified')
            ),
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, 'Complexion: '),
              React.createElement('span', { className: 'text-gray-600' }, personalDetails.complexion || 'Not specified')
            )
          ),

          // Address
          (personalDetails.address?.street || personalDetails.address?.city || personalDetails.address?.state) && React.createElement(
            'div',
            { className: 'mt-4 pt-4 border-t border-gray-200' },
            React.createElement('span', { className: 'font-medium text-gray-700' }, '📍 Address: '),
            React.createElement(
              'span',
              { className: 'text-gray-600 block mt-1' },
              [
                personalDetails.address?.street,
                personalDetails.address?.city,
                personalDetails.address?.state,
                personalDetails.address?.pincode,
                personalDetails.address?.country
              ].filter(Boolean).join(', ')
            )
          )
        ),

        // Family Information Card
        React.createElement(
          'div',
          {
            className: 'bg-white rounded-xl shadow-md p-6 border-l-4',
            style: { borderLeftColor: primaryColor }
          },
          React.createElement(
            'h3',
            {
              className: 'text-xl font-semibold mb-4 flex items-center',
              style: { color: secondaryColor }
            },
            React.createElement('span', { className: 'mr-2' }, '👨‍👩‍👧‍👦'),
            'Family Information'
          ),
          React.createElement(
            'div',
            { className: 'space-y-4' },
            // Father's Info
            (familyDetails.father?.name || familyDetails.father?.occupation) && React.createElement(
              'div',
              { className: 'flex items-start' },
              React.createElement(
                'div',
                { className: 'mr-3 mt-1' },
                '👨'
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'font-medium text-gray-700' },
                  `Father: ${familyDetails.father?.name || 'Not specified'}`
                ),
                familyDetails.father?.occupation && React.createElement(
                  'div',
                  { className: 'text-gray-600 text-sm' },
                  `${familyDetails.father.occupation}${familyDetails.father.companyName ? ` at ${familyDetails.father.companyName}` : ''}`
                )
              )
            ),

            // Mother's Info
            (familyDetails.mother?.name || familyDetails.mother?.occupation) && React.createElement(
              'div',
              { className: 'flex items-start' },
              React.createElement(
                'div',
                { className: 'mr-3 mt-1' },
                '👩'
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'font-medium text-gray-700' },
                  `Mother: ${familyDetails.mother?.name || 'Not specified'}`
                ),
                familyDetails.mother?.occupation && React.createElement(
                  'div',
                  { className: 'text-gray-600 text-sm' },
                  `${familyDetails.mother.occupation}${familyDetails.mother.companyName ? ` at ${familyDetails.mother.companyName}` : ''}`
                )
              )
            ),

            // Siblings Info
            (familyDetails.siblings?.brothers?.total > 0 || familyDetails.siblings?.sisters?.total > 0) && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '👥 Siblings: '),
              React.createElement(
                'span',
                { className: 'text-gray-600' },
                [
                  familyDetails.siblings?.brothers?.total > 0 ? `${familyDetails.siblings.brothers.total} brother(s)` : null,
                  familyDetails.siblings?.sisters?.total > 0 ? `${familyDetails.siblings.sisters.total} sister(s)` : null
                ].filter(Boolean).join(', ') || 'None'
              )
            ),

            // Family Details
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200' },
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'font-medium text-gray-700' }, '🏠 Family Type: '),
                React.createElement('span', { className: 'text-gray-600 block text-sm' }, familyDetails.familyType || 'Not specified')
              ),
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'font-medium text-gray-700' }, '💼 Family Status: '),
                React.createElement('span', { className: 'text-gray-600 block text-sm' }, familyDetails.familyStatus || 'Not specified')
              ),
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'font-medium text-gray-700' }, '🏛️ Family Values: '),
                React.createElement('span', { className: 'text-gray-600 block text-sm' }, familyDetails.familyValues || 'Not specified')
              )
            ),

            // About Family
            familyDetails.aboutFamily && React.createElement(
              'div',
              { className: 'mt-4 pt-4 border-t border-gray-200' },
              React.createElement('span', { className: 'font-medium text-gray-700' }, '💬 About Family: '),
              React.createElement('span', { className: 'text-gray-600' }, familyDetails.aboutFamily)
            )
          )
        ),

        // Education & Profession Card
        React.createElement(
          'div',
          {
            className: 'bg-white rounded-xl shadow-md p-6 border-l-4',
            style: { borderLeftColor: primaryColor }
          },
          React.createElement(
            'h3',
            {
              className: 'text-xl font-semibold mb-4 flex items-center',
              style: { color: secondaryColor }
            },
            React.createElement('span', { className: 'mr-2' }, '🎓'),
            'Education & Profession'
          ),
          React.createElement(
            'div',
            { className: 'space-y-4' },
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🎓 Education: '),
              React.createElement(
                'span',
                { className: 'text-gray-600 block' },
                [
                  educationDetails.highestEducation,
                  educationDetails.college,
                  educationDetails.specialization
                ].filter(Boolean).join(', ') || 'Not specified'
              )
            ),

            educationDetails.occupation && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '💼 Occupation: '),
              React.createElement(
                'span',
                { className: 'text-gray-600 block' },
                `${educationDetails.occupation}${educationDetails.companyName ? ` at ${educationDetails.companyName}` : ''}`
              )
            ),

            !hideIncome && educationDetails.annualIncome?.amount && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '💰 Annual Income: '),
              React.createElement(
                'span',
                { className: 'text-gray-600 block' },
                new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: educationDetails.annualIncome.currency || 'INR',
                  maximumFractionDigits: 0
                }).format(educationDetails.annualIncome.amount)
              )
            ),

            educationDetails.workLocation && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '📍 Work Location: '),
              React.createElement('span', { className: 'text-gray-600 block' }, educationDetails.workLocation)
            ),

            educationDetails.additionalQualifications?.length > 0 && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🏆 Qualifications: '),
              React.createElement(
                'span',
                { className: 'text-gray-600 block' },
                educationDetails.additionalQualifications.join(', ')
              )
            )
          )
        ),

        // Horoscope Information Card (if available and not hidden)
        horoscopeDetails && Object.keys(horoscopeDetails).some(key => horoscopeDetails[key]) && React.createElement(
          'div',
          {
            className: 'bg-white rounded-xl shadow-md p-6 border-l-4',
            style: { borderLeftColor: primaryColor }
          },
          React.createElement(
            'h3',
            {
              className: 'text-xl font-semibold mb-4 flex items-center',
              style: { color: secondaryColor }
            },
            React.createElement('span', { className: 'mr-2' }, '🔮'),
            'Horoscope Information'
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            horoscopeDetails.rashi && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🌙 Rashi: '),
              React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.rashi)
            ),
            horoscopeDetails.nakshatra && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '⭐ Nakshatra: '),
              React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.nakshatra)
            ),
            horoscopeDetails.manglik && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🪐 Manglik: '),
              React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.manglik)
            ),
            horoscopeDetails.timeOfBirth && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '⏰ Time of Birth: '),
              React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.timeOfBirth)
            ),
            horoscopeDetails.placeOfBirth && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🌍 Place of Birth: '),
              React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.placeOfBirth)
            ),
            horoscopeDetails.gotra && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, ' tộc Gotra: '),
              React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.gotra)
            )
          )
        )
      )
    ),

    // Footer
    React.createElement(
      'div',
      {
        className: 'text-center py-4 px-8 rounded-b-2xl',
        style: { backgroundColor: secondaryColor, color: 'white' }
      },
      React.createElement(
        'p',
        { className: 'text-sm' },
        'Generated by ShadiBio - Professional Marriage Biodata Platform'
      )
    )
  );
};

export default ModernTemplate;