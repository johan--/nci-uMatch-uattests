var reporter = require('cucumber-html-reporter');

var options = {
    theme: 'bootstrap',
    jsonDir: '/home/travis/build/CBIIT/nci-uMatch-uattests/results/',
    output: '/home/travis/build/CBIIT/nci-uMatch-uattests/results/cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: false,
    ignoreBadJsonFile:true,
    name:'PEDMatch End-to-End Cucumber Test Reports'
};

reporter.generate(options);