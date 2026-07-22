const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const Credential = require('../models/Credential');

// GET /api/participants - List participants
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) {
      filter.eventId = req.query.eventId;
    }

    const participants = await Participant.find(filter)
      .populate('eventId', 'eventName slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, participants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/participants - Add single participant
router.post('/', async (req, res) => {
  try {
    const { eventId, name, registerNumber, department, email, phone } = req.body;

    if (!eventId || !name || !registerNumber || !department || !email) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    const participant = new Participant({
      eventId,
      name,
      registerNumber,
      department,
      email,
      phone: phone || ''
    });

    await participant.save();

    res.status(201).json({ success: true, participant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/participants/bulk - Bulk import participants (JSON array)
router.post('/bulk', async (req, res) => {
  try {
    const { eventId, participants } = req.body;

    if (!eventId || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ success: false, message: 'Event ID and valid participants array required.' });
    }

    const docsToInsert = participants.map((p) => ({
      eventId,
      name: p.name || 'Participant',
      registerNumber: p.registerNumber || 'N/A',
      department: p.department || 'General',
      email: p.email || 'participant@celestius.org',
      phone: p.phone || ''
    }));

    const inserted = await Participant.insertMany(docsToInsert);

    res.status(201).json({
      success: true,
      count: inserted.length,
      participants: inserted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/participants/:id
router.delete('/:id', async (req, res) => {
  try {
    const participantId = req.params.id;
    await Participant.findByIdAndDelete(participantId);
    await Credential.deleteMany({ participantId });

    res.json({ success: true, message: 'Participant deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
