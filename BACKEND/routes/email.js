const express = require('express');
const authMiddleware = require('../middleware/auth');
const { sendMail } = require('../services/email');

const router = express.Router();


router.post('/send', authMiddleware, async (req, res) => {
  try {
    const {
      to,
      subject,
      text,
      html,
      from,
      replyTo,
      cc,
      bcc,
      attachments,
      categories,
      customArgs,
      headers,
    } = req.body || {};
    if (!to || !subject) {
      return res.status(400).json({ message: 'Parametri mancanti: to e subject sono obbligatori' });
    }

    const result = await sendMail({
      to,
      subject,
      text,
      html,
      from,
      replyTo,
      cc,
      bcc,
      attachments,
      categories,
      customArgs,
      headers,
    });
    return res.json({
      message: 'Email inviata',
      status: result.status,
      messageId: result.messageId,
      provider: result.provider,
      headers: result?.headers || undefined,
    });
  } catch (err) {
    if (err?.code === 'EMAIL_NOT_CONFIGURED') {
      return res.status(500).json({ message: 'Email non configurata. Imposta Gmail (GMAIL_USER + GMAIL_APP_PASSWORD) oppure SMTP (EMAIL_HOST/PORT/USER/PASSWORD) nel file .env' });
    }
    const details = err?.details || undefined;
    return res.status(500).json({ message: 'Errore invio email', error: err?.message, details });
  }
});

module.exports = router;
