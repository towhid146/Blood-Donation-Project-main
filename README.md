# BDMS - Blood Donation Management System

![CI/CD](https://github.com/towhid146/Blood-Donation-Project-main/actions/workflows/ci-cd.yml/badge.svg)
![Code Quality](https://github.com/towhid146/Blood-Donation-Project-main/actions/workflows/code-quality.yml/badge.svg)

A modern blood donation management system built with Node.js, Express, and MongoDB.

## 🚀 Features

- User registration and authentication
- Blood donor management
- Blood request system
- Profile management with completion tracking
- Bangladesh location API (Division/District/Upazila)
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** Passport.js
- **Frontend:** HTML, Tailwind CSS, JavaScript
- **CI/CD:** GitHub Actions
- **Deployment:** Render

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/towhid146/Blood-Donation-Project-main.git
cd Blood-Donation-Project-main

# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Run development server
npm run dev
```

## 🧪 Running Tests

```bash
cd backend
npm test
```

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

1. **CI/CD Pipeline** (`ci-cd.yml`)

   - Runs on push to `main` branch
   - Tests the application
   - Security audit
   - Deploys to Render

2. **Code Quality** (`code-quality.yml`)
   - Checks for outdated packages
   - Verifies project structure

### Setting up Render Deploy Hook

1. Go to your Render dashboard
2. Select your service → Settings → Deploy Hook
3. Copy the deploy hook URL
4. Go to GitHub repo → Settings → Secrets → Actions
5. Add `RENDER_DEPLOY_HOOK_URL` secret with the URL

## 📁 Project Structure

```
Blood-Donation-Project-main/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml
│       └── code-quality.yml
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── server.js
│   └── package.json
├── src/main/resources/
│   ├── static/
│   │   ├── js/
│   │   └── images/
│   └── templates/
│       ├── homePage.html
│       ├── login.html
│       ├── signUp.html
│       ├── profile.html
│       └── ...
└── README.md
```

## 🌐 Live Demo

- **Production:** [https://blood-donation-project-main.onrender.com](https://blood-donation-project-main.onrender.com)

## 👥 Team

Made with ❤️ by CUET CSE Students

## 📄 License

MIT License
