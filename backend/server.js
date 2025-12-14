require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./config/database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/orgs', require('./routes/organizations'));
app.use('/', require('./routes/projects'));
app.use('/', require('./routes/documents'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'DocFlow API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to DocFlow API',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /auth/register',
                login: 'POST /auth/login'
            },
            organizations: {
                create: 'POST /orgs',
                list: 'GET /orgs'
            },
            projects: {
                create: 'POST /orgs/:orgId/projects',
                list: 'GET /orgs/:orgId/projects'
            },
            documents: {
                upload: 'POST /projects/:projectId/documents',
                list: 'GET /projects/:projectId/documents',
                extract: 'POST /documents/:documentId/extract'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🚀 DocFlow API Server                   ║
║                                           ║
║   Status: Running                         ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV}            ║
║                                           ║
║   Endpoints: http://localhost:${PORT}        ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});
