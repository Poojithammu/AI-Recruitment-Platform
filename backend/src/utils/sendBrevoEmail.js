const sendBrevoEmail = async ({ to, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_SENDER || 'no-reply@aihiringsystem.com';
  const senderName = 'AI Hiring System';

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Brevo API error:', data);
      throw new Error(data.message || 'Failed to send email via Brevo');
    }

    return data;
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    throw error;
  }
};

module.exports = sendBrevoEmail;
