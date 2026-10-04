require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB schemas
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  cls: { type: String, required: true, trim: true, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  course: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, trim: true, maxlength: 2000 }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);

// API health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Hassan Sir website API is running' });
});

// Save feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, cls, rating, message } = req.body;
    if (!name || !cls || !rating || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all feedback fields.' });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const feedback = await Feedback.create({
      name, cls, rating: numericRating, message
    });

    res.status(201).json({
      success: true,
      message: 'Feedback saved successfully.',
      feedback: {
        id: feedback._id,
        name: feedback.name,
        cls: feedback.cls,
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ success: false, message: 'Could not save feedback.' });
  }
});

// Get recent feedback for the public feedback page
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('name cls rating message createdAt');

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ success: false, message: 'Could not load feedback.' });
  }
});

// Save admission enquiry
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, phone, course, message } = req.body;
    if (!name || !phone || !course) {
      return res.status(400).json({ success: false, message: 'Name, phone and course are required.' });
    }

    const enquiry = await Enquiry.create({
      name, phone, course, message: message || ''
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry saved successfully.',
      enquiryId: enquiry._id
    });
  } catch (error) {
    console.error('Enquiry error:', error);
    res.status(500).json({ success: false, message: 'Could not save enquiry.' });
  }
});

// Serve the website
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Create a .env file using .env.example.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully.');
    app.listen(PORT, () => {
      console.log(`Website running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
