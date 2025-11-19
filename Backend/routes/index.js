const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const documentController = require('../controllers/documentController');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|csv|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, CSV, and TXT files are allowed.'));
    }
  }
});

// ==================== Document Routes ====================

// Upload document
router.post('/documents/upload', upload.single('file'), documentController.uploadDocument);

// Get all documents
router.get('/documents', documentController.getDocuments);

// Get document by ID
router.get('/documents/:id', documentController.getDocumentById);

// Delete document
router.delete('/documents/:id', documentController.deleteDocument);

// ==================== Chat Routes ====================

// Send message
router.post('/chat/message', chatController.sendMessage);

// Get chat history
router.get('/chat/history/:documentId', chatController.getChatHistory);

// Clear chat history
router.delete('/chat/history/:documentId', chatController.clearChatHistory);

// ==================== Health Check ====================

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'RAG Chatbot API'
  });
});

module.exports = router;