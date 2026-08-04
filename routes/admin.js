const express = require('express');
const router = express.Router();
const { dbGet, dbAll, dbRun, hashPassword } = require('../database');

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}
function requireHO(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'head_office') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// GET /api/admin/stats — dashboard KPIs
router.get('/stats', requireAuth, requireHO, (req, res) => {
  const total     = dbGet(`SELECT COUNT(*) as c FROM forms WHERE status != 'draft'`);
  const pending   = dbGet(`SELECT COUNT(*) as c FROM forms WHERE status IN ('submitted','resubmitted')`);
  const approved  = dbGet(`SELECT COUNT(*) as c FROM forms WHERE status = 'approved'`);
  const rejected  = dbGet(`SELECT COUNT(*) as c FROM forms WHERE status = 'rejected'`);
  const thisMonth = dbGet(`SELECT COUNT(*) as c FROM forms WHERE status = 'approved' AND strftime('%Y-%m', reviewed_at) = strftime('%Y-%m', 'now')`);
  const drafts    = dbGet(`SELECT COUNT(*) as c FROM forms WHERE status = 'draft'`);
  res.json({
    total:     total?.c || 0,
    pending:   pending?.c || 0,
    approved:  approved?.c || 0,
    rejected:  rejected?.c || 0,
    thisMonth: thisMonth?.c || 0,
    drafts:    drafts?.c || 0,
  });
});

// GET /api/admin/audit/:formId — audit log for a form
router.get('/audit/:formId', requireAuth, (req, res) => {
  const logs = dbAll(`SELECT * FROM form_audit_log WHERE form_id = ? ORDER BY created_at ASC`, [req.params.formId]);
  res.json(logs);
});

// GET /api/admin/users — list all users
router.get('/users', requireAuth, requireHO, (req, res) => {
  const users = dbAll(`SELECT id, username, role, name, email FROM users ORDER BY role, name`);
  res.json(users);
});

// POST /api/admin/users — create a new technician
router.post('/users', requireAuth, requireHO, (req, res) => {
  const { username, password, name, email, role } = req.body;
  if (!username || !password || !name || !email) return res.status(400).json({ error: 'All fields required' });
  const validRole = ['technician', 'head_office'].includes(role) ? role : 'technician';
  const existing = dbGet(`SELECT id FROM users WHERE username = ?`, [username]);
  if (existing) return res.status(400).json({ error: 'Username already exists' });
  const result = dbRun(`INSERT INTO users (username, password, role, name, email) VALUES (?,?,?,?,?)`,
    [username, hashPassword(password), validRole, name, email]);
  res.json({ success: true, id: result.lastInsertRowid });
});

// DELETE /api/admin/users/:id — remove a user (not self)
router.delete('/users/:id', requireAuth, requireHO, (req, res) => {
  const uid = parseInt(req.params.id);
  if (uid === req.session.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  dbRun(`DELETE FROM users WHERE id = ?`, [uid]);
  res.json({ success: true });
});

// GET /api/admin/check-vajra-id?vajra_id=XXX&exclude_id=N — duplicate check
router.get('/check-vajra-id', requireAuth, (req, res) => {
  const { vajra_id, exclude_id } = req.query;
  if (!vajra_id) return res.json({ exists: false });
  let existing;
  if (exclude_id) {
    existing = dbGet(`SELECT id, status FROM forms WHERE vajra_id = ? AND id != ?`, [vajra_id, exclude_id]);
  } else {
    existing = dbGet(`SELECT id, status FROM forms WHERE vajra_id = ?`, [vajra_id]);
  }
  res.json({ exists: !!existing, form: existing || null });
});

module.exports = router;
