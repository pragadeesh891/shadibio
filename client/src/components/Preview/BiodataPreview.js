import React from 'react';
import { formatDateForInput, calculateAge } from '../../utils/helpers';

const BiodataPreview = ({ formData }) => {
  // Helper function to safely get nested properties
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  };

  // Format display values
  const formatCurrency = (amount, currency = 'INR') => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get privacy settings
  const hidePhone = getNestedValue(formData, 'privacySettings.hidePhone');
  const hideEmail = getNestedValue(formData, 'privacySettings.hideEmail');
  const hideIncome = getNestedValue(formData, 'privacySettings.hideIncome');

  // Get personal details
  const personalDetails = formData?.personalDetails || {};
  const familyDetails = formData?.familyDetails || {};
  const educationDetails = formData?.educationDetails || {};
  const horoscopeDetails = formData?.horoscopeDetails || {};

  // Calculate age if not provided
  const age = personalDetails.age || (personalDetails.dateOfBirth ? calculateAge(personalDetails.dateOfBirth) : null);

  return React.createElement(
    'div',
    { className: 'bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto' },
    React.createElement(
      'div',
      { className: 'text-center mb-6' },
      // Profile photo
      personalDetails.profilePhoto && React.createElement('img', {
        src: personalDetails.profilePhoto,
        alt: 'Profile',
        className: 'w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200'
      }),
      
      // Personal details
      React.createElement(
        'div',
        { className: 'mt-4' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-bold text-gray-800' },
          personalDetails.fullName || 'Name not provided'
        ),
        React.createElement(
          'p',
          { className: 'text-lg text-gray-600' },
          personalDetails.gender ? `${age ? `${age} years, ` : ''}${personalDetails.gender}` : 'Age and gender not provided'
        ),
        React.createElement(
          'div',
          { className: 'mt-2 space-y-1' },
          !hidePhone && personalDetails.phone && React.createElement(
            'p',
            { className: 'text-gray-700' },
            `Phone: ${personalDetails.phone}`
          ),
          !hideEmail && personalDetails.email && React.createElement(
            'p',
            { className: 'text-gray-700' },
            `Email: ${personalDetails.email}`
          ),
          personalDetails.dateOfBirth && React.createElement(
            'p',
            { className: 'text-gray-700' },
            `DOB: ${formatDateForInput(personalDetails.dateOfBirth)}`
          )
        )
      )
    ),

    // Horizontal divider
    React.createElement('hr', { className: 'my-6 border-t border-gray-300' }),

    // Personal Information
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-xl font-semibold text-gray-800 mb-3 border-b pb-2' },
        'Personal Information'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-2 text-sm' },
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
        { className: 'mt-3' },
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
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-xl font-semibold text-gray-800 mb-3 border-b pb-2' },
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
            `Father: ${familyDetails.father?.name || 'Not specified'}`
          ),
          familyDetails.father?.occupation && React.createElement(
            'div',
            { className: 'text-gray-600' },
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
            `Mother: ${familyDetails.mother?.name || 'Not specified'}`
          ),
          familyDetails.mother?.occupation && React.createElement(
            'div',
            { className: 'text-gray-600' },
            `${familyDetails.mother.occupation}${familyDetails.mother.companyName ? ` at ${familyDetails.mother.companyName}` : ''}`
          )
        ),
        
        // Siblings Info
        (familyDetails.siblings?.brothers?.total > 0 || familyDetails.siblings?.sisters?.total > 0) && React.createElement(
          'div',
          { className: 'mt-2' },
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Siblings: '),
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
            React.createElement('span', { className: 'font-medium text-gray-700' }, 'Family Type: '),
            React.createElement('span', { className: 'text-gray-600' }, familyDetails.familyType || 'Not specified')
          ),
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-medium text-gray-700' }, 'Family Status: '),
            React.createElement('span', { className: 'text-gray-600' }, familyDetails.familyStatus || 'Not specified')
          ),
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-medium text-gray-700' }, 'Family Values: '),
            React.createElement('span', { className: 'text-gray-600' }, familyDetails.familyValues || 'Not specified')
          )
        ),
        
        // About Family
        familyDetails.aboutFamily && React.createElement(
          'div',
          { className: 'mt-2' },
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'About Family: '),
          React.createElement('span', { className: 'text-gray-600' }, familyDetails.aboutFamily)
        )
      )
    ),

    // Education & Profession
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-xl font-semibold text-gray-800 mb-3 border-b pb-2' },
        'Education & Profession'
      ),
      React.createElement(
        'div',
        { className: 'space-y-2 text-sm' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Education: '),
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
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Occupation: '),
          React.createElement(
            'span',
            { className: 'text-gray-600' },
            `${educationDetails.occupation}${educationDetails.companyName ? ` at ${educationDetails.companyName}` : ''}`
          )
        ),
        
        !hideIncome && educationDetails.annualIncome?.amount && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Annual Income: '),
          React.createElement(
            'span',
            { className: 'text-gray-600' },
            formatCurrency(educationDetails.annualIncome.amount, educationDetails.annualIncome.currency)
          )
        ),
        
        educationDetails.workLocation && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Work Location: '),
          React.createElement('span', { className: 'text-gray-600' }, educationDetails.workLocation)
        ),
        
        educationDetails.additionalQualifications?.length > 0 && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Qualifications: '),
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
      { className: 'mb-6' },
      React.createElement(
        'h3',
        { className: 'text-xl font-semibold text-gray-800 mb-3 border-b pb-2' },
        'Horoscope Information'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-2 text-sm' },
        horoscopeDetails.rashi && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Rashi: '),
          React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.rashi)
        ),
        horoscopeDetails.nakshatra && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Nakshatra: '),
          React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.nakshatra)
        ),
        horoscopeDetails.manglik && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Manglik: '),
          React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.manglik)
        ),
        horoscopeDetails.timeOfBirth && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Time of Birth: '),
          React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.timeOfBirth)
        ),
        horoscopeDetails.placeOfBirth && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Place of Birth: '),
          React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.placeOfBirth)
        ),
        horoscopeDetails.gotra && React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'font-medium text-gray-700' }, 'Gotra: '),
          React.createElement('span', { className: 'text-gray-600' }, horoscopeDetails.gotra)
        )
      )
    )
  );
};

export default BiodataPreview;