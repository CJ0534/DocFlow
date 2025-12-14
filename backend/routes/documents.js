const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const { dbRun, dbAll, dbGet } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { extractDocument } = require('../services/extractionService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// All routes require authentication
router.use(authMiddleware);

// Upload document to project
router.post('/projects/:projectId/documents', upload.single('file'), async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Verify project exists and belongs to user's organization
        const project = await dbGet(`
      SELECT p.* FROM projects p
      JOIN organizations o ON p.org_id = o.id
      WHERE p.id = ? AND o.user_id = ?
    `, [projectId, req.userId]);

        if (!project) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'Project not found' });
        }

        // Create document record
        const documentId = uuidv4();
        const mimeType = mime.lookup(req.file.originalname) || req.file.mimetype;

        await dbRun(`
      INSERT INTO documents (id, filename, original_name, file_size, mime_type, project_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [documentId, req.file.filename, req.file.originalname, req.file.size, mimeType, projectId, 'uploaded']);

        // Create storage directory structure
        const storageDir = path.join(__dirname, '..', 'storage', projectId, documentId);
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }

        // Move file to storage directory
        const finalPath = path.join(storageDir, req.file.originalname);
        fs.renameSync(req.file.path, finalPath);

        const document = await dbGet('SELECT * FROM documents WHERE id = ?', [documentId]);

        res.status(201).json({
            message: 'Document uploaded successfully',
            document
        });
    } catch (error) {
        console.error('Upload document error:', error);
        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

// Get project's documents
router.get('/projects/:projectId/documents', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify project belongs to user's organization
        const project = await dbGet(`
      SELECT p.* FROM projects p
      JOIN organizations o ON p.org_id = o.id
      WHERE p.id = ? AND o.user_id = ?
    `, [projectId, req.userId]);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const documents = await dbAll('SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC', [projectId]);

        res.json({ documents });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// Extract document
router.post('/documents/:documentId/extract', async (req, res) => {
    try {
        const { documentId } = req.params;

        // Get document and verify ownership
        const document = await dbGet(`
      SELECT d.*, p.id as project_id, p.org_id FROM documents d
      JOIN projects p ON d.project_id = p.id
      JOIN organizations o ON p.org_id = o.id
      WHERE d.id = ? AND o.user_id = ?
    `, [documentId, req.userId]);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Update status to processing
        await dbRun('UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['processing', documentId]);

        // Perform extraction
        const result = await extractDocument(document);

        res.json({
            message: 'Extraction completed',
            document: result
        });
    } catch (error) {
        console.error('Extract document error:', error);
        res.status(500).json({ error: 'Failed to extract document' });
    }
});

module.exports = router;
