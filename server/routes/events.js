const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Template = require('../models/Template');
const Credential = require('../models/Credential');

// Helper to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const { seedDatabase } = require('../utils/seedData');

// POST /api/events/seed - Force seed or re-seed sample events & participants
router.post('/seed', async (req, res) => {
  try {
    const result = await seedDatabase(true);
    res.json({ success: true, message: 'Database seeded successfully!', result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/events - Get all events with stats
router.get('/', async (req, res) => {
  try {
    await seedDatabase(false);
    const events = await Event.find().sort({ createdAt: -1 });

    // Aggregate stats for each event
    const eventsWithStats = await Promise.all(
      events.map(async (ev) => {
        const participantCount = await Participant.countDocuments({ eventId: ev._id });
        const templateCount = await Template.countDocuments({ eventId: ev._id });
        const credentialCount = await Credential.countDocuments({ eventId: ev._id });

        return {
          ...ev.toObject(),
          stats: {
            participants: participantCount,
            templates: templateCount,
            credentials: credentialCount
          }
        };
      })
    );

    res.json({ success: true, events: eventsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/events - Create new event
router.get('/slug-check/:slug', async (req, res) => {
  try {
    const existing = await Event.findOne({ slug: req.params.slug });
    res.json({ exists: !!existing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { eventName, description, eventDate, createdBy } = req.body;

    if (!eventName || !eventDate) {
      return res.status(400).json({ success: false, message: 'Event Name and Date are required.' });
    }

    let slug = slugify(eventName);
    let existingSlug = await Event.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newEvent = new Event({
      eventName,
      slug,
      description: description || '',
      eventDate: new Date(eventDate),
      createdBy: createdBy || 'Celestius Organizer'
    });

    await newEvent.save();

    // Auto-register default code templates for this event
    const defaultTemplates = [
      { templateKey: 'pv2-entry-pass', displayName: 'PromptVerse 2.0 Entry Pass', componentName: 'PromptVerse2EntryPass' },
      { templateKey: 'celestius-standard-entry-pass', displayName: 'Celestius Standard Entry Pass', componentName: 'CelestiusStandardEntryPass' }
    ];

    await Template.insertMany(
      defaultTemplates.map((t) => ({
        eventId: newEvent._id,
        templateKey: t.templateKey,
        displayName: t.displayName,
        componentName: t.componentName,
        isActive: true
      }))
    );

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/events/:id - Get detailed event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const participants = await Participant.find({ eventId: event._id }).sort({ createdAt: -1 });
    const templates = await Template.find({ eventId: event._id });
    const credentials = await Credential.find({ eventId: event._id }).populate('participantId');

    res.json({
      success: true,
      event,
      participants,
      templates,
      credentials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/events/:id - Delete event and clean up related docs
router.delete('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    await Participant.deleteMany({ eventId });
    await Template.deleteMany({ eventId });
    await Credential.deleteMany({ eventId });

    res.json({ success: true, message: 'Event and related data deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
