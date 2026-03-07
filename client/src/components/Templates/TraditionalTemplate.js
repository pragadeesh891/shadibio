import React from 'react';
import { formatDateForInput, calculateAge } from '../../utils/helpers';

const TraditionalTemplate = ({ biodata, customization = {} }) => {
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
      className: 'bg-white p-8 max-w-4xl mx-auto border-8 border-gray-800',
      style: { fontFamily: fontFamily }
    },
    // Header with decorative elements
    React.createElement(
      'div',
      { className: 'border-b-4 border-gray-800 pb-4 mb-6 text-center' },
      React.createElement(
        'div',
        { className: 'flex justify-center mb-2' },
        React.createElement(
          'div',
          {
            className: 'w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center mr-4',
            style: { borderColor: secondaryColor }
          },
          React.createElement(
            'div',
            {
              className: 'w-12 h-12 rounded-full border-4 border-gray-500',
              style: { borderColor: primaryColor }
            }
          )
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col items-center' },
          React.createElement(
            'h1',
            {
              className: 'text-3xl font-bold text-center',
              style: { color: secondaryColor }
            },
            'MARRIAGE BIO-DATA'
          ),
          React.createElement(
            'div',
            {
              className: 'w-24 h-0.5 bg-gray-600 mt-1',
              style: { backgroundColor: primaryColor }
            }
          )
        ),
        React.createElement(
          'div',
          {
            className: 'w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center ml-4',
            style: { borderColor: secondaryColor }
          },
          React.createElement(
            'div',
            {
              className: 'w-12 h-12 rounded-full border-4 border-gray-500',
              style: { borderColor: primaryColor }
            }
          )
        )
      )
    ),

    // Main content
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
      // Left column - Profile photo and basic info
      React.createElement(
        'div',
        { className: 'lg:col-span-1' },
        // Profile photo
        photoUrl && React.createElement('img', {
          src: photoUrl,
          alt: 'Profile',
          className: 'w-48 h-48 rounded-full mx-auto object-cover border-4 border-gray-300'
        }),

        // Personal details
        React.createElement(
          'div',
          { className: 'mt-4 text-center' },
          React.createElement(
            'h2',
            {
              className: 'text-xl font-bold',
              style: { color: secondaryColor }
            },
            personalDetails.fullName || 'Name not provided'
          ),
          React.createElement(
            'p',
            { className: 'text-gray-700' },
            personalDetails.gender ? `${age ? `${age} years, ` : ''}${personalDetails.gender}` : 'Age and gender not provided'
          ),
          React.createElement(
            'div',
            { className: 'mt-2 space-y-1 text-sm' },
            !hidePhone && personalDetails.phone && React.createElement(
              'p',
              { className: 'text-gray-700' },
              `📱 ${personalDetails.phone}`
            ),
            !hideEmail && personalDetails.email && React.createElement(
              'p',
              { className: 'text-gray-700' },
              `✉️ ${personalDetails.email}`
            ),
            personalDetails.dateOfBirth && React.createElement(
              'p',
              { className: 'text-gray-700' },
              `🎂 ${formatDateForInput(personalDetails.dateOfBirth)}`
            )
          )
        )
      ),

      // Right column - Details
      React.createElement(
        'div',
        { className: 'lg:col-span-2 space-y-6' },
        // Personal Information
        React.createElement(
          'div',
          { className: 'border-l-4 pl-4' },
          React.createElement(
            'h3',
            {
              className: 'text-lg font-semibold mb-2 uppercase tracking-wide',
              style: { color: secondaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px' }
            },
            'Personal Information'
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-2 text-sm' },
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
            { className: 'mt-2' },
            React.createElement('span', { className: 'font-medium text-gray-700' }, 'Address: '),
            React.createElement(
              'span',
              { className: 'text-gray-600' },
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

        // Family Information
        React.createElement(
          'div',
          { className: 'border-l-4 pl-4' },
          React.createElement(
            'h3',
            {
              className: 'text-lg font-semibold mb-2 uppercase tracking-wide',
              style: { color: secondaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px' }
            },
            'Family Information'
          ),
          React.createElement(
            'div',
            { className: 'space-y-2 text-sm' },
            // Father's Info
            (familyDetails.father?.name || familyDetails.father?.occupation) && React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'font-medium text-gray-700' },
                ` 👨 Father: ${familyDetails.father?.name || 'Not specified'}`
              ),
              familyDetails.father?.occupation && React.createElement(
                'div',
                { className: 'text-gray-600 ml-5' },
                `${familyDetails.father.occupation}${familyDetails.father.companyName ? ` at ${familyDetails.father.companyName}` : ''}`
              )
            ),

            // Mother's Info
            (familyDetails.mother?.name || familyDetails.mother?.occupation) && React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'font-medium text-gray-700' },
                `👩 Mother: ${familyDetails.mother?.name || 'Not specified'}`
              ),
              familyDetails.mother?.occupation && React.createElement(
                'div',
                { className: 'text-gray-600 ml-5' },
                `${familyDetails.mother.occupation}${familyDetails.mother.companyName ? ` at ${familyDetails.mother.companyName}` : ''}`
              )
            ),

            // Siblings Info
            (familyDetails.siblings?.brothers?.total > 0 || familyDetails.siblings?.sisters?.total > 0) && React.createElement(
              'div',
              { className: 'mt-2' },
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
              { className: 'grid grid-cols-1 md:grid-cols-3 gap-2 mt-2' },
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'font-medium text-gray-700' }, '🏠 Family Type: '),
                React.createElement('span', { className: 'text-gray-600' }, familyDetails.familyType || 'Not specified')
              ),
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'font-medium text-gray-700' }, '💼 Family Status: '),
                React.createElement('span', { className: 'text-gray-600' }, familyDetails.familyStatus || 'Not specified')
              ),
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'font-medium text-gray-700' }, '🏛️ Family Values: '),
                React.createElement('span', { className: 'text-gray-600' }, familyDetails.familyValues || 'Not specified')
              )
            ),

            // About Family
            familyDetails.aboutFamily && React.createElement(
              'div',
              { className: 'mt-2' },
              React.createElement('span', { className: 'font-medium text-gray-700' }, '💬 About Family: '),
              React.createElement('span', { className: 'text-gray-600' }, familyDetails.aboutFamily)
            )
          )
        ),

        // Education & Profession
        React.createElement(
          'div',
          { className: 'border-l-4 pl-4' },
          React.createElement(
            'h3',
            {
              className: 'text-lg font-semibold mb-2 uppercase tracking-wide',
              style: { color: secondaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px' }
            },
            'Education & Profession'
          ),
          React.createElement(
            'div',
            { className: 'space-y-2 text-sm' },
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🎓 Education: '),
              React.createElement(
                'span',
                { className: 'text-gray-600' },
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
                { className: 'text-gray-600' },
                `${educationDetails.occupation}${educationDetails.companyName ? ` at ${educationDetails.companyName}` : ''}`
              )
            ),

            !hideIncome && educationDetails.annualIncome?.amount && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '💰 Annual Income: '),
              React.createElement(
                'span',
                { className: 'text-gray-600' },
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
              React.createElement('span', { className: 'text-gray-600' }, educationDetails.workLocation)
            ),

            educationDetails.additionalQualifications?.length > 0 && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-medium text-gray-700' }, '🏆 Qualifications: '),
              React.createElement(
                'span',
                { className: 'text-gray-600' },
                educationDetails.additionalQualifications.join(', ')
              )
            )
          )
        ),

        // Horoscope Information (if available and not hidden)
        horoscopeDetails && Object.keys(horoscopeDetails).some(key => horoscopeDetails[key]) && React.createElement(
          'div',
          { className: 'border-l-4 pl-4' },
          React.createElement(
            'h3',
            {
              className: 'text-lg font-semibold mb-2 uppercase tracking-wide',
              style: { color: secondaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px' }
            },
            'Horoscope Information'
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-2 text-sm' },
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

    // Footer with decorative elements
    React.createElement(
      'div',
      { className: 'border-t-4 border-gray-800 pt-4 mt-6 text-center' },
      React.createElement(
        'div',
        { className: 'flex justify-center' },
        React.createElement(
          'div',
          {
            className: 'w-12 h-0.5 bg-gray-600 mr-2',
            style: { backgroundColor: primaryColor }
          }
        ),
        React.createElement(
          'div',
          {
            className: 'w-8 h-8 rounded-full border-2 border-gray-700 flex items-center justify-center',
            style: { borderColor: secondaryColor }
          },
          React.createElement(
            'div',
            {
              className: 'w-4 h-4 rounded-full',
              style: { backgroundColor: primaryColor }
            }
          )
        ),
        React.createElement(
          'div',
          {
            className: 'w-12 h-0.5 bg-gray-600 ml-2',
            style: { backgroundColor: primaryColor }
          }
        )
      ),
      React.createElement(
        'p',
        { className: 'mt-2 text-sm text-gray-600' },
        'Generated by ShadiBio - Professional Marriage Biodata Platform'
      )
    )
  );
};

export default TraditionalTemplate;