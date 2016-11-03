/**
 * Created by vivek.ramani
 */

var dashboard_page;
dashboard_page = function () {

    var pageTitle = 'MATCHBox | Dashboard';
    var variantPageTitle = 'MATCHBox | Patient Variant Report'
    var logoutLink = element(by.css('a[ng-click="logout()"]'));


    this.goto_page_name = function (pageName) {
        return dv.get('/#/' + pageName, 6000);
    };


    this.select_pending_variant_report = function (pt_id) {
        dv.ignoreSynchronization = true;
        dv.sleep(5000);
        var pendingVRTable = element(by.repeater("item in filtered | startFrom:(paginationOptions.currentPage-1)*paginationOptions.itemsPerPage | limitTo:paginationOptions.itemsPerPage track by $index"));
        expect(dv.isElementPresent(pendingVRTable)).to.eventually.be.true;

        dv.element.all(by.repeater("item in filtered | startFrom:(paginationOptions.currentPage-1)*paginationOptions.itemsPerPage | limitTo:paginationOptions.itemsPerPage track by $index")).filter(function (elem) {
            return elem.$$('td').get(0).getText().then(function (patient_id) {
                return patient_id === pt_id;
            });
        }).first().$$('td').get(2).$$('a').getAttribute("href").then(function (url) {
            //console.log(url[0]);
            dv.get(url[0]).then(function () {
                dv.waitForAngular().then(function () {
                    dv.getTitle().then(function (title) {
                        expect(title).to.eql(variantPageTitle);
                    })
                });
            });
            dv.ignoreSynchronization = false;
        });
    };


    this.select_pending_assignment_report = function (pt_id) {
        dv.ignoreSynchronization = true;
        dv.sleep(5000);
        dv.refresh();
        //element(by.css('a[href="#/dashboard"]')).click();
        dv.sleep(5000);
        var pendingARTable = element(by.repeater("item in filtered | startFrom:(paginationOptions.currentPage-1)*paginationOptions.itemsPerPage | limitTo:paginationOptions.itemsPerPage track by $index"));
        dv.element(by.xpath(".//*[@id='page-wrapper']/div[1]/div/div[3]/div/div[2]/div/ul/li[2]/a")).click().then(function () {
            expect(dv.isElementPresent(pendingARTable)).to.eventually.be.true;
        });

        dv.element.all(by.repeater("item in filtered | startFrom:(paginationOptions.currentPage-1)*paginationOptions.itemsPerPage | limitTo:paginationOptions.itemsPerPage track by $index")).filter(function (elem) {
            return elem.$$('td').get(0).getText().then(function (patient_id) {
                return patient_id === pt_id;
            });
        }).first().$$('td').get(2).$$('a').getAttribute("href").then(function (url) {
            //console.log(url[0]);
            dv.get(url[0]).then(function () {
                dv.waitForAngular().then(function () {
                    dv.getTitle().then(function (title) {
                        expect(title).to.eql(variantPageTitle);
                    })
                });
            });
            dv.ignoreSynchronization = false;
        });
    };

    this.logout = function () {
        dv.ignoreSynchronization = true;
        logoutLink.click();
        console.log('Clicked Logout');
        dv.ignoreSynchronization = false;
        browser.waitForAngular();
    };
};

module.exports = new dashboard_page();
