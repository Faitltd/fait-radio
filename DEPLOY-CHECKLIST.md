# 🚀 FAIT Radio - Deployment Checklist

## ✅ Pre-Deployment Setup (COMPLETED)

- [x] **Production build script** (`build.js`) created
- [x] **GitHub Actions workflow** (`.github/workflows/deploy.yml`) configured
- [x] **Package.json** updated with deployment scripts
- [x] **CNAME file** configured for itsfait.com
- [x] **SEO meta tags** added to production build
- [x] **Build process tested** locally - ✅ Working!

## 🎯 Next Steps (TO DO)

### 1. Create GitHub Repository
```bash
# In your project directory:
git init
git add .
git commit -m "Initial commit: FAIT Radio application"
```

### 2. Push to GitHub
```bash
# Replace with your actual repository URL
git remote add origin https://github.com/Faitltd/fait-radio.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The deployment will start automatically

### 4. Configure Custom Domain

#### Option A: Subdomain (Recommended)
- **URL**: `radio.itsfait.com`
- **DNS**: Add CNAME record: `radio` → `faitltd.github.io`
- **GitHub**: Set custom domain to `radio.itsfait.com`

#### Option B: Main Domain Path
- **URL**: `itsfait.com/radio`
- **Requires**: Existing hosting setup with reverse proxy

## 🔧 Commands Available

```bash
# Build production version
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Development server
npm run dev
```

## 📁 What Gets Deployed

### ✅ Included in Production:
- `index.html` (optimized with SEO)
- `css/` (all stylesheets)
- `js/` (all application scripts)
- `img/` (all images and assets)
- `CNAME` (custom domain configuration)
- `.nojekyll` (GitHub Pages optimization)

### ❌ Excluded from Production:
- Test files (`*-test.html`, `*-debug.html`)
- Demo files (`*-demo.html`)
- Documentation (`*.md` files)
- Development files (`build.js`, `run-tests.js`)
- Node modules and cache files

## 🌐 Expected URLs

After deployment, your FAIT Radio will be available at:

- **GitHub Pages**: `https://faitltd.github.io/fait-radio`
- **Custom Domain**: `https://itsfait.com` (or subdomain you choose)

## 🔍 Verification Steps

1. **Check build status** in GitHub Actions tab
2. **Test the deployed site** loads correctly
3. **Verify YouTube player** works (requires HTTPS)
4. **Test all windows/features** function properly
5. **Check mobile responsiveness**

## ⚡ Automatic Updates

Once set up, the site will automatically redeploy when you:
- Push changes to the `main` branch
- The GitHub Action will build and deploy automatically
- Usually takes 2-5 minutes for changes to go live

## 🛠️ Troubleshooting

- **Build fails**: Check GitHub Actions logs
- **404 errors**: Verify GitHub Pages is enabled
- **Custom domain issues**: Check DNS settings
- **YouTube not working**: Ensure HTTPS is enabled

---

**Ready to deploy!** Follow the steps above to get your FAIT Radio live on itsfait.com! 🎵
