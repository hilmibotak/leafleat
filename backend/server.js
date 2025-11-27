require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);  // Tambahkan ini untuk debug

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));  // Tambahkan ini

// Routes
app.use('/api/locations', locationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});