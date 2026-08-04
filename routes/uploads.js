const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbGet, dbAll, dbRun } = require('../database');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Valid test keys that can have attachments
const VALID_TEST_KEYS = ['burn', 'network', 'noneth'];

// Multer storage — files saved as uploads/<formId>_<testKey>_<timestamp>.<ext>
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const formId = req.params.formId || 'new';
    const testKey = req.params.testKey || 'file';
    const ext = path.extname(file.originalname);
    const safeName = `form${formId}_${testKey}_${Date.now()}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (req, file, cb) => {
    // Allow common document/image/data formats
    const allowed = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv',
      '.txt', '.png', '.jpg', '.jpeg', '.gif', '.zip', '.log'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed.`));
    }
  }
});

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// POST /api/uploads/:formId/:testKey — upload a file for a specific test
router.post('/:formId/:testKey', requireAuth, (req, res) => {
  const { formId, testKey } = req.params;

  if (!VALID_TEST_KEYS.includes(testKey)) {
    return res.status(400).json({ error: 'Invalid test key. Must be: burn, network, or noneth' });
  }

  // Check form exists and user owns it
  const form = dbGet('SELECT * FROM forms WHERE id = ?', [formId]);
  if (!form) return res.status(404).json({ error: 'Form not found' });
  if (form.technician_id !== req.session.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const uploadSingle = upload.single('file');
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = dbRun(
      `INSERT INTO form_attachments (form_id, test_key, original_name, file_path, mime_type, size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [formId, testKey, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size]
    );

    res.json({
      success: true,
      attachment: {
        id: result.lastInsertRowid,
        form_id: parseInt(formId),
        test_key: testKey,
        original_name: req.file.originalname,
        file_path: req.file.filename,
        mime_type: req.file.mimetype,
        size: req.file.size
      }
    });
  });
});

// DELETE /api/uploads/:attachmentId — remove a file
router.delete('/:attachmentId', requireAuth, (req, res) => {
  const attachment = dbGet('SELECT * FROM form_attachments WHERE id = ?', [req.params.attachmentId]);
  if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

  // Only the technician who owns the form can delete
  const form = dbGet('SELECT * FROM forms WHERE id = ?', [attachment.form_id]);
  if (!form || form.technician_id !== req.session.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Delete physical file
  const filePath = path.join(UPLOADS_DIR, attachment.file_path);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch(e) { /* ignore if already gone */ }
  }

  dbRun('DELETE FROM form_attachments WHERE id = ?', [req.params.attachmentId]);
  res.json({ success: true });
});

// GET /api/uploads/form/:formId — list all attachments for a form
router.get('/form/:formId', requireAuth, (req, res) => {
  const form = dbGet('SELECT * FROM forms WHERE id = ?', [req.params.formId]);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  // Technicians can only see their own forms
  if (req.session.user.role === 'technician' && form.technician_id !== req.session.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const attachments = dbAll(
    'SELECT * FROM form_attachments WHERE form_id = ? ORDER BY test_key, uploaded_at',
    [req.params.formId]
  );
  res.json(attachments);
});

// GET /api/uploads/download/:attachmentId — download a file
router.get('/download/:attachmentId', requireAuth, (req, res) => {
  const attachment = dbGet('SELECT * FROM form_attachments WHERE id = ?', [req.params.attachmentId]);
  if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

  // Technicians can only access their own form files
  if (req.session.user.role === 'technician') {
    const form = dbGet('SELECT * FROM forms WHERE id = ?', [attachment.form_id]);
    if (!form || form.technician_id !== req.session.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  const filePath = path.join(UPLOADS_DIR, attachment.file_path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found on server' });
  }

  res.download(filePath, attachment.original_name);
});

module.exports = router;
