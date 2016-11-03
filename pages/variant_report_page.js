/**
 * Created by vivek.ramani
 */

var utilities = require('../support/utilities.js')
var variant_report_page = function () {
    this.World = require ('../features/step_definitions/world').World;

    this.title = 'MATCHBox | Dashboard';
    this.reject_button = element(by.css('[ng-click="rejectVariantReport(variantReport)"]'));
    var confirm_button = element(by.css('[ng-click="confirmVariantReport(variantReport)"]'));
    var ok_button = element(by.css('[ng-click="buttonClicked(button)"]'));


    this.confirm_variant_report = function (callback){
        dv.waitForAngular().then(function(){
            var confirm_button = dv.element(by.css('button[ng-click="confirmVariantReport(variantReport)"]'));
            dv.isElementPresent(confirm_button).then(function(elementPresent){
                if (elementPresent === true){

                    dv.executeScript('arguments[0].click()', confirm_button).then(function(){
                    //confirm_button.click().then(function(){
                        ok_button.click().then (function(){
                            element(by.xpath(".//*[@id='navbar']/ul[1]/li[1]/a")).click();
                        });
                    });
                }
            });
        }).then(callback);
    };
};

module.exports = new variant_report_page();