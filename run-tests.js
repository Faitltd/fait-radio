#!/usr/bin/env node

/**
 * FAIT Radio - Automated Test Runner
 *
 * This script can be used to run automated tests from the command line
 * using a headless browser or other testing frameworks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const testConfig = {
  testFiles: [
    'e2e-test.html',
    'minimal-test.html',
    'diagnostic.html',
    'test.html'
  ],
  outputDir: 'test-results',
  timestamp: new Date().toISOString().replace(/[:.]/g, '-')
};

// Ensure output directory exists
if (!fs.existsSync(testConfig.outputDir)) {
  fs.mkdirSync(testConfig.outputDir);
}

console.log('🧪 FAIT Radio Test Runner');
console.log('========================');
console.log(`Timestamp: ${testConfig.timestamp}`);
console.log(`Output Directory: ${testConfig.outputDir}`);
console.log('');

// Check if test files exist
console.log('📋 Checking test files...');
testConfig.testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
  }
});
console.log('');

// Check if main application files exist
console.log('📋 Checking application files...');
const appFiles = [
  'index.html',
  'js/app.js',
  'js/window-manager.js',
  'js/youtube-player.js',
  'js/background-manager.js',
  'js/radio-window.js',
  'js/admin-panel.js',
  'js/stations.js',
  'css/styles.css'
];

let missingFiles = [];
appFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('');
  console.log('❌ Critical files missing. Cannot proceed with testing.');
  console.log('Missing files:', missingFiles.join(', '));
  process.exit(1);
}

console.log('');
console.log('✅ All required files found!');
console.log('');

// Generate test report
console.log('📊 Generating test report...');

const testReport = {
  timestamp: testConfig.timestamp,
  testRunner: 'FAIT Radio Test Runner',
  version: '1.0.0',
  environment: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    cwd: process.cwd()
  },
  files: {
    testFiles: testConfig.testFiles.map(file => ({
      name: file,
      exists: fs.existsSync(file),
      size: fs.existsSync(file) ? fs.statSync(file).size : 0
    })),
    appFiles: appFiles.map(file => ({
      name: file,
      exists: fs.existsSync(file),
      size: fs.existsSync(file) ? fs.statSync(file).size : 0
    }))
  },
  recommendations: []
};

// Add recommendations based on file analysis
if (!fs.existsSync('package.json')) {
  testReport.recommendations.push('Consider adding package.json for dependency management');
}

if (!fs.existsSync('.gitignore')) {
  testReport.recommendations.push('Consider adding .gitignore file');
}

if (!fs.existsSync('README.md')) {
  testReport.recommendations.push('Consider adding README.md with setup instructions');
}

// Check for common issues
console.log('🔍 Analyzing potential issues...');

// Check for large files
appFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    if (stats.size > 100000) { // 100KB
      console.log(`⚠️  Large file detected: ${file} (${(stats.size / 1024).toFixed(2)}KB)`);
      testReport.recommendations.push(`Consider optimizing ${file} - it's quite large`);
    }
  }
});

// Check for TODO comments in JavaScript files
const jsFiles = appFiles.filter(file => file.endsWith('.js'));
jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const todoMatches = content.match(/TODO|FIXME|HACK/gi);
    if (todoMatches) {
      console.log(`📝 ${file} contains ${todoMatches.length} TODO/FIXME comments`);
    }
  }
});

// Save test report
const reportPath = path.join(testConfig.outputDir, `test-report-${testConfig.timestamp}.json`);
fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2));
console.log(`📄 Test report saved: ${reportPath}`);

console.log('');
console.log('🚀 Manual Testing Instructions:');
console.log('================================');
console.log('1. Open e2e-test.html in a web browser');
console.log('2. Click "Run All Tests" for comprehensive testing');
console.log('3. Click "Quick Test" for essential functionality checks');
console.log('4. Check the test overlay for real-time results');
console.log('5. Use "Export" button to save detailed test results');
console.log('');
console.log('📋 Test Files Available:');
testConfig.testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   • ${file} - Comprehensive testing interface`);
  }
});

console.log('');
console.log('🎯 Key Areas to Test:');
console.log('   • Window management (create, drag, resize, close)');
console.log('   • Audio playback (YouTube integration)');
console.log('   • Station management (admin panel)');
console.log('   • Background video system');
console.log('   • Data persistence (localStorage)');
console.log('   • All dock applications');
console.log('   • User interactions and error handling');

console.log('');
console.log('✅ Test runner completed successfully!');

// Exit with success
process.exit(0);
