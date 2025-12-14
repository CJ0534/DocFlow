const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbAll, dbGet } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create project in organization
router.post('/orgs/:orgId/projects', async (req, res) => {
    try {
        const { orgId } = req.params;
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        // Verify organization belongs to user
        const org = await dbGet('SELECT * FROM organizations WHERE id = ? AND user_id = ?', [orgId, req.userId]);
        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        const projectId = uuidv4();
        await dbRun('INSERT INTO projects (id, name, org_id) VALUES (?, ?, ?)', [projectId, name.trim(), orgId]);

        const project = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);

        res.status(201).json({
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get organization's projects
router.get('/orgs/:orgId/projects', async (req, res) => {
    try {
        const { orgId } = req.params;

        // Verify organization belongs to user
        const org = await dbGet('SELECT * FROM organizations WHERE id = ? AND user_id = ?', [orgId, req.userId]);
        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        const projects = await dbAll('SELECT * FROM projects WHERE org_id = ? ORDER BY created_at DESC', [orgId]);

        res.json({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

module.exports = router;
