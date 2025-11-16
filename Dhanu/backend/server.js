// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware
app.use(express.json());
// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Update this with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection URL (replace with your own)
const MONGO_URI = 'mongodb://localhost:27017/hospitalManagement';
// If using MongoDB Atlas, it looks like this:
// const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase';

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Import routes
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

// Use routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Example route
app.get('/', (req, res) => {
    res.send('Server is running and MongoDB is connected!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
