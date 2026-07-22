const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  templateKey: {
    type: String,
    required: true,
    trim: true
  },
  credentialId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Credential', credentialSchema);
