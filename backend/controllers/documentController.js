const Document = require('../models/Document');

const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const document = await Document.create({
      title,
      content,
      createdBy: req.userId,
      status: 'draft',
    });

    return res.status(201).json(document);
  } catch (error) {
    console.error('Create document error:', error);
    return res.status(500).json({ error: 'Failed to create document' });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    return res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    return res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    return res.status(500).json({ error: 'Failed to fetch document' });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    const document = await Document.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.status !== 'draft' && (title || content)) {
      return res.status(400).json({ error: 'Only draft documents can be edited' });
    }

    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;

    if (status !== undefined) {
      const allowed = ['draft', 'submitted', 'approved'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      document.status = status;
    }

    await document.save();
    return res.json(document);
  } catch (error) {
    console.error('Update document error:', error);
    return res.status(500).json({ error: 'Failed to update document' });
  }
};

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
};
