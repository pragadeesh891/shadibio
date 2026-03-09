const pdf = require('html-pdf-node');
const axios = require('axios');
let muhammara;
try {
  muhammara = require('muhammara');
} catch (e) {
  console.warn('muhammara module not found. PDF password protection will be disabled.');
}

// Helper: get profile photo from biodata
const getProfilePhoto = (biodata) => biodata?.profilePhoto || biodata?.personalDetails?.profilePhoto || null;

// Helper: Convert image URL to Base64 for faster rendering
const getBase64Image = async (url) => {
  if (!url || url.startsWith('data:')) return url;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
    const b64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'] || 'image/jpeg';
    return `data:${mimeType};base64,${b64}`;
  } catch (err) {
    console.warn('Failed to fetch image for PDF Base64 conversion:', err.message);
    return url; // Fallback to original URL
  }
};

// Template functions for PDF generation
const generateTraditionalTemplate = (biodata, customization = {}, isPremium = false, profilePhotoB64 = null) => {
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

  const photoToUse = profilePhotoB64 || getProfilePhoto(biodata);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: ${fontFamily}; margin: 0; padding: 20px; line-height: 1.4; color: #333; }
        .header { border-bottom: 4px solid #111827; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
        .title { color: ${secondaryColor}; font-size: 28px; font-weight: bold; margin: 10px 0; }
        .main-content { display: flex; gap: 30px; }
        .left-column { flex: 1; text-align: center; }
        .right-column { flex: 2; }
        .profile-photo { width: 180px; height: 180px; border-radius: 50%; border: 4px solid #374151; margin: 0 auto 20px; display: block; }
        .section { margin-bottom: 25px; border-left: 4px solid ${primaryColor}; padding-left: 15px; }
        .section-title { color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid ${primaryColor}; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; }
        .info-item { margin-bottom: 5px; }
        .label { font-weight: bold; color: #4b5563; }
        .value { color: #6b7280; }
        .footer { border-top: 4px solid #111827; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(200, 200, 200, 0.3); z-index: 9999; pointer-events: none; white-space: nowrap; font-weight: bold; }
      </style>
    </head>
    <body>
      ${!isPremium ? '<div class="watermark">ShadiBio.com Free</div>' : ''}
      <div class="header">
        <h1 class="title">MARRIAGE BIO-DATA</h1>
      </div>

      <div class="main-content">
        <div class="left-column">
          ${photoToUse ? `
            <div style="text-align:center; margin-bottom: 16px;">
              <img src="${photoToUse}" style="width:160px;height:160px;border-radius:50%;border:4px solid ${secondaryColor};object-fit:cover;display:block;margin:0 auto;">
            </div>` :
      `<div style="width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,${primaryColor},${secondaryColor});display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:48px;">👤</div>`
    }
          <h2 style="color: ${secondaryColor}; font-size: 20px; margin: 10px 0;">${personalDetails.fullName || 'Name not provided'}</h2>
          <p style="color: #4b5563; margin: 5px 0;">${personalDetails.gender ? `${age ? `${age} years, ` : ''}${personalDetails.gender}` : 'Age and gender not provided'}</p>
        </div>

        <div class="right-column">
          <div class="section">
            <h3 class="section-title">Personal Information</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Marital Status:</span> <span class="value">${personalDetails.maritalStatus || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Height:</span> <span class="value">${personalDetails.height?.feet || personalDetails.height?.inches ? `${personalDetails.height.feet}'${personalDetails.height.inches || 0}"` : 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Weight:</span> <span class="value">${personalDetails.weight ? `${personalDetails.weight} kg` : 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Blood Group:</span> <span class="value">${personalDetails.bloodGroup || 'Not specified'}</span></div>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Education & Profession</h3>
            <div class="info-item"><span class="label">🎓 Education:</span> <span class="value">${educationDetails.highestEducation || 'Not specified'}</span></div>
            ${educationDetails.occupation ? `<div class="info-item"><span class="label">💼 Occupation:</span> <span class="value">${educationDetails.occupation}</span></div>` : ''}
          </div>
          
          ${horoscopeDetails.rashi || horoscopeDetails.nakshatra ? `
            <div class="section">
              <h3 class="section-title">Horoscope</h3>
              <div class="info-grid">
                ${horoscopeDetails.rashi ? `<div class="info-item"><span class="label">🌙 Rashi:</span> <span class="value">${horoscopeDetails.rashi}</span></div>` : ''}
                ${horoscopeDetails.nakshatra ? `<div class="info-item"><span class="label">⭐ Nakshatra:</span> <span class="value">${horoscopeDetails.nakshatra}</span></div>` : ''}
              </div>
            </div>` : ''}
        </div>
      </div>
      <div class="footer">
        <p>Generated by ShadiBio - Professional Marriage Biodata Platform</p>
      </div>
    </body>
    </html>
  `;
};

const generateModernTemplate = (biodata, customization = {}, isPremium = false, profilePhotoB64 = null) => {
  const { primaryColor = '#3B82F6', secondaryColor = '#1E40AF', fontFamily = 'Arial' } = customization;

  const personalDetails = biodata?.personalDetails || {};
  const educationDetails = biodata?.educationDetails || {};

  const hideIncome = biodata?.privacySettings?.hideIncome;
  const age = personalDetails.age || (personalDetails.dateOfBirth ?
    new Date().getFullYear() - new Date(personalDetails.dateOfBirth).getFullYear() : null);

  const photoToUse = profilePhotoB64 || getProfilePhoto(biodata);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: ${fontFamily}; margin: 0; padding: 30px; line-height: 1.5; color: #333; background: #f3f4f6; }
        .container { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: ${primaryColor}; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; display: flex; gap: 30px; }
        .left-column { flex: 1; text-align: center; }
        .right-column { flex: 2; }
        .card { background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid ${primaryColor}; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .label { font-weight: bold; color: #4b5563; display: block; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(0,0,0,0.05); z-index: 9999; pointer-events: none; font-weight: bold; }
      </style>
    </head>
    <body>
      ${!isPremium ? '<div class="watermark">ShadiBio.com Free</div>' : ''}
      <div class="container">
        <div class="header"><h1>MARRIAGE BIO-DATA</h1></div>
        <div class="content">
          <div class="left-column">
            ${photoToUse ? `<img src="${photoToUse}" style="width:160px;height:160px;border-radius:16px;object-fit:cover;margin-bottom:15px;border:4px solid white;">` : ''}
            <h2>${personalDetails.fullName || 'Name'}</h2>
            <p>${age ? `${age} yrs, ` : ''}${personalDetails.gender || ''}</p>
          </div>
          <div class="right-column">
            <div class="card">
              <h3>Personal Info</h3>
              <div class="info-grid">
                <div><span class="label">Status:</span> ${personalDetails.maritalStatus || 'Not set'}</div>
                <div><span class="label">Height:</span> ${personalDetails.height?.feet || 0}'${personalDetails.height?.inches || 0}"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Main PDF generation function
const generateBiodataPDF = async (biodata, template = 'Traditional', customization = {}, isPremium = false, pdfPassword = null) => {
  try {
    // PRE-FETCH PHOTO TO BASE64 FOR SPEED
    const photoUrl = getProfilePhoto(biodata);
    let profilePhotoB64 = null;
    if (photoUrl) {
      profilePhotoB64 = await getBase64Image(photoUrl);
    }

    let htmlContent;
    if (template === 'Modern') {
      htmlContent = generateModernTemplate(biodata, customization, isPremium, profilePhotoB64);
    } else {
      htmlContent = generateTraditionalTemplate(biodata, customization, isPremium, profilePhotoB64);
    }

    const options = {
      format: 'A4',
      printBackground: true,
      margin: { top: '10px', bottom: '10px', left: '10px', right: '10px' },
      launchOptions: {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--single-process'
        ]
      }
    };

    const file = { content: htmlContent };
    let pdfBuffer = await pdf.generatePdf(file, options);

    // Add password protection
    if (pdfPassword && muhammara) {
      try {
        const inStream = new muhammara.PDFRStreamForBuffer(pdfBuffer);
        const outStream = new muhammara.PDFWStreamForBuffer();
        muhammara.recrypt(inStream, outStream, {
          userPassword: pdfPassword,
          ownerPassword: 'shadi_bio_admin',
          userPrivileges: { print: 'highQuality', modify: 'none', copy: 'none' }
        });
        pdfBuffer = outStream.getBuffer ? outStream.getBuffer() : outStream.buffer;
      } catch (encryptError) {
        console.error('Speed-PDF Encryption fallback:', encryptError);
      }
    }

    return pdfBuffer;
  } catch (error) {
    console.error('PDF Speed-Gen error:', error);
    throw error;
  }
};

module.exports = {
  generateBiodataPDF,
  generateTraditionalTemplate,
  generateModernTemplate
};