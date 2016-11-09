/**
 * Created by raseel.mohamed on 6/3/16
 */


exports.config = {
    baseUrl: process.env.UI_HOSTNAME,  //when developing tests use http://localhost:9000',

    //seleniumAddress: 'http://localhost:4444/wd/hub',
    //chromeOnly: true,
    //directConnect: true,
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {'args': ['--window-size=1690,1000']}
        //firefox_binary: '/Applications/Firefox ESR.app/Contents/MacOS/firefox-bin',
    },
    restartBrowserBetweenTests: false,

    specs: [
        // Login Page
        'features/Load Treatment Arms.feature',
        'features/end-to-end.feature'
    ],

    getPageTimeout: 10000,

    onPrepare: function () {
        //global.dv = browser;
        global.dv = protractor.browser;
        dv.manage().timeouts().setScriptTimeout(60000);
        //dv.manage().window().setSize(1600, 1000);
    },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: ['support/env.js',
            'features/step_definitions/*.js',
            'support/hooks.js' ],
        format: 'pretty',
        format: 'json:results/result.json'

    }

};
