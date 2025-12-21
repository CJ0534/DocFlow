const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabaseAuth = require('../middleware/supabaseAuth');

const router = express.Router();

// All routes require authentication
router.use(supabaseAuth);

// Create organization
router.post('/', async (req, res) => {
  try {
    const { name, type, team_strength, logo } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Organization name is required' });
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

    const { data, error } = await supabase
      .from('organizations')
      .insert([
        {
          user_id: req.user.id,
          name: name.trim(),
          type: type || null,
          team_strength: team_strength || null,
          logo: logo || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create organization error:', error);
      return res.status(500).json({ error: error.message || 'Failed to create organization' });
    }

    res.status(201).json({
      message: 'Organization created successfully',
      organization: data,
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

// Get user's organizations
router.get('/', async (req, res) => {
  try {
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

    const { data, error } = await supabase
      .from('organizations')
      .select('*, projects(count)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get organizations error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch organizations' });
    }

    // Transform data to include project count flattened
    const organizations = data.map(org => ({
      ...org,
      projects: org.projects?.[0]?.count || 0,
    }));

    res.json({ organizations });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

module.exports = router;
