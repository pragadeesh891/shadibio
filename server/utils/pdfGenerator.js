const pdf = require('html-pdf-node');
let muhammara;
try {
  muhammara = require('muhammara');
} catch (e) {
  console.warn('muhammara module not found. PDF password protection will be disabled.');
}

// Helper: get profile photo from biodata (stored at top-level biodata.profilePhoto)
const getProfilePhoto = (biodata) => biodata?.profilePhoto || biodata?.personalDetails?.profilePhoto || null;

// Template functions for PDF generation
const generateTraditionalTemplate = (biodata, customization = {}, isPremium = false) => {
  const { primaryColor = '#3B82F6', secondaryColor = '#1E40AF', fontFamily = 'Arial' } = customization;

  const personalDetails = biodata?.personalDetails || {};
  const familyDetails = biodata?.familyDetails || {};
  const educationDetails = biodata?.educationDetails || {};
  const horoscopeDetails = biodata?.horoscopeDetails || {};

  // Helper functions
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  };

  const hidePhone = getNestedValue(biodata, 'privacySettings.hidePhone');
  const hideEmail = getNestedValue(biodata, 'privacySettings.hideEmail');
  const hideIncome = getNestedValue(biodata, 'privacySettings.hideIncome');

  const age = personalDetails.age || (personalDetails.dateOfBirth ?
    new Date().getFullYear() - new Date(personalDetails.dateOfBirth).getFullYear() : null);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: ${fontFamily};
          margin: 0;
          padding: 20px;
          line-height: 1.4;
          color: #333;
        }
        .header {
          border-bottom: 4px solid #111827;
          padding-bottom: 20px;
          margin-bottom: 30px;
          text-align: center;
        }
        .title {
          color: ${secondaryColor};
          font-size: 28px;
          font-weight: bold;
          margin: 10px 0;
        }
        .main-content {
          display: flex;
          gap: 30px;
        }
        .left-column {
          flex: 1;
          text-align: center;
        }
        .right-column {
          flex: 2;
        }
        .profile-photo {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 4px solid #374151;
          margin: 0 auto 20px;
          display: block;
        }
        .section {
          margin-bottom: 25px;
          border-left: 4px solid ${primaryColor};
          padding-left: 15px;
        }
        .section-title {
          color: ${secondaryColor};
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 2px solid ${primaryColor};
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 14px;
        }
        .info-item {
          margin-bottom: 5px;
        }
        .label {
          font-weight: bold;
          color: #4b5563;
        }
        .value {
          color: #6b7280;
        }
        .footer {
          border-top: 4px solid #111827;
          padding-top: 20px;
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          color: rgba(200, 200, 200, 0.3);
          z-index: 9999;
          pointer-events: none;
          white-space: nowrap;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      ${!isPremium ? '<div class="watermark">ShadiBio.com Free</div>' : ''}
      <div class="header">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
          <div style="width: 64px; height: 64px; border: 4px solid ${secondaryColor}; border-radius: 50%; margin: 0 20px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 48px; height: 48px; border: 4px solid ${primaryColor}; border-radius: 50%;"></div>
          </div>
          <h1 class="title">MARRIAGE BIO-DATA</h1>
          <div style="width: 64px; height: 64px; border: 4px solid ${secondaryColor}; border-radius: 50%; margin: 0 20px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 48px; height: 48px; border: 4px solid ${primaryColor}; border-radius: 50%;"></div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="left-column">
          ${getProfilePhoto(biodata) ? `
            <div style="text-align:center; margin-bottom: 16px;">
              <img 
                src="${getProfilePhoto(biodata)}" 
                alt="Profile Photo"
                style="width:160px;height:160px;border-radius:50%;border:4px solid ${secondaryColor};object-fit:cover;display:block;margin:0 auto;"
              >
            </div>` :
      `<div style="width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,${primaryColor},${secondaryColor});display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:48px;">👤</div>`
    }
          <h2 style="color: ${secondaryColor}; font-size: 20px; margin: 10px 0;">${personalDetails.fullName || 'Name not provided'}</h2>
          <p style="color: #4b5563; margin: 5px 0;">${personalDetails.gender ? `${age ? `${age} years, ` : ''}${personalDetails.gender}` : 'Age and gender not provided'}</p>
          <div style="margin-top: 15px; font-size: 14px;">
            ${!hidePhone && personalDetails.phone ? `<p style="margin: 3px 0;">📱 ${personalDetails.phone}</p>` : ''}
            ${!hideEmail && personalDetails.email ? `<p style="margin: 3px 0;">✉️ ${personalDetails.email}</p>` : ''}
            ${personalDetails.dateOfBirth ? `<p style="margin: 3px 0;">🎂 ${new Date(personalDetails.dateOfBirth).toLocaleDateString()}</p>` : ''}
          </div>
        </div>

        <div class="right-column">
          <div class="section">
            <h3 class="section-title">Personal Information</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Marital Status:</span> <span class="value">${personalDetails.maritalStatus || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Height:</span> <span class="value">${personalDetails.height?.feet || personalDetails.height?.inches ? `${personalDetails.height.feet}'${personalDetails.height.inches || 0}"` : 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Weight:</span> <span class="value">${personalDetails.weight ? `${personalDetails.weight} kg` : 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Blood Group:</span> <span class="value">${personalDetails.bloodGroup || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Complexion:</span> <span class="value">${personalDetails.complexion || 'Not specified'}</span></div>
            </div>
            ${(personalDetails.address?.street || personalDetails.address?.city || personalDetails.address?.state) ?
      `<div style="margin-top: 10px;"><span class="label">Address:</span> <span class="value">${[
        personalDetails.address?.street,
        personalDetails.address?.city,
        personalDetails.address?.state,
        personalDetails.address?.pincode,
        personalDetails.address?.country
      ].filter(Boolean).join(', ')}</span></div>` : ''}
          </div>

          <div class="section">
            <h3 class="section-title">Family Information</h3>
            ${(familyDetails.father?.name || familyDetails.father?.occupation) ?
      `<div class="info-item"><span class="label">👨 Father:</span> <span class="value">${familyDetails.father?.name || 'Not specified'}</span></div>
               ${familyDetails.father?.occupation ? `<div style="margin-left: 20px; margin-bottom: 8px;"><span class="value">${familyDetails.father.occupation}${familyDetails.father.companyName ? ` at ${familyDetails.father.companyName}` : ''}</span></div>` : ''}` : ''}
            
            ${(familyDetails.mother?.name || familyDetails.mother?.occupation) ?
      `<div class="info-item"><span class="label">👩 Mother:</span> <span class="value">${familyDetails.mother?.name || 'Not specified'}</span></div>
               ${familyDetails.mother?.occupation ? `<div style="margin-left: 20px; margin-bottom: 8px;"><span class="value">${familyDetails.mother.occupation}${familyDetails.mother.companyName ? ` at ${familyDetails.mother.companyName}` : ''}</span></div>` : ''}` : ''}
            
            ${(familyDetails.siblings?.brothers?.total > 0 || familyDetails.siblings?.sisters?.total > 0) ?
      `<div style="margin: 10px 0;"><span class="label">👥 Siblings:</span> <span class="value">${[
        familyDetails.siblings?.brothers?.total > 0 ? `${familyDetails.siblings.brothers.total} brother(s)` : null,
        familyDetails.siblings?.sisters?.total > 0 ? `${familyDetails.siblings.sisters.total} sister(s)` : null
      ].filter(Boolean).join(', ') || 'None'}</span></div>` : ''}
            
            <div class="info-grid" style="margin-top: 10px;">
              <div class="info-item"><span class="label">🏠 Family Type:</span> <span class="value">${familyDetails.familyType || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">💼 Family Status:</span> <span class="value">${familyDetails.familyStatus || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">🏛️ Family Values:</span> <span class="value">${familyDetails.familyValues || 'Not specified'}</span></div>
            </div>
            ${familyDetails.aboutFamily ? `<div style="margin-top: 10px;"><span class="label">💬 About Family:</span> <span class="value">${familyDetails.aboutFamily}</span></div>` : ''}
          </div>

          <div class="section">
            <h3 class="section-title">Education & Profession</h3>
            <div class="info-item"><span class="label">🎓 Education:</span> <span class="value">${[
      educationDetails.highestEducation,
      educationDetails.college,
      educationDetails.specialization
    ].filter(Boolean).join(', ') || 'Not specified'}</span></div>
            
            ${educationDetails.occupation ? `<div class="info-item"><span class="label">💼 Occupation:</span> <span class="value">${educationDetails.occupation}${educationDetails.companyName ? ` at ${educationDetails.companyName}` : ''}</span></div>` : ''}
            
            ${!hideIncome && educationDetails.annualIncome?.amount ? `<div class="info-item"><span class="label">💰 Annual Income:</span> <span class="value">${new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: educationDetails.annualIncome.currency || 'INR',
      maximumFractionDigits: 0
    }).format(educationDetails.annualIncome.amount)}</span></div>` : ''}
            
            ${educationDetails.workLocation ? `<div class="info-item"><span class="label">📍 Work Location:</span> <span class="value">${educationDetails.workLocation}</span></div>` : ''}
            
            ${educationDetails.additionalQualifications?.length > 0 ? `<div class="info-item"><span class="label">🏆 Qualifications:</span> <span class="value">${educationDetails.additionalQualifications.join(', ')}</span></div>` : ''}
          </div>

          ${horoscopeDetails && Object.keys(horoscopeDetails).some(key => horoscopeDetails[key]) ? `
            <div class="section">
              <h3 class="section-title">Horoscope Information</h3>
              <div class="info-grid">
                ${horoscopeDetails.rashi ? `<div class="info-item"><span class="label">🌙 Rashi:</span> <span class="value">${horoscopeDetails.rashi}</span></div>` : ''}
                ${horoscopeDetails.nakshatra ? `<div class="info-item"><span class="label">⭐ Nakshatra:</span> <span class="value">${horoscopeDetails.nakshatra}</span></div>` : ''}
                ${horoscopeDetails.manglik ? `<div class="info-item"><span class="label">🪐 Manglik:</span> <span class="value">${horoscopeDetails.manglik}</span></div>` : ''}
                ${horoscopeDetails.timeOfBirth ? `<div class="info-item"><span class="label">⏰ Time of Birth:</span> <span class="value">${horoscopeDetails.timeOfBirth}</span></div>` : ''}
                ${horoscopeDetails.placeOfBirth ? `<div class="info-item"><span class="label">🌍 Place of Birth:</span> <span class="value">${horoscopeDetails.placeOfBirth}</span></div>` : ''}
                ${horoscopeDetails.gotra ? `<div class="info-item"><span class="label"> tộc Gotra:</span> <span class="value">${horoscopeDetails.gotra}</span></div>` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="footer">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
          <div style="width: 48px; height: 2px; background-color: ${primaryColor}; margin: 0 10px;"></div>
          <div style="width: 32px; height: 32px; border: 2px solid ${secondaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${primaryColor};"></div>
          </div>
          <div style="width: 48px; height: 2px; background-color: ${primaryColor}; margin: 0 10px;"></div>
        </div>
        <p>Generated by ShadiBio - Professional Marriage Biodata Platform</p>
      </div>
    </body>
    </html>
  `;
};

const generateModernTemplate = (biodata, customization = {}, isPremium = false) => {
  const { primaryColor = '#3B82F6', secondaryColor = '#1E40AF', fontFamily = 'Arial' } = customization;

  const personalDetails = biodata?.personalDetails || {};
  const familyDetails = biodata?.familyDetails || {};
  const educationDetails = biodata?.educationDetails || {};
  const horoscopeDetails = biodata?.horoscopeDetails || {};

  // Helper functions
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  };

  const hidePhone = getNestedValue(biodata, 'privacySettings.hidePhone');
  const hideEmail = getNestedValue(biodata, 'privacySettings.hideEmail');
  const hideIncome = getNestedValue(biodata, 'privacySettings.hideIncome');

  const age = personalDetails.age || (personalDetails.dateOfBirth ?
    new Date().getFullYear() - new Date(personalDetails.dateOfBirth).getFullYear() : null);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: ${fontFamily};
          margin: 0;
          padding: 30px;
          line-height: 1.5;
          color: #333;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
        }
        .container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: ${primaryColor};
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .content {
          padding: 30px;
          display: flex;
          gap: 30px;
        }
        .left-column {
          flex: 1;
          text-align: center;
        }
        .right-column {
          flex: 2;
        }
        .profile-photo {
          width: 180px;
          height: 180px;
          border-radius: 16px;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin: 0 auto 20px;
          display: block;
        }
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid ${primaryColor};
        }
        .card-title {
          color: ${secondaryColor};
          font-size: 20px;
          font-weight: bold;
          margin: 0 0 15px 0;
          display: flex;
          align-items: center;
        }
        .card-title span {
          margin-right: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          color: #4b5563;
          display: block;
          margin-bottom: 3px;
        }
        .value {
          color: #6b7280;
        }
        .contact-card {
          background: #f9fafb;
          border-radius: 8px;
          padding: 12px;
          margin: 8px 0;
          border-left: 4px solid ${primaryColor};
          display: flex;
          align-items: center;
        }
        .contact-card span {
          margin-right: 8px;
        }
        .footer {
          background: ${secondaryColor};
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          color: rgba(0, 0, 0, 0.1);
          z-index: 9999;
          pointer-events: none;
          white-space: nowrap;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      ${!isPremium ? '<div class="watermark">ShadiBio.com Free</div>' : ''}
      <div class="container">
        <div class="header">
          <h1>MARRIAGE BIO-DATA</h1>
        </div>

        <div class="content">
          <div class="left-column">
          ${getProfilePhoto(biodata) ? `
            <div style="text-align:center; margin-bottom: 18px;">
              <img 
                src="${getProfilePhoto(biodata)}" 
                class="profile-photo" 
                alt="Profile Photo"
                style="width:160px;height:160px;border-radius:16px;border:4px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.2);object-fit:cover;display:block;margin:0 auto 12px;"
              >
            </div>` :
      `<div style="width:160px;height:160px;border-radius:16px;background:linear-gradient(135deg,${primaryColor},${secondaryColor});display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:48px;">👤</div>`
    }
            <h2 style="color: ${secondaryColor}; font-size: 24px; margin: 15px 0;">${personalDetails.fullName || 'Name not provided'}</h2>
            <p style="color: #4b5563; margin: 5px 0;">${personalDetails.gender ? `${age ? `${age} years, ` : ''}${personalDetails.gender}` : 'Age and gender not provided'}</p>
            
            <div style="margin-top: 20px;">
              ${!hidePhone && personalDetails.phone ? `<div class="contact-card">📱 <span class="value">${personalDetails.phone}</span></div>` : ''}
              ${!hideEmail && personalDetails.email ? `<div class="contact-card">✉️ <span class="value">${personalDetails.email}</span></div>` : ''}
              ${personalDetails.dateOfBirth ? `<div class="contact-card">🎂 <span class="value">${new Date(personalDetails.dateOfBirth).toLocaleDateString()}</span></div>` : ''}
            </div>
          </div>

          <div class="right-column">
            <div class="card">
              <h3 class="card-title"><span>👤</span> Personal Information</h3>
              <div class="info-grid">
                <div class="info-item"><span class="label">Marital Status:</span> <span class="value">${personalDetails.maritalStatus || 'Not specified'}</span></div>
                <div class="info-item"><span class="label">Height:</span> <span class="value">${personalDetails.height?.feet || personalDetails.height?.inches ? `${personalDetails.height.feet}'${personalDetails.height.inches || 0}"` : 'Not specified'}</span></div>
                <div class="info-item"><span class="label">Weight:</span> <span class="value">${personalDetails.weight ? `${personalDetails.weight} kg` : 'Not specified'}</span></div>
                <div class="info-item"><span class="label">Blood Group:</span> <span class="value">${personalDetails.bloodGroup || 'Not specified'}</span></div>
                <div class="info-item"><span class="label">Complexion:</span> <span class="value">${personalDetails.complexion || 'Not specified'}</span></div>
              </div>
              ${(personalDetails.address?.street || personalDetails.address?.city || personalDetails.address?.state) ?
      `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;"><span class="label">📍 Address:</span> <span class="value">${[
        personalDetails.address?.street,
        personalDetails.address?.city,
        personalDetails.address?.state,
        personalDetails.address?.pincode,
        personalDetails.address?.country
      ].filter(Boolean).join(', ')}</span></div>` : ''}
            </div>

            <div class="card">
              <h3 class="card-title"><span>👨‍👩‍👧‍👦</span> Family Information</h3>
              ${(familyDetails.father?.name || familyDetails.father?.occupation) ?
      `<div class="info-item" style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="margin-right: 10px; margin-top: 2px;">👨</span>
                  <div>
                    <div class="label">Father: ${familyDetails.father?.name || 'Not specified'}</div>
                    ${familyDetails.father?.occupation ? `<div class="value" style="margin-top: 3px;">${familyDetails.father.occupation}${familyDetails.father.companyName ? ` at ${familyDetails.father.companyName}` : ''}</div>` : ''}
                  </div>
                </div>` : ''}
              
              ${(familyDetails.mother?.name || familyDetails.mother?.occupation) ?
      `<div class="info-item" style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="margin-right: 10px; margin-top: 2px;">👩</span>
                  <div>
                    <div class="label">Mother: ${familyDetails.mother?.name || 'Not specified'}</div>
                    ${familyDetails.mother?.occupation ? `<div class="value" style="margin-top: 3px;">${familyDetails.mother.occupation}${familyDetails.mother.companyName ? ` at ${familyDetails.mother.companyName}` : ''}</div>` : ''}
                  </div>
                </div>` : ''}
              
              ${(familyDetails.siblings?.brothers?.total > 0 || familyDetails.siblings?.sisters?.total > 0) ?
      `<div class="info-item" style="margin: 15px 0;"><span class="label">👥 Siblings:</span> <span class="value">${[
        familyDetails.siblings?.brothers?.total > 0 ? `${familyDetails.siblings.brothers.total} brother(s)` : null,
        familyDetails.siblings?.sisters?.total > 0 ? `${familyDetails.siblings.sisters.total} sister(s)` : null
      ].filter(Boolean).join(', ') || 'None'}</span></div>` : ''}
              
              <div class="info-grid" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <div class="info-item"><span class="label">🏠 Family Type:</span> <span class="value">${familyDetails.familyType || 'Not specified'}</span></div>
                <div class="info-item"><span class="label">💼 Family Status:</span> <span class="value">${familyDetails.familyStatus || 'Not specified'}</span></div>
                <div class="info-item"><span class="label">🏛️ Family Values:</span> <span class="value">${familyDetails.familyValues || 'Not specified'}</span></div>
              </div>
              ${familyDetails.aboutFamily ? `<div style="margin-top: 15px;"><span class="label">💬 About Family:</span> <span class="value">${familyDetails.aboutFamily}</span></div>` : ''}
            </div>

            <div class="card">
              <h3 class="card-title"><span>🎓</span> Education & Profession</h3>
              <div class="info-item"><span class="label">🎓 Education:</span> <span class="value">${[
      educationDetails.highestEducation,
      educationDetails.college,
      educationDetails.specialization
    ].filter(Boolean).join(', ') || 'Not specified'}</span></div>
              
              ${educationDetails.occupation ? `<div class="info-item" style="margin: 10px 0;"><span class="label">💼 Occupation:</span> <span class="value">${educationDetails.occupation}${educationDetails.companyName ? ` at ${educationDetails.companyName}` : ''}</span></div>` : ''}
              
              ${!hideIncome && educationDetails.annualIncome?.amount ? `<div class="info-item" style="margin: 10px 0;"><span class="label">💰 Annual Income:</span> <span class="value">${new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: educationDetails.annualIncome.currency || 'INR',
      maximumFractionDigits: 0
    }).format(educationDetails.annualIncome.amount)}</span></div>` : ''}
              
              ${educationDetails.workLocation ? `<div class="info-item" style="margin: 10px 0;"><span class="label">📍 Work Location:</span> <span class="value">${educationDetails.workLocation}</span></div>` : ''}
              
              ${educationDetails.additionalQualifications?.length > 0 ? `<div class="info-item" style="margin: 10px 0;"><span class="label">🏆 Qualifications:</span> <span class="value">${educationDetails.additionalQualifications.join(', ')}</span></div>` : ''}
            </div>

            ${horoscopeDetails && Object.keys(horoscopeDetails).some(key => horoscopeDetails[key]) ? `
              <div class="card">
                <h3 class="card-title"><span>🔮</span> Horoscope Information</h3>
                <div class="info-grid">
                  ${horoscopeDetails.rashi ? `<div class="info-item"><span class="label">🌙 Rashi:</span> <span class="value">${horoscopeDetails.rashi}</span></div>` : ''}
                  ${horoscopeDetails.nakshatra ? `<div class="info-item"><span class="label">⭐ Nakshatra:</span> <span class="value">${horoscopeDetails.nakshatra}</span></div>` : ''}
                  ${horoscopeDetails.manglik ? `<div class="info-item"><span class="label">🪐 Manglik:</span> <span class="value">${horoscopeDetails.manglik}</span></div>` : ''}
                  ${horoscopeDetails.timeOfBirth ? `<div class="info-item"><span class="label">⏰ Time of Birth:</span> <span class="value">${horoscopeDetails.timeOfBirth}</span></div>` : ''}
                  ${horoscopeDetails.placeOfBirth ? `<div class="info-item"><span class="label">🌍 Place of Birth:</span> <span class="value">${horoscopeDetails.placeOfBirth}</span></div>` : ''}
                  ${horoscopeDetails.gotra ? `<div class="info-item"><span class="label"> tộc Gotra:</span> <span class="value">${horoscopeDetails.gotra}</span></div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="footer">
          Generated by ShadiBio - Professional Marriage Biodata Platform
        </div>
      </div>
    </body>
    </html>
  `;
};

// Main PDF generation function
const generateBiodataPDF = async (biodata, template = 'Traditional', customization = {}, isPremium = false, pdfPassword = null) => {
  try {
    let htmlContent;

    if (template === 'Modern') {
      htmlContent = generateModernTemplate(biodata, customization, isPremium);
    } else {
      htmlContent = generateTraditionalTemplate(biodata, customization, isPremium);
    }

    const options = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--allow-file-access-from-files'
      ]
    };

    const file = { content: htmlContent };
    let pdfBuffer = await pdf.generatePdf(file, options);

    // Add password protection
    if (pdfPassword) {
      try {
        const inStream = new muhammara.PDFRStreamForBuffer(pdfBuffer);
        const outStream = new muhammara.PDFWStreamForBuffer();

        muhammara.recrypt(inStream, outStream, {
          userPassword: pdfPassword,
          ownerPassword: 'shadi_bio_admin',
          userPrivileges: {
            print: 'highQuality',
            modify: 'none',
            copy: 'none',
            annotate: 'none',
            fillForms: 'none'
          }
        });

        pdfBuffer = outStream.buffer;
      } catch (encryptError) {
        console.error('PDF Encryption error:', encryptError);
      }
    }

    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};

module.exports = {
  generateBiodataPDF,
  generateTraditionalTemplate,
  generateModernTemplate
};