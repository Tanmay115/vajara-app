const express = require('express');
const router = express.Router();
const { dbGet, dbAll, dbRun } = require('../database');
const { sendSubmissionEmail, sendReviewEmail } = require('../mailer');

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.session.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

function auditLog(form_id, user, action, detail = '') {
  try {
    dbRun(`INSERT INTO form_audit_log (form_id, user_id, user_name, action, detail) VALUES (?,?,?,?,?)`,
      [form_id, user.id, user.name, action, detail]);
  } catch(e) { /* non-critical */ }
}

// POST /api/forms - create or update
router.post('/', requireAuth, (req, res) => {
  const { id, vajra_id, vajra_base_id, vajra_type, status, form_data } = req.body;
  const techId = req.session.user.id;
  const now = new Date().toISOString();

  try {
    if (id) {
      const existing = dbGet('SELECT * FROM forms WHERE id = ?', [id]);
      if (!existing) return res.status(404).json({ error: 'Form not found' });
      if (existing.technician_id !== techId) return res.status(403).json({ error: 'Forbidden' });

      // Only allow editing approved forms (resubmit flow) or draft forms
      if (existing.status === 'rejected') {
        return res.status(403).json({ error: 'Rejected forms cannot be edited. Please contact Head Office.' });
      }

      // When resubmitting an approved form, mark it as resubmitted and clear prior review
      const isResubmit = existing.status === 'approved' && status === 'resubmitted';
      const finalStatus = isResubmit ? 'resubmitted' : (status || 'draft');

      dbRun(
        `UPDATE forms SET vajra_id=?, vajra_base_id=?, vajra_type=?, status=?, form_data=?, updated_at=?,
         head_office_comments=CASE WHEN ? THEN '' ELSE head_office_comments END,
         reviewed_at=CASE WHEN ? THEN NULL ELSE reviewed_at END,
         reviewed_by=CASE WHEN ? THEN NULL ELSE reviewed_by END
         WHERE id=?`,
        [vajra_id || '', vajra_base_id || '', vajra_type || 'standard', finalStatus, JSON.stringify(form_data), now,
         isResubmit, isResubmit, isResubmit, id]
      );

      if (status === 'submitted' || isResubmit) {
        const headOfficeUsers = dbAll("SELECT * FROM users WHERE role='head_office'");
        const tech = dbGet('SELECT * FROM users WHERE id=?', [techId]);
        headOfficeUsers.forEach(ho => {
          sendSubmissionEmail(ho.email, { vajra_id, technician_name: tech ? tech.name : 'Technician', form_id: id, isResubmit });
        });
        auditLog(id, req.session.user, isResubmit ? 'resubmitted' : 'submitted', `Vajra ID: ${vajra_id}`);
      } else {
        auditLog(id, req.session.user, 'updated', `Status: ${finalStatus}`);
      }
      return res.json({ success: true, id });
    } else {
      const result = dbRun(
        'INSERT INTO forms (vajra_id, vajra_base_id, vajra_type, technician_id, status, form_data, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)',
        [vajra_id || '', vajra_base_id || '', vajra_type || 'standard', techId, status || 'draft', JSON.stringify(form_data), now, now]
      );
      const newId = result.lastInsertRowid;

      if (status === 'submitted') {
        const headOfficeUsers = dbAll("SELECT * FROM users WHERE role='head_office'");
        const tech = dbGet('SELECT * FROM users WHERE id=?', [techId]);
        headOfficeUsers.forEach(ho => {
          sendSubmissionEmail(ho.email, { vajra_id, technician_name: tech ? tech.name : 'Technician', form_id: newId });
        });
        auditLog(newId, req.session.user, 'submitted', `Vajra ID: ${vajra_id}`);
      } else {
        auditLog(newId, req.session.user, 'created', `Status: draft`);
      }
      return res.json({ success: true, id: newId });
    }
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/forms - list forms
router.get('/', requireAuth, (req, res) => {
  const user = req.session.user;
  let forms;
  if (user.role === 'head_office') {
    forms = dbAll(`
      SELECT f.id, f.vajra_id, f.vajra_base_id, f.status, f.created_at, f.updated_at,
             f.head_office_comments, f.reviewed_at, f.technician_id,
             u.name as technician_name
      FROM forms f
      LEFT JOIN users u ON f.technician_id = u.id
      WHERE f.status IN ('submitted','approved','rejected','resubmitted')
      ORDER BY f.updated_at DESC
    `);
  } else {
    forms = dbAll(`
      SELECT f.id, f.vajra_id, f.vajra_base_id, f.status, f.created_at, f.updated_at,
             f.head_office_comments, f.reviewed_at, f.technician_id,
             u.name as technician_name
      FROM forms f
      LEFT JOIN users u ON f.technician_id = u.id
      WHERE f.technician_id = ?
      ORDER BY f.updated_at DESC
    `, [user.id]);
  }
  res.json(forms);
});

// GET /api/forms/:id - single form
router.get('/:id', requireAuth, (req, res) => {
  const form = dbGet(`
    SELECT f.*, u.name as technician_name, u.email as technician_email
    FROM forms f
    LEFT JOIN users u ON f.technician_id = u.id
    WHERE f.id = ?
  `, [req.params.id]);

  if (!form) return res.status(404).json({ error: 'Form not found' });

  const user = req.session.user;
  if (user.role === 'technician' && form.technician_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (form.form_data && typeof form.form_data === 'string') {
    try { form.form_data = JSON.parse(form.form_data); } catch(e) {}
  }
  res.json(form);
});

// PUT /api/forms/:id/review - head office review
router.put('/:id/review', requireAuth, requireRole('head_office'), (req, res) => {
  const { action, comments } = req.body;
  if (!['approved','rejected'].includes(action)) {
    return res.status(400).json({ error: 'Action must be approved or rejected' });
  }
  const form = dbGet('SELECT * FROM forms WHERE id = ?', [req.params.id]);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const now = new Date().toISOString();
  dbRun(
    'UPDATE forms SET status=?, head_office_comments=?, reviewed_at=?, reviewed_by=?, updated_at=? WHERE id=?',
    [action, comments || '', now, req.session.user.id, now, req.params.id]
  );
  auditLog(form.id, req.session.user, action, comments ? `Comments: ${comments}` : '');

  const tech = dbGet('SELECT * FROM users WHERE id=?', [form.technician_id]);
  if (tech) {
    sendReviewEmail(tech.email, {
      vajra_id: form.vajra_id,
      action,
      comments: comments || '',
      reviewer_name: req.session.user.name,
      form_id: form.id
    });
  }
  res.json({ success: true });
});

module.exports = router;
