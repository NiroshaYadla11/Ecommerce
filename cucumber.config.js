// Cucumber configuration for BDD tests
module.exports = {
  default: {
    require: ['step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'json:test-results/cucumber-report.json',
      'html:test-results/cucumber-report.html',
      'progress-bar',
      'summary',
      'usage:test-results/cucumber-usage.txt'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      colorsEnabled: true
    },
    timeout: 60000, // Default timeout: 60 seconds for all steps
    publishQuiet: true,
  },
};

