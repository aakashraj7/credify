const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// GET /api/templates - List templates
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) {
      filter.eventId = req.query.eventId;
    }

    const templates = await Template.find(filter).populate('eventId', 'eventName slug');
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/templates - Register a code template for an event
router.post('/', async (req, res) => {
  try {
    const { eventId, templateKey, displayName, componentName, previewImage } = req.body;

    if (!eventId || !templateKey || !displayName || !componentName) {
      return res.status(400).json({ success: false, message: 'All required template parameters must be provided.' });
    }

    // Check if template key already exists for this event
    let template = await Template.findOne({ eventId, templateKey });
    if (template) {
      template.displayName = displayName;
      template.componentName = componentName;
      template.previewImage = previewImage || template.previewImage;
      await template.save();
    } else {
      template = new Template({
        eventId,
        templateKey,
        displayName,
        componentName,
        previewImage: previewImage || '',
        isActive: true
      });
      await template.save();
    }

    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/templates/:id/toggle - Toggle active state
router.patch('/:id/toggle', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    template.isActive = !template.isActive;
    await template.save();

    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
