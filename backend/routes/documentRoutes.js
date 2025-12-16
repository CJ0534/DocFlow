const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
} = require('../controllers/documentController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);

module.exports = router;
