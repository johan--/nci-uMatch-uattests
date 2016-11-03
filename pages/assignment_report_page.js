/**
 * Created by vivek.ramani
 */

var utilities = require('../support/utilities.js')
var assignment_report_page = function () {
    this.World = require ('../features/step_definitions/world').World;

    this.title = 'MATCHBox | Dashboard';
    var confirm_button = element(by.css('[ng-click="confirmAssignmentReport(assignmentReport)"]'));
    var ok_button = element(by.buttonText('OK'));


    this.confirm_assignment_report = function (){
        dv.waitForAngular().then(function(){
            var confirm_button = dv.element(by.css('button[ng-click="confirmAssignmentReport(assignmentReport)"]'));
            dv.element(by.linkText("Assignment Report - PENDING")).click().then (function(){
                dv.isElementPresent(confirm_button).then(function(elementPresent){
                    if (elementPresent === true){
                        dv.executeScript('arguments[0].click()', confirm_button).then(function(){
                            //confirm_button.click().then(function(){
                            ok_button.click().then (function(){
                                //element(by.xpath(".//*[@id='navbar']/ul[1]/li[1]/a")).click();
                                dv.get("/#/dashboard",6000);
                            });
                        });
                    }
                });
            });
        });
    };
};

module.exports = new assignment_report_page();