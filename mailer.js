const nodemailer = require('nodemailer');

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Check if a real Gmail App Password is configured (16 chars, no spaces)
  const isRealCreds = emailUser && emailPass &&
    !emailPass.includes('your_16_char') &&
    emailPass.replace(/\s/g, '').length >= 16;

  if (isRealCreds) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass.replace(/\s/g, '') // strip spaces if user added them
      }
    });
    console.log('Email: Using Gmail account:', emailUser);
  } else {
    // Fallback to Ethereal test account — emails are NOT delivered, only previewed
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('---------------------------------------------------');
    console.log('WARNING: Real Gmail App Password not set in .env');
    console.log('Using Ethereal test email — emails are NOT delivered');
    console.log('Test inbox:', testAccount.user);
    console.log('To enable real email:');
    console.log('  1. Enable 2FA on your Google account');
    console.log('  2. Go to: Google Account → Security → App Passwords');
    console.log('  3. Generate one for "Mail"');
    console.log('  4. Paste the 16-char code into .env as EMAIL_PASS');
    console.log('---------------------------------------------------');
  }
  return transporter;
}

async function sendSubmissionEmail(toEmail, { vajra_id, technician_name, form_id, isResubmit }) {
  try {
    const t = await getTransporter();
    const subject = isResubmit
      ? `Form Updated & Resubmitted: Vajra ID ${vajra_id || 'N/A'}`
      : `New Form Submitted: Vajra ID ${vajra_id || 'N/A'}`;
    const heading = isResubmit ? 'Form Updated &amp; Resubmitted' : 'New Form Submission';
    const bodyText = isResubmit
      ? 'A previously approved job card has been <strong>updated and resubmitted</strong> by the technician. Please review the changes.'
      : 'A new job card form has been submitted and is awaiting your review.';
    const info = await t.sendMail({
      from: process.env.EMAIL_FROM || '"Vajra App" <noreply@vajra.com>',
      to: toEmail,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
          <div style="background:#1a3a5c;color:white;padding:20px;">
            <h2 style="margin:0;">Vajra Testing Job Card</h2>
            <p style="margin:5px 0 0;">${heading}</p>
          </div>
          <div style="padding:20px;">
            <p>${bodyText}</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Vajra ID</td><td style="padding:8px;">${vajra_id || 'N/A'}</td></tr>
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Submitted By</td><td style="padding:8px;">${technician_name}</td></tr>
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Form ID</td><td style="padding:8px;">#${form_id}</td></tr>
            </table>
            <p style="margin-top:20px;">Please log in to review and approve or reject this form.</p>
            <p style="margin-top:8px;"><a href="http://localhost:3000/head-office.html" style="background:#1a3a5c;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Open Vajra App</a></p>
          </div>
        </div>
      `
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Ethereal preview (not a real email):', previewUrl);
    } else {
      console.log('Submission email sent to:', toEmail);
    }
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

async function sendReviewEmail(toEmail, { vajra_id, action, comments, reviewer_name, form_id }) {
  try {
    const t = await getTransporter();
    const color = action === 'approved' ? '#27ae60' : '#e74c3c';
    const label = action === 'approved' ? 'APPROVED' : 'REJECTED';
    const info = await t.sendMail({
      from: process.env.EMAIL_FROM || '"Vajra App" <noreply@vajra.com>',
      to: toEmail,
      subject: `Form ${label}: Vajra ID ${vajra_id || 'N/A'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
          <div style="background:#1a3a5c;color:white;padding:20px;">
            <h2 style="margin:0;">Vajra Testing Job Card</h2>
            <p style="margin:5px 0 0;">Form Review Decision</p>
          </div>
          <div style="padding:20px;">
            <p>Your submitted job card has been reviewed.</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Vajra ID</td><td style="padding:8px;">${vajra_id || 'N/A'}</td></tr>
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Form ID</td><td style="padding:8px;">#${form_id}</td></tr>
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Decision</td><td style="padding:8px;"><span style="background:${color};color:white;padding:3px 10px;border-radius:4px;font-weight:bold;">${label}</span></td></tr>
              <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Reviewed By</td><td style="padding:8px;">${reviewer_name}</td></tr>
              ${comments ? `<tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Comments</td><td style="padding:8px;">${comments}</td></tr>` : ''}
            </table>
          </div>
        </div>
      `
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Ethereal preview (not a real email):', previewUrl);
    } else {
      console.log('Review email sent to:', toEmail);
    }
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

module.exports = { sendSubmissionEmail, sendReviewEmail };
