# 🚀 Quick Deploy to Render (5 Minutes)

## Step-by-Step Guide

### 1. Push to GitHub

Open Command Prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Deploy Vajra App"
git branch -M main
```

Then create a new repository on GitHub:
- Go to https://github.com/new
- Name: `vajra-app`
- Click "Create repository"

Copy the commands shown and run them:
```bash
git remote add origin https://github.com/YOUR-USERNAME/vajra-app.git
git push -u origin main
```

### 2. Deploy on Render

1. **Sign up**: Go to https://render.com and sign up with GitHub

2. **New Web Service**:
   - Click "New +" → "Web Service"
   - Click "Connect account" to connect GitHub
   - Select `vajra-app` repository
   - Click "Connect"

3. **Configure**:
   - **Name**: `vajra-app` (this will be your URL)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   EMAIL_USER = agrawaltanmay1011@gmail.com
   EMAIL_PASS = !Tanmay1011
   EMAIL_FROM = Vajra App <agrawaltanmay771@gmail.com>
   SESSION_SECRET = vajra_secret_2024_render_prod
   PORT = 3000
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-3 minutes
   - Done! ✅

### 3. Access Your App

Your app will be live at:
```
https://vajra-app.onrender.com
```

**Login Credentials:**
- Technician: `tech1` / `tech123`
- Head Office: `head1` / `head123`

---

## ⚠️ Important Notes

1. **Free Tier Limitation**: App sleeps after 15 min of inactivity. First request takes 30-60 seconds to wake up.

2. **Email Setup**: 
   - The email credentials in your .env are exposed in this deployment
   - For production, create a new Gmail App Password:
     1. Go to Google Account → Security
     2. Enable 2-Step Verification
     3. Create App Password
     4. Update EMAIL_PASS in Render dashboard

3. **Database Persistence**:
   - SQLite database persists on Render's disk
   - Consider backing up regularly

4. **Custom Domain** (Optional):
   - Go to Settings → Custom Domain
   - Add your domain name
   - Update DNS records as instructed

---

## 🔄 Update Deployment

When you make changes:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Render will automatically redeploy! 🎉

---

## 📊 Monitor Your App

- **View Logs**: Render Dashboard → Your Service → Logs
- **Check Status**: Dashboard shows if service is running
- **Restart**: Manual Deploy → "Clear build cache & deploy"

---

That's it! Your Vajra app is now live and accessible worldwide! 🌍
