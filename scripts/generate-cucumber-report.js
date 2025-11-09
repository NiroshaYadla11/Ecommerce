/**
 * Generate Cucumber HTML Report
 * 
 * Generates HTML report from Cucumber JSON report
 */

const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

const jsonFile = path.join(__dirname, '..', 'test-results', 'cucumber-report.json');
const outputFile = path.join(__dirname, '..', 'test-results', 'cucumber-report.html');

// Check if JSON report exists
if (!fs.existsSync(jsonFile)) {
  console.error('❌ Cucumber JSON report not found:', jsonFile);
  console.log('   → Run tests first: npm run test:bdd');
  process.exit(1);
}

const options = {
  theme: 'bootstrap',
  jsonFile: jsonFile,
  output: outputFile,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'DemoBlaze',
    'Browser': 'Chromium',
    'Platform': process.platform,
    'Parallel': 'Scenarios',
    'Executed': 'Local'
  }
};

try {
  reporter.generate(options);
  console.log('✅ Cucumber HTML report generated successfully!');
  console.log('   → Location:', outputFile);
  console.log('   → View it: npm run test:report:cucumber');
} catch (error) {
  console.error('❌ Failed to generate Cucumber HTML report:', error.message);
  process.exit(1);
}

