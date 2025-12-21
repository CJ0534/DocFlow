const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabaseAuth = require('../middleware/supabaseAuth');

const router = express.Router();

// All routes require authentication
router.use(supabaseAuth);

// Create project in organization
router.post('/orgs/:orgId/projects', async (req, res) => {
  try {
    const { orgId } = req.params;
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: req.headers.authorization,
          },
        },
      }
    );

    // Verify organization belongs to user
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', orgId)
      .eq('user_id', req.user.id)
      .limit(1);

    if (orgError || !orgs || orgs.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Create project
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          org_id: orgId,
          name: name.trim(),
          description: description || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create project error:', error);
      return res.status(500).json({ error: error.message || 'Failed to create project' });
    }

    res.status(201).json({
      message: 'Project created successfully',
      project: data,
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

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: req.headers.authorization,
          },
        },
      }
    );

    // Verify organization belongs to user
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', orgId)
      .eq('user_id', req.user.id)
      .limit(1);

    if (orgError || !orgs || orgs.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get projects
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get projects error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch projects' });
    }

    res.json({ projects: data || [] });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;
