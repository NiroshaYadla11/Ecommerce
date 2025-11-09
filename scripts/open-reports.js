/**
 * Open Test Reports Script
 * 
 * Opens all generated test reports in the default browser
 */

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const playwrightReportPath = path.join(__dirname, '..', 'playwright-report', 'index.html');
const cucumberReportPath = path.join(__dirname, '..', 'test-results', 'cucumber-report.html');

console.log('📊 Opening Test Reports...\n');

// Check and open Playwright report
if (fs.existsSync(playwrightReportPath)) {
  console.log('✓ Opening Playwright HTML Report...');
  console.log('  → Starting Playwright report server at http://localhost:9323\n');
  
  // Start Playwright report server
  const playwrightServer = spawn('npx', ['playwright', 'show-report'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });
  
  // Wait a bit for server to start, then open browser
  setTimeout(() => {
    const command = process.platform === 'win32' 
      ? `start http://localhost:9323`
      : process.platform === 'darwin'
      ? `open http://localhost:9323`
      : `xdg-open http://localhost:9323`;
    
    exec(command, (error) => {
      if (error) {
        console.error(`✗ Failed to open browser: ${error.message}`);
        console.log(`  → Manually open: http://localhost:9323\n`);
      } else {
        console.log(`  → Opened in browser: http://localhost:9323\n`);
      }
    });
  }, 2000);
  
  // Handle process termination
  process.on('SIGINT', () => {
    playwrightServer.kill();
    process.exit();
  });
  
} else {
  console.log('⚠ Playwright HTML Report not found');
  console.log(`  → Path: ${playwrightReportPath}`);
  console.log(`  → Run API tests first: npm run test:api\n`);
}

// Check and open Cucumber report
if (fs.existsSync(cucumberReportPath)) {
  console.log('✓ Opening Cucumber HTML Report...');
  const command = process.platform === 'win32' 
    ? `start "" "${cucumberReportPath}"`
    : process.platform === 'darwin'
    ? `open "${cucumberReportPath}"`
    : `xdg-open "${cucumberReportPath}"`;
  
  exec(command, (error) => {
    if (error) {
      console.error(`✗ Failed to open Cucumber report: ${error.message}`);
    } else {
      console.log(`  → Opened: ${cucumberReportPath}\n`);
    }
  });
} else {
  console.log('⚠ Cucumber HTML Report not found');
  console.log(`  → Path: ${cucumberReportPath}`);
  console.log(`  → Run BDD tests first: npm run test:bdd\n`);
}

console.log('\n💡 Report Locations:');
console.log('   - Playwright: playwright-report/index.html (or http://localhost:9323)');
console.log('   - Cucumber: test-results/cucumber-report.html');
console.log('\n💡 To generate all reports, run: npm test\n');

