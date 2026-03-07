const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const { generateBiodataPDF } = require('./utils/pdfGenerator');
const Biodata = require('./models/Biodata');

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const bd = await Biodata.findOne({ profilePhoto: { $ne: null } });
    if (!bd) { console.log('No biodata with photo found'); process.exit(0); }
    console.log('Found biodata:', bd._id);

    try {
        console.log('Template:', bd.templateSelected);
        const buffer = await generateBiodataPDF(bd, bd.templateSelected, bd.customization);
        console.log('PDF generated! Size:', buffer.length);
    } catch (e) {
        console.error('Error generating PDF:', e);
    }
    process.exit(0);
})();
