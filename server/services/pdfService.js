const PDFDocument = require('pdfkit');

/**
 * Dynamically generates a production-ready vector PDF for a credential on-the-fly.
 * PDF is generated in memory and streamed directly to response. Never saved on disk.
 */
async function generateCredentialPDF({ credential, participant, event, templateKey }) {
  return new Promise(async (resolve, reject) => {
    try {
      // Determine orientation and size (Landscape A4 for certificates, Portrait A4 or Badge for passes)
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => reject(err));

      const width = doc.page.width;
      const height = doc.page.height;

      const isPass = templateKey ? templateKey.toLowerCase().includes('pass') : true;

      if (isPass) {
        // Render Event Pass / Speaker Pass
        renderPassPDF(doc, width, height, credential, participant, event, templateKey);
      } else {
        // Render Certificate
        renderCertificatePDF(doc, width, height, credential, participant, event, templateKey);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function renderCertificatePDF(doc, width, height, credential, participant, event, templateKey) {
  // Color Palettes
  let primaryColor = '#7C3AED'; // Celestius Violet
  let accentColor = '#3B82F6';  // Celestius Blue
  let bgDark = '#0B0F19';
  let cardBg = '#131B2E';
  let goldColor = '#F59E0B';
  let silverColor = '#94A3B8';

  let titleText = 'CERTIFICATE OF PARTICIPATION';
  let badgeText = 'OFFICIAL CREDENTIAL';
  let headerColor = primaryColor;

  if (templateKey === 'winner') {
    titleText = 'CERTIFICATE OF EXCELLENCE';
    badgeText = 'WINNER / TOP PERFORMER';
    headerColor = goldColor;
  } else if (templateKey === 'volunteer') {
    titleText = 'CERTIFICATE OF APPRECIATION';
    badgeText = 'EVENT VOLUNTEER';
    headerColor = silverColor;
  } else if (templateKey === 'speaker-pass') {
    titleText = 'SPEAKER CREDENTIAL';
    badgeText = 'KEYNOTE SPEAKER';
    headerColor = primaryColor;
  }

  // Outer Background Fill
  doc.rect(0, 0, width, height).fill(bgDark);

  // Outer Glowing Decorative Border
  doc.rect(20, 20, width - 40, height - 40)
     .lineWidth(3)
     .stroke(headerColor);

  doc.rect(28, 28, width - 56, height - 56)
     .lineWidth(1)
     .stroke('#334155');

  // Inner Content Container Fill
  doc.rect(35, 35, width - 70, height - 70)
     .fill(cardBg);

  // Header Banner Accent Line
  doc.rect(35, 35, width - 70, 8)
     .fill(headerColor);

  // Top Organization Branding
  doc.fillColor('#94A3B8')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('CLUB CELESTIUS • OFFICIAL CREDENTIAL PLATFORM', 0, 65, { align: 'center' });

  // Main Title
  doc.fillColor(headerColor)
     .fontSize(28)
     .font('Helvetica-Bold')
     .text(titleText, 0, 95, { align: 'center' });

  // Subtitle
  doc.fillColor('#CBD5E1')
     .fontSize(12)
     .font('Helvetica')
     .text('THIS IS PROUDLY PRESENTED TO', 0, 140, { align: 'center' });

  // Participant Name (Huge)
  doc.fillColor('#FFFFFF')
     .fontSize(32)
     .font('Helvetica-Bold')
     .text(participant.name.toUpperCase(), 0, 170, { align: 'center' });

  // Name Underline Accent
  const textWidth = doc.widthOfString(participant.name.toUpperCase());
  doc.moveTo((width - Math.min(textWidth, 400)) / 2, 210)
     .lineTo((width + Math.min(textWidth, 400)) / 2, 210)
     .lineWidth(2)
     .stroke(headerColor);

  // Citation Body Text
  const deptText = participant.department ? `from ${participant.department}` : '';
  const regText = participant.registerNumber ? `(Reg No: ${participant.registerNumber})` : '';

  doc.fillColor('#94A3B8')
     .fontSize(13)
     .font('Helvetica')
     .text(
       `for active participation and outstanding contribution in "${event.eventName}" ${deptText} ${regText}.`,
       100,
       230,
       { align: 'center', width: width - 200, lineGap: 6 }
     );

  // Event Date
  const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.fillColor('#CBD5E1')
     .fontSize(11)
     .font('Helvetica-Oblique')
     .text(`Organized on ${dateStr} by Club Celestius`, 0, 290, { align: 'center' });

  // Footer Divider Line
  doc.moveTo(60, 335)
     .lineTo(width - 60, 335)
     .lineWidth(1)
     .stroke('#334155');

  // Signatures Section (Left & Center-Left)
  doc.fillColor('#FFFFFF')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('Dr. Celestius Chief', 80, 360);
  doc.fillColor('#64748B')
     .fontSize(10)
     .font('Helvetica')
     .text('Faculty Coordinator', 80, 376);

  doc.fillColor('#FFFFFF')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('Celestius Event Lead', 260, 360);
  doc.fillColor('#64748B')
     .fontSize(10)
     .font('Helvetica')
     .text('Club President', 260, 376);

  // Verification Info (Right Side)
  doc.fillColor('#94A3B8')
     .fontSize(9)
     .font('Helvetica-Bold')
     .text(`ID: ${credential.credentialId}`, width - 360, 360, { width: 170, align: 'right' });

  doc.fillColor('#64748B')
     .fontSize(8)
     .font('Helvetica')
     .text('Verify authenticity at /credential/' + credential.credentialId, width - 360, 378, { width: 170, align: 'right' });
}

function renderPassPDF(doc, width, height, credential, participant, event, templateKey) {
  const bgDark = '#07090C';
  const cardBg = '#0C0F12';
  const tealGreen = '#10B981';
  const yellowPill = '#FACC15';

  // Pass dimensions (Landscape style matching reference design)
  const passW = 500;
  const passH = 320;
  const passX = (width - passW) / 2;
  const passY = (height - passH) / 2;

  // Outer Page Fill
  doc.rect(0, 0, width, height).fill(bgDark);

  // Main Card Container
  doc.rect(passX, passY, passW, passH).fill(cardBg);
  doc.rect(passX, passY, passW, passH).lineWidth(1.5).stroke('#1E293B');

  // Top Header: Celestius Yellow Pill Logo
  doc.roundedRect(passX + 20, passY + 16, 110, 24, 12).fill(yellowPill);
  doc.fillColor('#0A0D12')
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('$ celestius', passX + 20, passY + 22, { width: 110, align: 'center' });

  // Top Header Right: PROMPT VERSE 2.0 Branding
  doc.fillColor('#FFFFFF')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('PROMPT VERSE 2.0', passX + passW - 200, passY + 20, { width: 180, align: 'right' });

  // Header Underline Divider
  doc.moveTo(passX + 20, passY + 50)
     .lineTo(passX + passW - 20, passY + 50)
     .lineWidth(1)
     .stroke('#151D28');

  // Left Column Details (Pass Holder, Reg No, Department, Year, Email, Mobile)
  const leftX = passX + 24;
  const col2X = passX + 180;

  // Row 1: Pass Holder & Reg Number
  doc.fillColor(tealGreen).fontSize(8).font('Helvetica-Bold').text('PASS HOLDER', leftX, passY + 65);
  doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(participant.name || 'Aakash Raj S', leftX, passY + 77);

  doc.fillColor(tealGreen).fontSize(8).font('Helvetica-Bold').text('REG NUMBER', col2X, passY + 65);
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text(participant.registerNumber || '210425205139', col2X, passY + 77);

  // Row 2: Department & Year
  doc.fillColor(tealGreen).fontSize(8).font('Helvetica-Bold').text('DEPARTMENT', leftX, passY + 105);
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text(participant.department || 'ECE', leftX, passY + 117);

  doc.fillColor(tealGreen).fontSize(8).font('Helvetica-Bold').text('YEAR', col2X, passY + 105);
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('II YEAR', col2X, passY + 117);

  // Row 3: Email & Mobile
  const displayEmail = (participant.email || 'saakashraj.it2025@citchennai.edu.in');
  const truncatedEmail = displayEmail.length > 22 ? displayEmail.substring(0, 19) + '...' : displayEmail;

  doc.fillColor(tealGreen).fontSize(8).font('Helvetica-Bold').text('EMAIL', leftX, passY + 145);
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text(truncatedEmail, leftX, passY + 157);

  doc.fillColor(tealGreen).fontSize(8).font('Helvetica-Bold').text('MOBILE', col2X, passY + 145);
  doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold').text(participant.phone || '6875546133', col2X, passY + 157);

  // Row 4: Registration Date & Secure Tag
  doc.moveTo(leftX, passY + 185)
     .lineTo(passX + 310, passY + 185)
     .lineWidth(0.5)
     .stroke('#151D28');

  doc.fillColor('#059669').fontSize(7).font('Helvetica-Bold').text('REG DATE: 20 JUL 2026, 5:43 PM', leftX, passY + 192);
  doc.fillColor('#059669').fontSize(7).font('Helvetica-Bold').text('[GATEWAY_SECURE]', passX + 230, passY + 192);

  // Vertical Dashed Separator
  doc.moveTo(passX + 325, passY + 60)
     .lineTo(passX + 325, passY + 210)
     .dash(4, { space: 3 })
     .lineWidth(1)
     .stroke('#15232E');
  doc.undash();

  // Right Column: Date & Location
  const rightX = passX + 345;
  const eventDateStr = '10 July 2026';

  doc.fillColor(tealGreen).fontSize(12).font('Helvetica-Bold').text('•', rightX, passY + 100);
  doc.fillColor('#CBD5E1').fontSize(11).font('Helvetica-Bold').text(eventDateStr, rightX + 15, passY + 100);

  doc.fillColor(tealGreen).fontSize(12).font('Helvetica-Bold').text('•', rightX, passY + 140);
  doc.fillColor('#CBD5E1').fontSize(11).font('Helvetica-Bold').text('CIT Campus', rightX + 15, passY + 140);

  // Bottom Section: Simulated Vector Barcode Lines & Credential String (No QR Code)
  doc.moveTo(passX + 20, passY + 225)
     .lineTo(passX + passW - 20, passY + 225)
     .lineWidth(0.5)
     .stroke('#151D28');

  // Vector Barcode Lines
  const barcodeXStart = passX + (passW - 220) / 2;
  const barcodeYStart = passY + 240;
  const barcodePattern = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2
  ];

  let currX = barcodeXStart;
  barcodePattern.forEach((w) => {
    doc.rect(currX, barcodeYStart, w * 1.2, 32).fill(tealGreen);
    currX += w * 1.2 + 2;
  });

  // Barcode Registration Code
  const passRegCode = `PV2 - REG - ${participant.registerNumber || '210425205139'} - ${credential.credentialId || '2ZEEHTCA'}`;
  doc.fillColor(tealGreen)
     .fontSize(9)
     .font('Helvetica-Bold')
     .text(passRegCode, passX, passY + 284, { width: passW, align: 'center' });
}

module.exports = {
  generateCredentialPDF
};
