const pdf = require('html-pdf-node');
const axios = require('axios');
let muhammara;
try {
  muhammara = require('muhammara');
} catch (e) {
  console.warn('muhammara module not found. PDF password protection will be disabled.');
}

const getProfilePhoto = (biodata) => biodata?.profilePhoto || biodata?.personalDetails?.profilePhoto || null;

const getBase64Image = async (url) => {
  if (!url || url.startsWith('data:')) return url;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 2000 });
    const b64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'] || 'image/jpeg';
    return `data:${mimeType};base64,${b64}`;
  } catch (err) {
    console.warn('PDF Speed-Gen Image Error:', err.message);
    return url;
  }
};

const generateTraditionalTemplate = (biodata, customization = {}, isPremium = false, profilePhotoB64 = null) => {
  const { primaryColor = '#3B82F6', secondaryColor = '#1E40AF', fontFamily = 'Arial' } = customization;
  const pd = biodata?.personalDetails || {};
  const fd = biodata?.familyDetails || {};
  const ed = biodata?.educationDetails || {};
  const hd = biodata?.horoscopeDetails || {};
  const age = pd.age || (pd.dateOfBirth ? new Date().getFullYear() - new Date(pd.dateOfBirth).getFullYear() : '');
  const photo = profilePhotoB64 || getProfilePhoto(biodata);

  return `
    <html>
    <head><style>
      body { font-family: ${fontFamily}; margin: 0; padding: 25px; color: #333; line-height: 1.4; }
      .header { text-align: center; border-bottom: 3px solid ${primaryColor}; padding-bottom: 15px; margin-bottom: 25px; }
      .header h1 { margin: 0; color: ${secondaryColor}; font-size: 28px; }
      .main { display: flex; gap: 30px; }
      .sidebar { flex: 1; text-align: center; }
      .content { flex: 2.2; }
      .photo { width: 160px; height: 160px; border-radius: 50%; border: 4px solid ${primaryColor}; object-fit: cover; margin-bottom: 15px; }
      .section { margin-bottom: 20px; border-left: 4px solid ${primaryColor}; padding-left: 15px; }
      .section-title { color: ${secondaryColor}; font-weight: bold; font-size: 18px; border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 3px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; }
      .label { font-weight: bold; color: #555; }
      .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 90px; color: rgba(0,0,0,0.05); z-index: -1; font-weight: bold; }
    </style></head>
    <body>
      ${!isPremium ? '<div class="watermark">ShadiBio.com FREE</div>' : ''}
      <div class="header"><h1>MARRIAGE BIO-DATA</h1></div>
      <div class="main">
        <div class="sidebar">
          ${photo ? `<img src="${photo}" class="photo">` : `<div style="width:150px;height:150px;border-radius:50%;background:#eee;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;font-size:50px;">👤</div>`}
          <h2 style="margin:5px 0;">${pd.fullName || ''}</h2>
          <p>${age ? age + ' yrs, ' : ''}${pd.gender || ''}</p>
          <div style="font-size:13px; margin-top:10px;">
            ${pd.phone && !biodata?.privacySettings?.hidePhone ? `<p>📞 ${pd.phone}</p>` : ''}
            ${pd.email && !biodata?.privacySettings?.hideEmail ? `<p>📧 ${pd.email}</p>` : ''}
          </div>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Personal Details</div>
            <div class="grid">
              <div><span class="label">Status:</span> ${pd.maritalStatus || 'N/A'}</div>
              <div><span class="label">Height:</span> ${pd.height?.feet || 0}'${pd.height?.inches || 0}"</div>
              <div><span class="label">Weight:</span> ${pd.weight || 'N/A'} kg</div>
              <div><span class="label">Blood:</span> ${pd.bloodGroup || 'N/A'}</div>
              <div><span class="label">Complexion:</span> ${pd.complexion || 'N/A'}</div>
              <div><span class="label">Religion:</span> ${pd.religion || 'N/A'}</div>
            </div>
            ${pd.address?.city ? `<p style="margin:10px 0 0;font-size:14px;"><span class="label">� Address:</span> ${pd.address.city}, ${pd.address.state}</p>` : ''}
          </div>
          <div class="section">
            <div class="section-title">Family Background</div>
            <div class="grid">
              <div><span class="label">Father:</span> ${fd.father?.name || 'N/A'}</div>
              <div><span class="label">Mother:</span> ${fd.mother?.name || 'N/A'}</div>
              <div><span class="label">Siblings:</span> ${fd.siblings?.brothers?.total || 0} B, ${fd.siblings?.sisters?.total || 0} S</div>
              <div><span class="label">Type:</span> ${fd.familyType || 'N/A'}</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Education & Profession</div>
            <p style="font-size:14px;margin:5px 0;"><b>Education:</b> ${ed.highestEducation || 'N/A'}${ed.specialization ? ' (' + ed.specialization + ')' : ''}</p>
            <p style="font-size:14px;margin:5px 0;"><b>Occupation:</b> ${ed.occupation || 'N/A'}${ed.companyName ? ' at ' + ed.companyName : ''}</p>
            ${ed.annualIncome?.amount && !biodata?.privacySettings?.hideIncome ? `<p style="font-size:14px;margin:5px 0;"><b>Income:</b> ${ed.annualIncome.currency} ${ed.annualIncome.amount}</p>` : ''}
          </div>
          ${hd.rashi || hd.nakshatra ? `
          <div class="section">
            <div class="section-title">Horoscope</div>
            <div class="grid">
              <div><span class="label">Rashi:</span> ${hd.rashi || 'N/A'}</div>
              <div><span class="label">Nakshatra:</span> ${hd.nakshatra || 'N/A'}</div>
              <div><span class="label">Gotra:</span> ${hd.gotra || 'N/A'}</div>
              <div><span class="label">Manglik:</span> ${hd.manglik || 'N/A'}</div>
            </div>
          </div>` : ''}
        </div>
      </div>
      <div style="text-align:center;font-size:10px;color:#999;margin-top:20px;">ShadiBio.com - Create your professional biodata in minutes</div>
    </body></html>
  `;
};

const generateModernTemplate = (biodata, customization = {}, isPremium = false, profilePhotoB64 = null) => {
  return generateTraditionalTemplate(biodata, customization, isPremium, profilePhotoB64); // Fallback to optimized for now
};

const generateBiodataPDF = async (biodata, template = 'Traditional', customization = {}, isPremium = false, pdfPassword = null) => {
  try {
    const photoUrl = getProfilePhoto(biodata);
    const profilePhotoB64 = photoUrl ? await getBase64Image(photoUrl) : null;
    const htmlContent = generateTraditionalTemplate(biodata, customization, isPremium, profilePhotoB64);

    const options = {
      format: 'A4',
      printBackground: true,
      margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' },
      launchOptions: {
        headless: 'new',
        args: [
          '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
          '--disable-gpu', '--no-zygote', '--single-process',
          '--font-render-hinting=none', '--disable-extensions'
        ]
      }
    };

    let pdfBuffer = await pdf.generatePdf({ content: htmlContent }, options);

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
      } catch (e) { console.error('Encr Error:', e); }
    }
    return pdfBuffer;
  } catch (error) {
    console.error('PDF error:', error);
    throw error;
  }
};

module.exports = { generateBiodataPDF };