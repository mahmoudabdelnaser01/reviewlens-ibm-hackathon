/**
 * ReviewLens Backend Server
 * 
 * Express server that provides API endpoints for review analysis
 * using IBM Bob as the AI engine.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['IBM_WATSONX_API_KEY', 'IBM_WATSONX_API_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env file based on .env.example');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', analyzeRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ReviewLens API',
    version: '1.0.0',
    description: 'AI-powered review analysis using IBM watsonx.ai',
    endpoints: {
      health: '/api/health',
      analyze: 'POST /api/analyze'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An internal server error occurred' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🔍 ReviewLens Backend Server');
  console.log('================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Frontend URL: ${FRONTEND_URL}`);
  console.log(`✅ IBM watsonx.ai API configured`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - POST http://localhost:${PORT}/api/analyze`);
  console.log('\n================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Made with Bob
