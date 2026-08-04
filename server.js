require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initializeDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'vajra_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/technician', (req, res) => res.sendFile(path.join(__dirname, 'public', 'technician.html')));
app.get('/head-office', (req, res) => res.sendFile(path.join(__dirname, 'public', 'head-office.html')));

// Start only after DB is ready
initializeDB().then(() => {
  const authRoutes = require('./routes/auth');
  const formRoutes = require('./routes/forms');
  const uploadRoutes = require('./routes/uploads');
  const pdfRoutes = require('./routes/pdf');
  const adminRoutes = require('./routes/admin');
  app.use('/api', authRoutes);
  app.use('/api/forms', formRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/pdf', pdfRoutes);
  app.use('/api/admin', adminRoutes);

  app.listen(PORT, () => {
    console.log(`Vajra App running at http://localhost:${PORT}`);
    console.log(`  Technician login: tech1 / tech123`);
    console.log(`  Head Office login: head1 / head123`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
