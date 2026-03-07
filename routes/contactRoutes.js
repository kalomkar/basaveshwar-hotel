const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailService');

router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ message: 'Name and message are required' });
    }

    const success = await sendEmail({
        subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
        html: `
            <h2>New Contact Inquiry</h2>
            <p><strong>From:</strong> ${name} (${email || 'No email provided'})</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
        `
    });

    if (success) {
        res.json({ message: 'Message sent successfully' });
    } else {
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;
