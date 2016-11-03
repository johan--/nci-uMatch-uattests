/**
 * Created by vivek.ramani
 */


var utils = require('../support/utilities');

var login_page = function() {

    this.title = 'MATCHBox | Login';
    var email =  element(by.id('a0-signin_easy_email'));
    var pass = element(by.id('a0-signin_easy_password'));
    var loginbtn = element(by.buttonText('Access'));
    var prevMailId = element(by.xpath('//*[@id="a0-onestep"]/div[2]/div/form/div[1]/div[1]/div/span'));
    //var accessBtn = element(by.css('div[ng-controller="AuthController"]')).element(by.css('button[ng-click="login()"]'));
    var accessBtn = element(by.css('button[ng-click="login()"]'));
    var loginPopupPanel = element(by.css('.a0-onestep'));


    this.goto_login_page = function(){
        dv.get('/#/auth/login', 6000).then(function () {
        });
    };

    this.login = function(username, password) {
        accessBtn.click().then(function () {
            dv.sleep(15000);
            utils.waitForElement(loginPopupPanel, 'Login Popup panel').then(function () {
                dv.isElementPresent(prevMailId).then(function(prevLoginFlag){
                    if (prevLoginFlag == true){
                        prevMailId.click();
                    }else {
                        utils.waitForElement(email).then(function () {
                            email.sendKeys(username);
                            pass.sendKeys(password);
                            loginbtn.click();
                        });
                    }
                });

            });
        });
    };

};

module.exports = new login_page();