# Vajra Testing Job Card Application

A full-stack digital form application for Vajra device testing and QA.

## Quick Start

```bash
cd vajra-app
npm install
node server.js
```

Open http://localhost:3000 in your browser.

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Technician | tech1 | tech123 |
| Head Office | head1 | head123 |

## Features

- **Technician**: Fill out the Vajra Testing Job Card (Page 1 + 68-item Final Assembly Checklist), save drafts, submit for approval
- **Head Office**: View all submitted forms in a list, open full read-only view, approve or reject with comments
- **Email notifications** on submission and review (configure Gmail or uses Ethereal test account)
- **Session-based authentication** - roles route to correct pages automatically
- **SQLite database** - stored in `vajra.db` file, no external DB server needed

## Email Configuration (Optional)

Copy `.env.example` to `.env` and fill in your Gmail credentials:

```
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password   # Use Gmail App Password, not your main password
```

Without `.env`, the app automatically uses Ethereal (test email) and logs the preview URL to console.

## Project Structure

```
vajra-app/
  server.js          - Express app entry point
  database.js        - SQLite DB init and helpers (sql.js)
  mailer.js          - Nodemailer email helper
  routes/
    auth.js          - Login / logout / session routes
    forms.js         - Form CRUD and review routes
  public/
    index.html       - Login page
    technician.html  - Technician form (Page 1 + 68-item checklist)
    head-office.html - Head office review list
    css/style.css    - All styles
    js/
      technician.js  - Technician form logic
      head-office.js - Head office review logic
  vajra.db           - SQLite database (auto-created on first run)
```
