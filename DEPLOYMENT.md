# 🚀 FAIT Radio - Deployment Guide

This guide explains how to deploy FAIT Radio to GitHub Pages and configure it for your custom domain (itsfait.com).

## 📋 Prerequisites

- GitHub account (✅ You have this)
- Repository on GitHub
- Custom domain (itsfait.com) with DNS access

## 🛠️ Deployment Steps

### Step 1: Push to GitHub Repository

1. **Create a new repository** on GitHub named `fait-radio` (or any name you prefer)
2. **Initialize git** in your project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FAIT Radio application"
   ```
3. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/Faitltd/fait-radio.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically trigger on the next push

### Step 3: Configure Custom Domain

#### Set up `radio.itsfait.com`:

1. **DNS Configuration**:
   - Add a CNAME record: `radio` → `faitltd.github.io`

2. **GitHub Pages Settings**:
   - In repository Settings → Pages
   - Under **Custom domain**, enter: `radio.itsfait.com`
   - Check **Enforce HTTPS**

#### Option B: Path-based (Alternative)
Use `itsfait.com/radio`:

1. **DNS Configuration**:
   - Point your main domain to your existing hosting
   - Set up a reverse proxy or redirect rule for `/radio` path
   
2. **Update CNAME file**:
   ```bash
   # Edit build.js to create CNAME with your main domain
   # Or manually create CNAME file with: itsfait.com
   ```

### Step 4: Test Deployment

1. **Wait for deployment** (usually 2-5 minutes)
2. **Check GitHub Actions** tab for build status
3. **Visit your site**:
   - Subdomain: `https://radio.itsfait.com`
   - GitHub Pages URL: `https://faitltd.github.io/fait-radio`

## 🔧 Local Development & Testing

### Build Production Version Locally
```bash
# Install dependencies (if not already done)
npm install

# Create production build
npm run build

# Preview production build
npm run preview
```

### Test Before Deployment
```bash
# Run tests
npm test

# Start development server
npm run dev
```

## 🚀 Automatic Deployment

The GitHub Actions workflow automatically:

1. **Triggers** on every push to `main` branch
2. **Builds** the production version using `build.js`
3. **Optimizes** HTML with meta tags and SEO
4. **Deploys** to GitHub Pages
5. **Configures** custom domain (CNAME)

## 📁 Production Build

The build process:

- ✅ **Includes**: `index.html`, `css/`, `js/`, `img/`, essential files
- ❌ **Excludes**: Test files, demos, documentation, development files
- 🔧 **Optimizes**: Adds SEO meta tags, social media tags
- 🌐 **Configures**: Custom domain, GitHub Pages settings

## 🛠️ Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build production version
npm run build

# The dist/ folder contains your production-ready site
# Upload contents of dist/ to your web hosting
```

## 🔍 Troubleshooting

### Common Issues

1. **404 Error**: Check that GitHub Pages is enabled and source is set to "GitHub Actions"
2. **Custom Domain Not Working**: Verify DNS settings and CNAME file
3. **Build Failing**: Check GitHub Actions logs for errors
4. **YouTube Not Loading**: Ensure HTTPS is enabled (required for YouTube API)

### DNS Configuration Examples

**For Cloudflare**:
```
Type: CNAME
Name: radio
Content: faitltd.github.io
Proxy: Orange cloud (proxied)
```

**For other DNS providers**:
```
Type: CNAME
Host: radio
Points to: faitltd.github.io
TTL: 300 (or default)
```

## 📊 Performance & SEO

The production build includes:

- 🔍 **SEO Meta Tags**: Title, description, keywords
- 📱 **Social Media Tags**: Open Graph, Twitter Cards
- 🚀 **Performance**: Minified assets, optimized loading
- 🔒 **Security**: HTTPS enforcement, secure headers

## 🎉 Success!

Once deployed, your FAIT Radio will be available at:
- **Custom Domain**: `https://radio.itsfait.com` (or your chosen subdomain)
- **GitHub Pages**: `https://faitltd.github.io/fait-radio`

The site will automatically update whenever you push changes to the main branch!

---

**Need Help?** Check the GitHub Actions logs or create an issue in the repository.
