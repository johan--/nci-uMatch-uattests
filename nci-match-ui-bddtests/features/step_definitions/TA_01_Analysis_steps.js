/**
 * Created by raseel.mohamed on 6/9/16
 */

'use strict';
var fs = require('fs');

var taPage = require('../../pages/treatmentArmsPage');
// Helper Methods
var utilities = require ('../../support/utilities');

module.exports = function () {

    this.World = require ('../step_definitions/world').World;

    var taTable = taPage.taTable;
    var taTableHeaderArray = taPage.taTableHeaderArray;
    var taTableData = taPage.taTableData;
    var expectedTableHeaders = taPage.expectedTableHeaders;

    var currentTreatmentId;
    var currentStratumId;
    var treatmentArmAPIDetails;
    var firstTreatmentArm;

    // GIVEN Section

    // WHEN Section

    this.When(/^I click on one of the treatment arms$/, function (callback) {
        //Here the user is clicking on the first treatment arm present.
        expect(taTableData.count()).to.eventually.be.greaterThan(0);

        taPage.returnTreatmentArmId(taTableData, 0).then(function (taId) {
            currentTreatmentId = taPage.stripTreatmentArmId(taId);
            currentStratumId   = taPage.stripStratumId(taId);
            element(by.linkText(taId)).click();
        }).then(function () {
            browser.waitForAngular();
        }).then(callback);
    });

    this.Then(/^I collect backend information about the treatment arm$/, function (callback) {
        var response;
        var inputDetails = '/api/v1/treatment_arms/' + currentTreatmentId + '/' + currentStratumId;
        response = utilities.callApi('treatment', inputDetails);
        response.get().then(function () {
            treatmentArmAPIDetails = utilities.getJSONifiedDetails(response.entity());
            firstTreatmentArm = treatmentArmAPIDetails[0];
        }).then(callback);
    });

    this.When(/^I go to treatment arm with "(.+)" as the id and "(.+)" as stratum id$/, function (taId, stratum, callback) {
        taPage.currentTreatmentId = taId;
        taPage.currentStratumId = stratum;
        currentTreatmentId = taId;
        currentStratumId   = stratum;

        var location = '/#/treatment-arm?id=' + currentTreatmentId + '&stratum=' + currentStratumId;
        console.log(location)

        browser.get(location, 6000).then(function () {
            browser.waitForAngular();
        }).then(callback);
    });

    this.When(/^I click on (.+) in the treatment arm table$/, function (taId, callback) {
        currentTreatmentId = taPage.stripTreatmentArmId(taId);
        element(by.linkText(taId)).click().then(callback);
    });

    this.When(/^I click on the download in PDF Format$/, function (callback) {
        expect(browser.isElementPresent(taPage.downloadPDFButton)).to.eventually.be.true;
        // todo: Insert Logic to download the file. Not working on the site when run locally
        // element(taPage.downloadPDFButton).click()
        browser.sleep(50).then(callback);
    });



    this.When(/^I click on the download in Excel Format$/, function (callback) {
        expect(browser.isElementPresent(taPage.downloadExcelButton)).to.eventually.be.true;
        // todo: Insert Logic to download the file. Not working on the site when run locally
        // element(taPage.downloadExcelButton).click()
        browser.sleep(50).then(callback);
    });


    this.When(/^I select the "(.+)" Main Tab$/, function (tabName, callback) {
        var selectorString = 'li[heading="' + tabName + '"]';
        element(by.css(selectorString)).click().then(function () {
            browser.waitForAngular();
        }).then(callback);
    });

    //THEN Section
    this.Then(/^I should see the (.+) Title$/, function (title, callback) {
        var heading = element(by.tagName('h2'));
        utilities.waitForElement(heading).then(function () {
            expect(element(by.css('h2')).getText()).to.eventually.eql(title)
        }).then(callback);
    });


    this.Then(/^I should see the (.+) breadcrumb$/, function (breadcrumb, callback) {
        utilities.checkBreadcrumb("Dashboard / "+ breadcrumb);
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see detailed (.+) breadcrumb$/, function (breadcrumb, callback) {
        utilities.checkBreadcrumb("Dashboard / "+ breadcrumb + ' / ' + 'Treatment Arm ' + currentTreatmentId);
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see treatment\-arms table$/, function (callback) {
        expect(browser.isElementPresent(taTable)).to.eventually.be.true;
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see the headings in the table$/, function (callback) {
        utilities.checkTableHeaders(taTableHeaderArray, expectedTableHeaders);
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see data in the table$/, function (callback) {
        browser.waitForAngular().then(function () {
            expect(taTableData.count()).to.eventually.be.greaterThan(0);
        }).then(callback);
    });

    this.When(/^I enter id "(.+?)" and stratum "(.+?)" in the treatment arm filter textbox$/, function (taId, stratumId, callback) {
        var searchField = element(by.model('filterAll'));
        currentTreatmentId = taId;
        currentStratumId = stratumId;

        searchField.sendKeys(taId + ' (' + stratumId + ')');
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see the data maps to the relevant column$/, function (callback) {
        var moment = require('moment');
        var dateExpected = moment.utc(firstTreatmentArm.date_opened).utc().format('LLL');
        expect(element(by.binding('item.id')).getText()).to.eventually.eql(firstTreatmentArm.id);
        expect(element(by.binding('item.stratum_id')).getText()).to.eventually.eql(firstTreatmentArm.stratum_id);
        expect(element(by.binding('item.stratum_statistics.current_patients')).getText()).to.eventually.eql(firstTreatmentArm.stratum_statistics.current_patients.toString());
        expect(element(by.binding('item.stratum_statistics.former_patients')).getText()).to.eventually.eql(firstTreatmentArm.stratum_statistics.former_patients.toString());
        expect(element(by.binding('item.stratum_statistics.not_enrolled_patients')).getText()).to.eventually.eql(firstTreatmentArm.stratum_statistics.not_enrolled_patients.toString());
        expect(element(by.binding('item.stratum_statistics.pending_patients')).getText()).to.eventually.eql(firstTreatmentArm.stratum_statistics.pending_patients.toString());
        expect(element(by.binding('item.treatment_arm_status')).getText()).to.eventually.eql(firstTreatmentArm.treatment_arm_status);
        expect(element(by.binding('item.date_opened')).getText()).to.eventually.include(dateExpected).then(function () {
            browser.sleep(20);
        }).then(callback);
    });

    this.Then(/^I should see the treatment\-arms detail dashboard$/, function (callback) {
        browser.getCurrentUrl().then(function (test) {
            console.log(test);
        });
        expect(browser.getCurrentUrl()).to.eventually.include('treatment-arm?id=' + currentTreatmentId + '&stratum=' + currentStratumId)
            .then(function () {
                browser.waitForAngular();
        }).then(callback);
    });

    this.Then(/^I should see the Name Details$/, function (callback) {
        //todo: Make sure to check for the name as a combination of TA and stratum
        utilities.checkElementArray(taPage.leftInfoBoxLabels, taPage.expectedLeftBoxLabels);

        expect(taPage.taName.getText()).to.eventually.equal(firstTreatmentArm.name);
        expect(taPage.taDescription.getText()).to.eventually.equal(firstTreatmentArm.description);
        expect(taPage.taStatus.getText()).to.eventually.equal(firstTreatmentArm.treatment_arm_status);
        expect(taPage.taVersion.getText()).to.eventually.equal(firstTreatmentArm.version);

        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see the Gene Details$/, function (callback) {
        utilities.checkElementArray(taPage.rightInfoBoxLabels, taPage.expectedRightBoxLabels);
        var drugDetails = firstTreatmentArm.treatment_arm_drugs[0];
        var drugName = drugDetails['name'] + ' (' + drugDetails['drug_id'] + ')';

        expect(taPage.taGene.getText()).to.eventually.equal(firstTreatmentArm.gene);
//        TODO: Fix the app to pull the number of patients from the api rather tha hard code it.
//        expect(taPage.taPatientsAssigned.getText()).to.eventually.equal(firstTreatmentArm.num_patients_assigned);
//        expect(taPage.taTotalPatientsAssigned.getText()).to.evetually.equal(firstTreatmentArm.num_patients_assigned_basic);
//        expect(taPage.taDrug.getText()).to.eventually.equal(drugName);

        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see three tabs related to the treatment arm$/, function (callback) {
        utilities.checkElementArray(taPage.middleMainTabs, taPage.expectedMainTabs);
        browser.sleep(50).then(callback);
    });


    this.Then(/^I should see the drop down to select different versions of the treatment arm$/, function (callback) {
        expect(browser.isElementPresent(taPage.versionDropDownSelector)).to.eventually.be.true;
        browser.sleep(50).then(callback);
    });


    this.Then(/^I should see (.+) Details Tab$/, function (tabName, callback) {
        var elementIndex = taPage.expectedMainTabs.indexOf(tabName);
        var elemPropertyArray = element.all(by.css('.wrapper>.tabs-container>.ng-isolate-scope>.nav-tabs>.ng-isolate-scope'));
        taPage.checkIfTabActive(elemPropertyArray, elementIndex);
        browser.sleep(50).then(callback);
    });


    this.Then(/^I should see the All Patients Data Table on the Treatment Arm$/, function (callback) {

        for (var i = 0; i < taPage.expecrtedPatientsDataTableHeaders.length; i++ ) {
            expect (taPage.allPatientsDataTable.all (by.css('th')).get(i).getText ())
                .to
                .eventually
                .eql (taPage.expecrtedPatientsDataTableHeaders[ i ])
        }
        expect(browser.isElementPresent(taPage.allPatientsDataTable)).to.eventually.eql(true).then(function () {
            browser.waitForAngular();
        }).then(callback);
    });

    this.Then(/^I should see the All Patients Data on the Treatment Arm$/, function(callback){
        callback.pending();
    });

    this.Then(/^I should sort by different columns$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    this.Then(/^I can see the legend for the charts$/, function(callback) {
        expect(taPage.tableLegendArray.count()).to.eventually.equal(2);
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see Patient Assignment Outcome chart$/, function (callback) {
        expect(browser.isElementPresent(taPage.patientPieChart)).to.eventually.be.true;
        browser.sleep(50).then(callback);
    });

    this.Then(/^I should see Diseases Represented chart$/, function (callback) {
        expect(browser.isElementPresent(taPage.diseasePieChart)).to.eventually.be.true;
        browser.sleep(50).then(callback);
    });


    this.Then(/^I download the file locally in PDF format$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    this.Then(/^I download the file locally in Excel format$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    this.Then(/^I should see the different versions of the Treatment Arm$/, function (callback) {
        expect(taPage.historyTabSubHeading.getText()).to.eventually.equal('Version History');
        expect(taPage.listOfVersions.count()).to.eventually.be.above(0);
        browser.sleep(50).then(callback);
    });
};
