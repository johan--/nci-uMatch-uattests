/**
 * Created by raseel.mohamed on 6/3/16
 */

'use strict';
var fs = require('fs');

var loginPageObj = require ('../../pages/loginPage');
var dashboardPageObj = require ('../../pages/dashboardPage');
// Helper Methods
var utilities = require ('../../support/utilities.js');

module.exports = function () {
    var accessbtn = element(by.buttonText('ACCESS NCI-MATCHBox'));
    var userId = process.env.NCI_MATCH_USERID;
    var previousLogin = element(by.css('div[title="' + userId + ' (Auth0)"]'));

    this.World = require ('../step_definitions/world').World;

    this.Given(/^I am on the login page$/, function(callback){
        loginPageObj.goToLoginPage();
        utilities.checkTitle(browser, loginPageObj.title).then(function () {
            browser.waitForAngular();
        }).then(callback);
    });

    this.Given(/^I am a logged in user$/, function(callback) {
        loginPageObj.goToLoginPage();

        var email = process.env.NCI_MATCH_USERID;
        var password = process.env.NCI_MATCH_PASSWORD;

        loginPageObj.login(email, password);
        utilities.waitForElement(loginPageObj.navBarHeading, 'sticky top menu');

        browser.sleep(2000).then(callback);
    });

    this.Then(/^I should see the login button$/, function (callback) {
        accessbtn.isPresent().then(function (present) {
            expect(present).to.eql(true)
        }).then(callback);
    });

    this.When(/^I click on the login button$/, function(callback){
        accessbtn.click().then(function () {
            browser.waitForAngular();
        }, function (error) {
            console.log(error);
            console.log('#############################################');
            browser.getPageSource().then(function (text) {
                console.log(text);
            })
        }).then(callback);
    });

    this.Then(/^I should see the previous login session button$/, function (callback) {
        utilities.waitForElement(previousLogin, 'Previous login link').then(function () {
            expect(previousLogin.isPresent()).to.eventually.eql(true)
        }, function () {
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
            browser.getPageSource().then(function (text) {
                console.log(text);
            })

        }).then(callback);
    });

    this.When(/^I click on the previous session button$/, function (callback) {
        previousLogin.click().then(function(){
            browser.waitForAngular();
            }).then(callback);
    });

    this.When(/^I login with (valid|invalid) email and password/, function(validity, callback){
        var email;
        var password = process.env.NCI_MATCH_PASSWORD;

        if (validity == 'valid'){
            email = process.env.NCI_MATCH_USERID;
        } else {
            email = 'abc_xyz@nih.gov';
        }
        loginPageObj.login(email, password, false);
        browser.sleep(2000).then(callback);
    });

    this.When(/^I navigate to the (.+) page$/, function (pageName, callback) {
        dashboardPageObj.goToPageName(pageName).then(function () {
            browser.waitForAngular()
        }).then(callback);
    });

    this.Then(/^I should be able to the see Dashboard page$/, function (callback){
        var page = dashboardPageObj.dashboardController;
        browser.sleep(1000).then (function(){
            expect(page.isPresent()).to.eventually.eql(true);
            expect(page.element(by.css('h2')).getText()).to.eventually.eql('Dashboard');
        }).then(callback);
    });

    this.Then(/^I then logout$/, function (callback) {
        dashboardPageObj.logout();
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should be asked to enter the credentials again$/, function (callback) {
        var errorPanel = element(by.css('#a0-onestep.a0-errors'));

        utilities.waitForElement(errorPanel, 'Retry Login Window');
        utilities.checkPresence('.a0-top-header>.a0-error');
        browser.sleep(50).then(callback);
    });

    this.Then(/^I am redirected back to the login page$/, function (callback) {
        expect(browser.getCurrentUrl()).to.eventually.have.string('/#/auth/login');
        browser.sleep(50).then(callback);
    });
};
