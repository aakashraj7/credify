const express = require('express');
const router = express.Router();
const Credential = require('../models/Credential');
const Participant = require('../models/Participant');
const Event = require('../models/Event');
const Template = require('../models/Template');
const { generateCredentialId } = require('../utils/generateId');
const { generateCredentialPDF } = require('../services/pdfService');

// GET /api/credentials - List all credentials
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.participantId) filter.participantId = req.query.participantId;
    if (req.query.templateKey) filter.templateKey = req.query.templateKey;

    const credentials = await Credential.find(filter)
      .populate('participantId')
      .populate('eventId')
      .sort({ issuedAt: -1 });

    res.json({ success: true, credentials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/credentials/generate - Issue credentials for participants
router.post('/generate', async (req, res) => {
  try {
    const { eventId, templateKey, participantIds } = req.body;

    if (!eventId || !templateKey) {
      return res.status(400).json({ success: false, message: 'Event ID and Template Key are required.' });
    }

    // Determine target participants (either specific list or all participants in event)
    let participants = [];
    if (Array.isArray(participantIds) && participantIds.length > 0) {
      participants = await Participant.find({ _id: { $in: participantIds }, eventId });
    } else {
      participants = await Participant.find({ eventId });
    }

    if (participants.length === 0) {
      return res.status(400).json({ success: false, message: 'No participants found to generate credentials for.' });
    }

    const generatedCredentials = [];

    for (const participant of participants) {
      // Check if credential already exists for this participant + templateKey
      let credential = await Credential.findOne({
        participantId: participant._id,
        eventId,
        templateKey
      });

      if (!credential) {
        let uniqueId = generateCredentialId();
        // Ensure uniqueness
        while (await Credential.findOne({ credentialId: uniqueId })) {
          uniqueId = generateCredentialId();
        }

        credential = new Credential({
          participantId: participant._id,
          eventId,
          templateKey,
          credentialId: uniqueId,
          issuedAt: new Date()
        });

        await credential.save();
      }

      generatedCredentials.push(credential);
    }

    const populatedDocs = await Credential.find({
      _id: { $in: generatedCredentials.map((c) => c._id) }
    }).populate('participantId').populate('eventId');

    res.status(201).json({
      success: true,
      count: populatedDocs.length,
      credentials: populatedDocs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUBLIC ROUTE: GET /api/credentials/by-id/:credentialId
router.get('/by-id/:credentialId', async (req, res) => {
  try {
    const credential = await Credential.findOne({ credentialId: req.params.credentialId.toUpperCase() })
      .populate('participantId')
      .populate('eventId');

    if (!credential) {
      return res.status(404).json({ success: false, message: 'Invalid Credential ID.' });
    }

    const template = await Template.findOne({
      eventId: credential.eventId._id,
      templateKey: credential.templateKey
    });

    res.json({
      success: true,
      credential,
      participant: credential.participantId,
      event: credential.eventId,
      template: template || {
        templateKey: credential.templateKey,
        displayName: `${credential.templateKey.toUpperCase()} Credential`,
        componentName: 'DefaultTemplate'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUBLIC DYNAMIC PDF DOWNLOAD ROUTE: GET /api/credentials/:credentialId/pdf
router.get('/:credentialId/pdf', async (req, res) => {
  try {
    const credential = await Credential.findOne({ credentialId: req.params.credentialId.toUpperCase() })
      .populate('participantId')
      .populate('eventId');

    if (!credential) {
      return res.status(404).json({ success: false, message: 'Invalid Credential ID for PDF generation.' });
    }

    const pdfBuffer = await generateCredentialPDF({
      credential,
      participant: credential.participantId,
      event: credential.eventId,
      templateKey: credential.templateKey
    });

    const safeParticipantName = credential.participantId.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Celestius_${credential.templateKey}_${credential.credentialId}_${safeParticipantName}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate dynamic PDF stream.' });
  }
});

module.exports = router;
