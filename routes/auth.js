const express = require('express');
const router = express.Router();
const { dbGet, hashPassword } = require('../database');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const hashed = hashPassword(password);
  const user = dbGet('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashed]);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.user = { id: user.id, username: user.username, role: user.role, name: user.name, email: user.email };
  res.json({ success: true, user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.session.user);
});

module.exports = router;
