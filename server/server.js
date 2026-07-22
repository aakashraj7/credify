const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const eventsRouter = require('./routes/events');
const participantsRouter = require('./routes/participants');
const templatesRouter = require('./routes/templates');
const credentialsRouter = require('./routes/credentials');

const Event = require('./models/Event');
const Participant = require('./models/Participant');
const Template = require('./models/Template');
const Credential = require('./models/Credential');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/credentials', credentialsRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Credify by Celestius',
    timestamp: new Date().toISOString()
  });
});

const { seedDatabase } = require('./utils/seedData');

// Connect to MongoDB & Start Server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/credify';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log(`⚡ Connected to MongoDB at ${MONGODB_URI}`);
    await seedDatabase(false);
    app.listen(PORT, () => {
      console.log(`🚀 Credify Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn(`⚠️ MongoDB connection warning: ${err.message}. Running fallback mode.`);
    app.listen(PORT, () => {
      console.log(`🚀 Credify Server running on http://localhost:${PORT}`);
    });
  });
