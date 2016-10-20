/**
 * Created by raseel.mohamed on 6/3/16
 */
var helper = require('./support/setup');

exports.config = {
    baseUrl: 'https://pedmatch-int.nci.nih.gov',  //when developing tests use http://localhost:9000',

    //seleniumAddress: 'http://localhost:4444/wd/hub',
    chromeOnly: true,
    directConnect: true,
    capabilities: {
        browserName: 'chrome',
        version: ''
    },
    chromeOnly: true,

    specs: [
        // Login Page
        'features/Load Treatment Arms.feature',
        'features/end-to-end.feature'
   ],

    getPageTimeout: 10000,

    onPrepare: function () {
      browser.manage().timeouts().setScriptTimeout(60000);
    },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: ['support/env.js',
                  'features/step_definitions/*.js'],
        format: 'pretty',
        format: 'json:results/result.json'

    }

};
