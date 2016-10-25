/**
 * Created by raseel.mohamed on 6/3/16
 */
var helper = require('./support/setup');

exports.config = {
    baseUrl: process.env.UI_HOSTNAME,  //when developing tests use http://localhost:9000',

    capabilities: {
        browserName: 'firefox',
        version: ''
    },
    restartBrowserBetweenTests: false,

    specs: [
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
            'features/step_definitions/*.js',
            'support/hooks.js' ],
        format: 'json:results/result.json'

    }
};
