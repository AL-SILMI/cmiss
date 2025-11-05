require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const todosRouter = require('./routes/todos');
const authRouter = require('./routes/auth');
const studentsRouter = require('./routes/students');
const staffRouter = require('./routes/staff');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cmis';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

mongoose.set('strictQuery', true);

app.use(cors({ 
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/todos', todosRouter);
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/courses', require('./routes/courses'));
app.use('/api/staff', staffRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Process error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Start server
// Restarting server to attempt reconnection
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Only start local server if not in Vercel environment
    if (process.env.VERCEL !== '1') {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  startServer();
}

// Export for Vercel
module.exports = app;
