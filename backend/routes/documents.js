const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabaseAuth = require('../middleware/supabaseAuth');

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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// All routes require authentication
router.use(supabaseAuth);

// Upload document to project
router.post('/projects/:projectId/documents', upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
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

    // Verify project exists and belongs to user's organization
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select(`
        id,
        org_id,
        organizations!inner(id, user_id)
      `)
      .eq('id', projectId)
      .single();

    if (projectError || !projectData || projectData.organizations.user_id !== req.user.id) {
      // Clean up uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Project not found' });
    }

    // Upload file to Supabase Storage
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `${projectId}/${Date.now()}-${req.file.originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file to storage' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert([
        {
          project_id: projectId,
          user_id: req.user.id,
          name: req.file.originalname,
          size: req.file.size.toString(),
          type: req.file.mimetype,
          storage_path: fileName,
          file_format: path.extname(req.file.originalname).substring(1),
          status: 'uploaded',
        },
      ])
      .select()
      .single();

    if (docError) {
      console.error('Create document error:', docError);
      // Try to delete uploaded file from storage
      await supabase.storage.from('documents').remove([fileName]);
      return res.status(500).json({ error: docError.message || 'Failed to create document record' });
    }

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        ...document,
        url: urlData.publicUrl,
      },
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

    // Verify project belongs to user's organization
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select(`
        id,
        org_id,
        organizations!inner(id, user_id)
      `)
      .eq('id', projectId)
      .single();

    if (projectError || !projectData || projectData.organizations.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get documents
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get documents error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch documents' });
    }

    // Add URLs for each document
    const documentsWithUrls = (data || []).map(doc => {
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(doc.storage_path);
      return {
        ...doc,
        url: urlData.publicUrl,
      };
    });

    res.json({ documents: documentsWithUrls });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Extract document
router.post('/documents/:documentId/extract', async (req, res) => {
  try {
    const { documentId } = req.params;

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

    // Get document and verify ownership
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', req.user.id)
      .single();

    if (docError || !document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Update status to processing
    await supabase
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId);

    // Download file from storage for extraction
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.storage_path);

    if (downloadError) {
      await supabase
        .from('documents')
        .update({ status: 'failed' })
        .eq('id', documentId);
      return res.status(500).json({ error: 'Failed to download file for extraction' });
    }

    // Simple extraction - get file content
    let extractedData = {
      document_id: documentId,
      extraction_type: 'metadata_only',
      metadata: {
        document_id: documentId,
        filename: document.name,
        file_size: document.size,
        mime_type: document.type,
        file_format: document.file_format,
        uploaded_at: document.created_at,
        extracted_at: new Date().toISOString(),
      },
    };

    // If text file, extract content
    if (document.type?.startsWith('text/') || document.file_format === 'txt') {
      const textContent = await fileData.text();
      extractedData = {
        ...extractedData,
        extraction_type: 'text',
        content: {
          text: textContent,
          character_count: textContent.length,
          line_count: textContent.split('\n').length,
          word_count: textContent.split(/\s+/).filter(w => w.length > 0).length,
        },
      };
    }

    // Update document with extracted data and status
    const { data: updatedDoc, error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'extracted',
        // Store extracted data as JSON in a metadata field (you might want to create a separate table)
      })
      .eq('id', documentId)
      .select()
      .single();

    if (updateError) {
      console.error('Update document error:', updateError);
      return res.status(500).json({ error: 'Failed to update document status' });
    }

    res.json({
      message: 'Extraction completed',
      document: updatedDoc,
      extracted_data: extractedData,
    });
  } catch (error) {
    console.error('Extract document error:', error);
    // Update status to failed
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
    await supabase
      .from('documents')
      .update({ status: 'failed' })
      .eq('id', req.params.documentId);
    res.status(500).json({ error: 'Failed to extract document' });
  }
});

module.exports = router;
