const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Template = require('../models/Template');
const Credential = require('../models/Credential');

async function seedDatabase(force = false) {
  try {
    const existingEventsCount = await Event.countDocuments();
    const existingParticipantsCount = await Participant.countDocuments();

    if (existingEventsCount > 0 && existingParticipantsCount > 0 && !force) {
      console.log(`ℹ️ Database already contains ${existingEventsCount} events and ${existingParticipantsCount} participants.`);
      return { seeded: false };
    }

    if (force) {
      console.log('🧹 Force reset requested. Cleaning existing database collections...');
      try {
        await Participant.collection.dropIndexes();
      } catch (idxErr) {
        // Ignore if collection doesn't exist
      }
      await Promise.all([
        Event.deleteMany({}),
        Participant.deleteMany({}),
        Template.deleteMany({}),
        Credential.deleteMany({})
      ]);
    }

    console.log('🌱 Seeding Club Celestius events & multi-event sample participants...');

    // Event 1: PromptVerse 2.0
    const pv2Event = new Event({
      eventName: 'PromptVerse 2.0',
      slug: 'promptverse-2-0',
      description: 'The premier Prompt Engineering & Generative AI event hosted by Club Celestius.',
      eventDate: new Date('2026-07-10'),
      createdBy: 'Club Celestius Core Team'
    });
    await pv2Event.save();

    // Event 2: PromptVerse 3.0
    const pv3Event = new Event({
      eventName: 'PromptVerse 3.0',
      slug: 'promptverse-3-0',
      description: 'The flagship AI & Prompt Engineering Hackathon hosted by Club Celestius.',
      eventDate: new Date('2026-07-10'),
      createdBy: 'Club Celestius Core Team'
    });
    await pv3Event.save();

    // Register Entry Pass Templates
    await Template.insertMany([
      { eventId: pv2Event._id, templateKey: 'pv2-entry-pass', displayName: 'PromptVerse 2.0 Entry Pass', componentName: 'PromptVerse2EntryPass' },
      { eventId: pv2Event._id, templateKey: 'celestius-standard-entry-pass', displayName: 'Celestius Standard Entry Pass', componentName: 'CelestiusStandardEntryPass' },
      { eventId: pv3Event._id, templateKey: 'pv2-entry-pass', displayName: 'PromptVerse 2.0 Entry Pass', componentName: 'PromptVerse2EntryPass' },
      { eventId: pv3Event._id, templateKey: 'celestius-standard-entry-pass', displayName: 'Celestius Standard Entry Pass', componentName: 'CelestiusStandardEntryPass' }
    ]);

    // Sample Participants for PromptVerse 2.0
    const pv2Participants = await Participant.insertMany([
      {
        eventId: pv2Event._id,
        name: 'Aakash Raj S',
        registerNumber: '210425205139',
        department: 'Computer Science & Engineering',
        email: 'saakashraj.it2025@citchennai.edu.in',
        phone: '6875546133'
      },
      {
        eventId: pv2Event._id,
        name: 'Sophia Sharma',
        registerNumber: '210425205140',
        department: 'CSE',
        email: 'sophia@celestius.org',
        phone: '9876543210'
      },
      {
        eventId: pv2Event._id,
        name: 'Marcus Vance',
        registerNumber: '210425205141',
        department: 'AI & DS',
        email: 'marcus@celestius.org',
        phone: '9876543211'
      }
    ]);

    // Sample Participants for PromptVerse 3.0 (Same student Aakash Raj S participating in PV3 as well!)
    const pv3Participants = await Participant.insertMany([
      {
        eventId: pv3Event._id,
        name: 'Aakash Raj S',
        registerNumber: '210425205139',
        department: 'Computer Science & Engineering',
        email: 'saakashraj.it2025@citchennai.edu.in',
        phone: '6875546133'
      },
      {
        eventId: pv3Event._id,
        name: 'Priya Ramesh',
        registerNumber: '210425205142',
        department: 'IT',
        email: 'priya@celestius.org',
        phone: '9876543212'
      },
      {
        eventId: pv3Event._id,
        name: 'Rohan Verma',
        registerNumber: '210425205143',
        department: 'ECE',
        email: 'rohan@celestius.org',
        phone: '9876543213'
      }
    ]);

    // Issue Sample Credentials for PromptVerse 2.0
    await Credential.create({
      participantId: pv2Participants[0]._id,
      eventId: pv2Event._id,
      templateKey: 'pv2-entry-pass',
      credentialId: 'CFY-8A2X7M91',
      issuedAt: new Date()
    });

    await Credential.create({
      participantId: pv2Participants[1]._id,
      eventId: pv2Event._id,
      templateKey: 'pv2-entry-pass',
      credentialId: 'CFY-9B3Y8N02',
      issuedAt: new Date()
    });

    // Issue Sample Credential for PromptVerse 3.0 (Aakash Raj S's second event credential)
    await Credential.create({
      participantId: pv3Participants[0]._id,
      eventId: pv3Event._id,
      templateKey: 'celestius-standard-entry-pass',
      credentialId: 'CFY-3C4Z9P03',
      issuedAt: new Date()
    });

    console.log('✅ Database seeded successfully with PromptVerse 2.0 and PromptVerse 3.0 events, participants, and credentials.');
    return { seeded: true, events: [pv2Event, pv3Event] };
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    throw error;
  }
}

module.exports = { seedDatabase };
