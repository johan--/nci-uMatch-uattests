/**
 *
 * Created by vivek.ramani 10/11/16
 */

var Client = require('node-rest-client').Client;
var request = require('requestretry');

var client = new Client();

var Utilities = function() {

    this.waitForElement = function(element, message) {
        return browser.wait(function (){
            return browser.isElementPresent(element)
        }, 15000, message + ' element is not visible.');
    };

    this.checkTitle = function(dv, title) {
        console.log(dv.getTitle());
        return expect(dv.getTitle()).to.eventually.equal(title);
    };

    this.getMethod = function(route, fn){
        var args = {
            headers: {"content-type":"application/json",  "Authorization": browser.idToken }

        };

        var url = route;
        console.log(url);

        client.get(url,args, function(error, data, response){
            fn(data);
        }).on('error', function(err){
            console.error("error occurred.",err.request.options);
        });

    };



    this.getMethod_with_retry = function(route, fn){
        function myRetryStrategy(err, response, body){
            var flag = false;
            if (JSON.stringify(body) == "[]"){
                flag = true;
            }
            else if (JSON.stringify(body) == "[{}]"){
                flag = true;
            }
            else if (response.statusCode === 404){
                flag = true;
            };
            return flag;
        };
        var url = route
        console.log("Get URL: "+url);
        //console.log("token: "+browser.idToken);
        request({
            url: url,
            json:true,
            headers: {"Authorization": browser.idToken },
            maxAttempts: 5,   // (default) try 5 times
            retryDelay: 10000,  // (default) wait for 5s before trying again
            retryStrategy: myRetryStrategy // retry on 404
        },  function(err, response, body){
            if (response) {
                //console.log(response);
                console.log('The number of request attempts: ' + response.attempts);
            }
            fn(body);
        });
    };

    this.getMethod_with_retry_until_expected_patient_status = function(route, expVal, fn){
        function myRetryStrategy(err, response, body){
            var flag = false;
            if (JSON.parse(JSON.stringify(body))["current_status"] == expVal){
                flag = true;
            };
            return flag;
        };
        var url = route;
        console.log("Get URL: "+url);
        request({
            url: url,
            json:true,
            headers: {"Authorization": browser.idToken },
            maxAttempts: 5,   // (default) try 5 times
            retryDelay: 10000,  // (default) wait for 5s before trying again
            retryStrategy: myRetryStrategy // retry until expected status is received
        },  function(err, response, body){
            if (response) {
                //console.log(response);
                console.log('The number of request attempts: ' + response.attempts);
            }
            fn(body);
        });
    };

    this.postMethod = function(url, body, fn) {
        var reqBody = body !== undefined ? body : {};

        var args = {
            data: reqBody,
            headers: {"content-type":"application/json"},
            "Accept": "application/json"
        };
        args['headers'] = browser.idToken != null ? { "content-type":"application/json", 'Authorization': browser.idToken } : {"content-type":"application/json"}
        client.registerMethod("post", url, "POST");


        client.methods.post(args, function (dt,response) {
            console.log(dt);
            fn(dt);
        });

    };

    this.putMethod = function(route, data, fn){
        var args = {
            data: '',
            headers: { "content-type":"application/json", "Authorization": "Bearer " + browser.idToken }

        };
        args['data'] = data;

        var url = route;
        client.registerMethod("put", url, "PUT");

        client.methods.put(args, function (dt, response) {
            console.log(dt);
            fn(dt);
        });
    };

};

module.exports = new Utilities();
