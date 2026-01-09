# BloodLink Deployment Guide

## 🚀 Deploy to Render (Recommended for Full-Stack)

Since this is a full-stack application where Express serves both API and HTML pages, **Render** is the best choice for deployment.

### Step 1: Prepare Your Repository

1. Push your code to GitHub:

```bash
cd D:\projects\Blood-Donation-Project-main
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting            | Value            |
| ------------------ | ---------------- |
| **Name**           | `bloodlink`      |
| **Region**         | Oregon (US West) |
| **Branch**         | `main`           |
| **Root Directory** | `backend`        |
| **Runtime**        | Node             |
| **Build Command**  | `npm install`    |
| **Start Command**  | `npm start`      |
| **Plan**           | Free             |

### Step 3: Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

| Key              | Value                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`       | `production`                                                                                                      |
| `MONGODB_URI`    | `mongodb+srv://user1:r6hvi4CfkzC2jCo1@cluster0.f1hiu0q.mongodb.net/blood_donation_db?retryWrites=true&w=majority` |
| `SESSION_SECRET` | (click "Generate" for a random value)                                                                             |

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment (takes 2-5 minutes).

Your app will be available at: `https://bloodlink.onrender.com`

---

## 🌐 Alternative: Deploy Frontend to Vercel (Optional)

If you want to split frontend and backend:

### Option A: Keep Everything on Render (Recommended)

The current setup serves everything from Express, so Render alone is sufficient.

### Option B: Separate Frontend on Vercel

For this, you'd need to:

1. Extract static files into a separate frontend folder
2. Update API calls to use the Render backend URL
3. Deploy frontend to Vercel

This is more complex and not recommended for this project structure.

---

## 📋 Post-Deployment Checklist

- [ ] Test homepage loads: `https://your-app.onrender.com`
- [ ] Test login/signup functionality
- [ ] Test profile page
- [ ] Verify MongoDB connection (check Render logs)
- [ ] Test API endpoints: `https://your-app.onrender.com/api/health`

---

## 🔧 Troubleshooting

### App shows "502 Bad Gateway"

- Check Render logs for errors
- Verify MONGODB_URI is correct
- Ensure SESSION_SECRET is set

### MongoDB Connection Issues

- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify connection string format

### Static Files Not Loading

- Check that build command ran successfully
- Verify file paths in server.js

### Session/Login Issues

- Ensure `NODE_ENV=production` is set
- Verify `trust proxy` is enabled in server.js

---

## 🔄 Auto-Deploy

Render automatically redeploys when you push to the `main` branch.

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render will auto-deploy!
```

---

## 📊 Monitoring

- **Render Dashboard**: View logs, metrics, and deployment status
- **MongoDB Atlas**: Monitor database performance and connections

---

## 💡 Tips

1. **Free Tier Limitation**: Render free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds.

2. **Custom Domain**: You can add a custom domain in Render settings.

3. **Environment Variables**: Never commit `.env` to Git. Always use Render's environment variables.
