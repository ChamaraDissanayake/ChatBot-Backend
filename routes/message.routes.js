import express from 'express';
import {
  sendMessage,
  sendTemplateMessage,
  storeIncomingMessage,
  handleStatusCallback,
  getChatHistory,
} from '../services/message.service.js';

const router = express.Router();

// Send a WhatsApp message
router.post('/send', async (req, res) => {
  try {
    const { to, body } = req.body;
    const message = await sendMessage(to, body);
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send a template message
router.post('/send-template', async (req, res) => {
  try {
    const { to, clientName } = req.body;
    const message = await sendTemplateMessage(to, clientName);
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending template message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle incoming messages (Twilio webhook)
router.post('/incoming', async (req, res) => {
  try {
    console.log('Incoming message payload:', req.body);

    // Process the incoming message
    const { From, Body } = req.body;
    if (!From || !Body) {
      return res.status(400).json({ error: 'Missing required fields: From, Body' });
    }

    // Save the message to Firestore or perform other actions
    await addDoc(messagesRef, { from: From, body: Body, timestamp: new Date() });

    // Respond to Twilio
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Error handling incoming message:', error);
    res.status(500).send('<Response><Message>Internal Server Error</Message></Response>');
  }
});

// Handle status callbacks (Twilio webhook)
router.post('/status', async (req, res) => {
  const { MessageStatus, MessageSid } = req.body;
  try {
    await handleStatusCallback(MessageSid, MessageStatus);
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Error handling status callback:', error);
    res.status(500).send('<Response></Response>');
  }
});

// Get chat history for a specific phone number
router.get('/history/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const chatHistory = await getChatHistory(phoneNumber);
    res.json(chatHistory);
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;