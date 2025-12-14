const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbAll, dbGet } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create organization
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Organization name is required' });
        }

        const orgId = uuidv4();
        await dbRun('INSERT INTO organizations (id, name, user_id) VALUES (?, ?, ?)', [orgId, name.trim(), req.userId]);

        const org = await dbGet('SELECT * FROM organizations WHERE id = ?', [orgId]);

        res.status(201).json({
            message: 'Organization created successfully',
            organization: org
        });
    } catch (error) {
        console.error('Create organization error:', error);
        res.status(500).json({ error: 'Failed to create organization' });
    }
});

// Get user's organizations
router.get('/', async (req, res) => {
    try {
        const organizations = await dbAll('SELECT * FROM organizations WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);

        res.json({ organizations });
    } catch (error) {
        console.error('Get organizations error:', error);
        res.status(500).json({ error: 'Failed to fetch organizations' });
    }
});

module.exports = router;
