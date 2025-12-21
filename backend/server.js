require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/organizations');
const projectRoutes = require('./routes/projects');
const documentRoutes = require('./routes/documents');

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DocFlow API is running with Supabase support',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/orgs', orgRoutes);
app.use('/', projectRoutes); // /orgs/:orgId/projects
app.use('/', documentRoutes); // /projects/:projectId/documents, /documents/:documentId/extract

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 DocFlow API listening on http://0.0.0.0:${PORT}`);
  console.log('✅ Supabase Mode Enabled');
  console.log(`📡 API Endpoints:`);
  console.log(`   POST /auth/register`);
  console.log(`   POST /auth/login`);
  console.log(`   POST /orgs (auth)`);
  console.log(`   GET /orgs (auth)`);
  console.log(`   POST /orgs/:orgId/projects (auth)`);
  console.log(`   GET /orgs/:orgId/projects (auth)`);
  console.log(`   POST /projects/:projectId/documents (auth, multipart)`);
  console.log(`   GET /projects/:projectId/documents (auth)`);
  console.log(`   POST /documents/:documentId/extract (auth)`);
});
