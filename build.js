#!/usr/bin/env node

/**
 * FAIT Radio - Production Build Script
 * 
 * This script creates a production-ready build for deployment to GitHub Pages
 * or other static hosting platforms.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build configuration
const buildConfig = {
  sourceDir: __dirname,
  outputDir: path.join(__dirname, 'dist'),
  
  // Files and directories to include in production build
  include: [
    'index.html',
    'css/',
    'js/',
    'img/',
    'package.json'
  ],
  
  // Files and directories to exclude from production build
  exclude: [
    'node_modules/',
    'test-results/',
    'dist/',
    '.git/',
    '.gitignore',
    'build.js',
    'run-tests.js',
    
    // Test files
    'test.html',
    'minimal-test.html',
    'diagnostic.html',
    'e2e-test.html',
    'audio-debug.html',
    'youtube-test.html',
    'youtube-debug.html',
    'embedding-test.html',
    'embed-test-simple.html',
    'station-switching-test.html',
    'playlist-search-test.html',
    'music-debug.html',
    
    // Demo files
    'admin-test.html',
    'admin-test-demo.html',
    'debug-main.html',
    'debug-stations.html',
    'glass-interface.html',
    'radio-interface.html',
    'retro-game-demo.html',
    'mixtape-editor-demo.html',
    'create-placeholders.html',
    
    // Documentation
    'README.md',
    'FIXES-APPLIED.md',
    'TEST-SUMMARY.md',
    'project-plan.md'
  ]
};

/**
 * Copy files and directories recursively
 */
function copyRecursive(src, dest, excludePatterns = []) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Copy directory contents
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      // Check if file should be excluded
      const shouldExclude = excludePatterns.some(pattern => {
        if (pattern.endsWith('/')) {
          return file === pattern.slice(0, -1) || srcPath.includes(pattern);
        }
        return file === pattern || srcPath.includes(pattern);
      });
      
      if (!shouldExclude) {
        copyRecursive(srcPath, destPath, excludePatterns);
      }
    });
  } else {
    // Copy file
    fs.copyFileSync(src, dest);
  }
}

/**
 * Create optimized index.html for production
 */
function createProductionIndex() {
  const indexPath = path.join(buildConfig.sourceDir, 'index.html');
  const outputPath = path.join(buildConfig.outputDir, 'index.html');
  
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Add production meta tags and optimizations with cache busting
  const buildTime = Date.now();
  const productionMeta = `
  <!-- Production Build - FAIT Radio - Build: ${buildTime} -->
  <meta name="description" content="FAIT Radio - A synthwave-themed web radio station with YouTube integration">
  <meta name="keywords" content="radio, synthwave, youtube, music, web-app, retro, 80s, fait">
  <meta name="author" content="FAIT Team">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://radio.itsfait.com/">
  <meta property="og:title" content="FAIT Radio - Synthwave Web Radio">
  <meta property="og:description" content="Experience the retro-futuristic vibes with our synthwave radio station">
  <meta property="og:image" content="https://radio.itsfait.com/img/fait-logo.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://radio.itsfait.com/">
  <meta property="twitter:title" content="FAIT Radio - Synthwave Web Radio">
  <meta property="twitter:description" content="Experience the retro-futuristic vibes with our synthwave radio station">
  <meta property="twitter:image" content="https://radio.itsfait.com/img/fait-logo.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="img/fait-logo.png">
  <link rel="apple-touch-icon" href="img/fait-logo.png">`;
  
  // Insert production meta tags after viewport meta tag
  indexContent = indexContent.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' + productionMeta
  );

  // Add cache busting to CSS and JS files
  indexContent = indexContent.replace(
    /href="css\/(.*?)\.css"/g,
    `href="css/$1.css?v=${buildTime}"`
  );
  indexContent = indexContent.replace(
    /src="js\/(.*?)\.js"/g,
    `src="js/$1.js?v=${buildTime}"`
  );
  
  fs.writeFileSync(outputPath, indexContent);
}

/**
 * Create CNAME file for custom domain
 */
function createCNAME() {
  const cnamePath = path.join(buildConfig.outputDir, 'CNAME');
  fs.writeFileSync(cnamePath, 'radio.itsfait.com');
}

/**
 * Create .nojekyll file to prevent Jekyll processing
 */
function createNoJekyll() {
  const nojekyllPath = path.join(buildConfig.outputDir, '.nojekyll');
  fs.writeFileSync(nojekyllPath, '');
}

/**
 * Main build function
 */
function build() {
  console.log('🚀 Starting FAIT Radio production build...');
  
  // Clean output directory
  if (fs.existsSync(buildConfig.outputDir)) {
    fs.rmSync(buildConfig.outputDir, { recursive: true, force: true });
    console.log('🧹 Cleaned output directory');
  }
  
  // Create output directory
  fs.mkdirSync(buildConfig.outputDir, { recursive: true });
  console.log('📁 Created output directory');
  
  // Copy included files
  buildConfig.include.forEach(item => {
    const srcPath = path.join(buildConfig.sourceDir, item);
    const destPath = path.join(buildConfig.outputDir, item);
    
    if (fs.existsSync(srcPath)) {
      if (item === 'index.html') {
        // Handle index.html separately for optimization
        return;
      }
      
      copyRecursive(srcPath, destPath, buildConfig.exclude);
      console.log(`✅ Copied ${item}`);
    }
  });
  
  // Create optimized index.html
  createProductionIndex();
  console.log('✅ Created optimized index.html');
  
  // Create GitHub Pages files
  createCNAME();
  console.log('✅ Created CNAME file for radio.itsfait.com');
  
  createNoJekyll();
  console.log('✅ Created .nojekyll file');
  
  console.log('🎉 Production build completed successfully!');
  console.log(`📦 Build output: ${buildConfig.outputDir}`);
  console.log('🌐 Ready for deployment to GitHub Pages');
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  build();
}

export default build;
