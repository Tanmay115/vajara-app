# Vajra App - Deployment Guide

This guide covers multiple deployment options for the Vajra Testing Job Card application.

---

## 🚀 Option 1: Deploy to Render (FREE - RECOMMENDED)

**Render** offers free hosting for web applications with automatic HTTPS and continuous deployment.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Vajra App"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Sign up on Render**
   - Go to [https://render.com](https://render.com)
   - Sign up using your GitHub account

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the `vajra-app` repository

4. **Configure Service**
   - **Name**: `vajra-app` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**
   Click "Environment" and add:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=Vajra App <your-email@gmail.com>
   SESSION_SECRET=your-random-secret-key-here
   PORT=3000
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://vajra-app.onrender.com`

**Note**: Free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🚀 Option 2: Deploy to Railway (FREE)

**Railway** provides easy deployment with generous free tier.

### Steps:

1. **Push to GitHub** (if not done already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Vajra App"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Sign up on Railway**
   - Go to [https://railway.app](https://railway.app)
   - Sign up with GitHub

3. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `vajra-app` repository
   - Railway will auto-detect Node.js and deploy

4. **Add Environment Variables**
   - Go to Variables tab
   - Add all variables from `.env.example`

5. **Generate Domain**
   - Go to Settings → Generate Domain
   - Your app will be live at: `https://vajra-app.up.railway.app`

---

## 🚀 Option 3: Deploy to Heroku

**Heroku** is popular but requires credit card (free tier available).

### Steps:

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create vajra-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set EMAIL_FROM="Vajra App <your-email@gmail.com>"
   heroku config:set SESSION_SECRET=your-random-secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

---

## 🚀 Option 4: Deploy to VPS/Local Server

### Requirements:
- Ubuntu/Linux server with Node.js installed
- Domain name (optional)
- SSH access

### Steps:

1. **Connect to Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js** (if not installed)
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone <your-repo-url> vajra-app
   cd vajra-app
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Create .env File**
   ```bash
   nano .env
   # Add all environment variables
   # Press Ctrl+X, then Y to save
   ```

6. **Install PM2** (Process Manager)
   ```bash
   sudo npm install -g pm2
   ```

7. **Start Application**
   ```bash
   pm2 start server.js --name vajra-app
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx** (Optional - for domain)
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/vajra-app
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/vajra-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL** (Optional - HTTPS)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📧 Email Configuration

For **Gmail**, you need to create an App Password:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not enabled)
3. Security → App passwords
4. Create new app password for "Mail"
5. Use this password in `EMAIL_PASS` environment variable

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `SESSION_SECRET` to a strong random string
- [ ] Use App Password for email (not your Gmail password)
- [ ] Enable HTTPS (automatic on Render/Railway)
- [ ] Set secure cookie in production:
  ```javascript
  cookie: { secure: true, httpOnly: true }
  ```
- [ ] Review and update CORS settings if needed
- [ ] Backup database regularly

---

## 📊 Post-Deployment

After deployment, test:

1. ✅ Login as Technician: `tech1` / `tech123`
2. ✅ Login as Head Office: `head1` / `head123`
3. ✅ Create a new form
4. ✅ Submit form and check email notification
5. ✅ Approve/Reject forms from Head Office
6. ✅ Download PDF

---

## 🆘 Troubleshooting

### Application not starting
- Check logs: `pm2 logs vajra-app` (VPS) or view logs in Render/Railway dashboard
- Verify all environment variables are set
- Check Node.js version: `node --version` (should be 14+)

### Email not working
- Verify Gmail App Password is correct
- Check if 2-Step Verification is enabled
- Test with a different email service

### Database issues
- Ensure `vajra.db` file has write permissions
- Check if SQLite is properly initialized

---

## 🎉 Quick Start (Local Testing)

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your email credentials

# Start server
npm start

# Open browser
http://localhost:3000
```

---

## 📝 Default Credentials

**Technician:**
- Username: `tech1`
- Password: `tech123`

**Head Office:**
- Username: `head1`
- Password: `head123`

**⚠️ Change these in production!** Edit `database.js` to add/modify users.

---

## 🔗 Support

For issues or questions, contact the development team.

---

**Recommended**: Start with **Render** (Option 1) for easiest deployment with zero cost.
