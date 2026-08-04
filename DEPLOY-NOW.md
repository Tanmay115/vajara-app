# 🚀 Deploy Vajra App - Complete Guide for Windows

## Prerequisites Installation

### 1. Install Git (Required)

**Download and Install:**
1. Go to: https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run installer with default settings
4. Restart Command Prompt after installation

**Verify Installation:**
```bash
git --version
```

---

## 🎯 OPTION A: Deploy to Render (FREE - Easiest)

### Step 1: Setup Git Repository

Open Command Prompt in `vajra-app` folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Vajra Testing App"

# Set main branch
git branch -M main
```

### Step 2: Push to GitHub

1. **Create GitHub Account** (if you don't have one):
   - Go to https://github.com/signup
   - Complete registration

2. **Create New Repository**:
   - Go to https://github.com/new
   - Repository name: `vajra-app`
   - Description: "Vajra Testing Job Card Application"
   - **Keep it PUBLIC**
   - **DO NOT** initialize with README
   - Click "Create repository"

3. **Push Your Code**:
   GitHub will show commands like this (use YOUR username):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/vajra-app.git
   git push -u origin main
   ```
   
   **Note**: You may need to login. GitHub will prompt you.

### Step 3: Deploy on Render

1. **Sign Up on Render**:
   - Go to https://render.com
   - Click "Get Started for Free"
   - Choose "Sign up with GitHub"
   - Authorize Render to access your GitHub

2. **Create Web Service**:
   - On Render Dashboard, click "**New +**"
   - Select "**Web Service**"
   - You'll see your `vajra-app` repository listed
   - Click "**Connect**" next to it

3. **Configure Service**:
   Fill in these details:
   
   - **Name**: `vajra-app` (or choose your own)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **"Free"**

4. **Add Environment Variables**:
   Scroll down to "Environment Variables" section.
   Click "**Add Environment Variable**" for each:

   ```
   Key: EMAIL_USER
   Value: agrawaltanmay1011@gmail.com

   Key: EMAIL_PASS
   Value: !Tanmay1011

   Key: EMAIL_FROM
   Value: Vajra App <agrawaltanmay771@gmail.com>

   Key: SESSION_SECRET
   Value: vajra_secret_production_2024_render

   Key: PORT
   Value: 3000
   ```

5. **Deploy**:
   - Click "**Create Web Service**"
   - Wait 2-3 minutes while Render deploys
   - Watch the logs on screen

6. **Access Your App** 🎉:
   Once deployment completes, you'll see:
   ```
   Your service is live at https://vajra-app.onrender.com
   ```
   
   Click the link to open your app!

### Step 4: Test Your Deployed App

1. Open: `https://vajra-app.onrender.com` (or your URL)

2. **Login as Technician**:
   - Username: `tech1`
   - Password: `tech123`

3. **Login as Head Office**:
   - Username: `head1`
   - Password: `head123`

4. Test creating forms, submissions, approvals, and PDF downloads!

---

## 🎯 OPTION B: Deploy to Railway (Alternative FREE)

### Step 1: Push to GitHub (same as above)

Follow "OPTION A - Step 1 & 2" to push code to GitHub.

### Step 2: Deploy on Railway

1. **Sign Up on Railway**:
   - Go to https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**:
   - Click "**New Project**"
   - Select "**Deploy from GitHub repo**"
   - Choose `vajra-app` repository
   - Railway will auto-detect Node.js

3. **Add Environment Variables**:
   - Click on your service
   - Go to "**Variables**" tab
   - Click "**+ New Variable**"
   - Add all variables from .env.example:
     ```
     EMAIL_USER=agrawaltanmay1011@gmail.com
     EMAIL_PASS=!Tanmay1011
     EMAIL_FROM=Vajra App <agrawaltanmay771@gmail.com>
     SESSION_SECRET=vajra_secret_railway_2024
     PORT=3000
     ```

4. **Generate Public URL**:
   - Go to "**Settings**" tab
   - Under "Networking" → Click "**Generate Domain**"
   - Your app will be live at: `https://vajra-app.up.railway.app`

5. **Access Your App** 🎉:
   Click the generated URL to open your app!

---

## 🎯 OPTION C: Run Locally (Testing)

If you just want to test locally before deploying:

```bash
# Install dependencies
npm install

# Make sure you have .env file
# (Copy from .env.example if needed)

# Start server
npm start
```

Open browser: http://localhost:3000

---

## 📧 Gmail App Password Setup (IMPORTANT for Production)

Your current email password is exposed in these files. For security:

1. **Go to Google Account**:
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification**:
   - If not enabled, enable it first

3. **Create App Password**:
   - Search for "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "Vajra App"
   - Click "Generate"
   - **Copy the 16-character password**

4. **Update Environment Variable**:
   - On Render: Go to Environment → Edit EMAIL_PASS
   - Replace with the new app password
   - Click "Save Changes"
   - Service will auto-redeploy

---

## 🔄 How to Update Your Deployed App

After making changes to your code:

```bash
# Save changes
git add .
git commit -m "Description of changes"
git push origin main
```

Both Render and Railway will **automatically redeploy**! 🎉

---

## 🆘 Troubleshooting

### "git not recognized"
- Install Git from https://git-scm.com/download/win
- Restart Command Prompt

### "Permission denied" when pushing to GitHub
- GitHub may ask you to login
- Use Personal Access Token instead of password
- Go to GitHub Settings → Developer Settings → Personal Access Tokens

### App not loading on Render/Railway
- Check logs in dashboard
- Verify all environment variables are set
- Check if build completed successfully

### Email not sending
- Verify Gmail credentials are correct
- Check if 2-Step Verification is enabled
- Use App Password, not regular password

### Database not persisting
- Render/Railway free tier has persistent disk
- Data will persist across deployments
- Consider periodic backups

---

## 📊 Monitoring Your Deployed App

### On Render:
- **Logs**: Dashboard → Your Service → Logs tab
- **Metrics**: Dashboard → Metrics tab
- **Restart**: Manual Deploy → "Clear build cache & deploy"

### On Railway:
- **Logs**: Click service → Deployments → View logs
- **Metrics**: Metrics tab shows CPU/Memory usage
- **Restart**: Deployments → Redeploy

---

## ⚡ Quick Commands Reference

```bash
# Check git status
git status

# See changes
git diff

# Commit and push changes
git add .
git commit -m "Your message"
git push origin main

# View commit history
git log --oneline

# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies
npm install

# Start local server
npm start
```

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] App loads at public URL
- [ ] Can login as Technician (tech1/tech123)
- [ ] Can login as Head Office (head1/head123)
- [ ] Can create new form
- [ ] Can fill and submit form
- [ ] Email notification received
- [ ] Can approve/reject from Head Office
- [ ] Can download PDF
- [ ] PDF displays correctly without strikethrough
- [ ] Logo displays properly on login page
- [ ] My Forms button blends with header

---

## 🔐 Security Recommendations

Before sharing with users:

1. **Change Default Passwords**:
   - Edit `database.js`
   - Update default user passwords
   - Redeploy

2. **Use App Password for Email**:
   - Follow Gmail App Password setup above

3. **Change Session Secret**:
   - Use a random 32-character string
   - Update in environment variables

4. **Enable HTTPS** (automatic on Render/Railway):
   - Update cookie settings for production

---

## 📞 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. View deployment logs in dashboard
3. Test locally first with `npm start`
4. Verify all environment variables are set correctly

---

## 🌟 Recommended Path

**For beginners**: Use **Render** (Option A)
- Completely free
- Easy setup
- Automatic deployments
- Built-in HTTPS
- Good for small to medium traffic

**Start here** → Option A → Takes only 10-15 minutes! 🚀

---

**Your app will be live and accessible worldwide!** 🌍
