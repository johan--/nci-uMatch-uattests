/**
 *
 * Created by vivek.ramani 10/11/16
 */

var Client = require('node-rest-client').Client;
var request = require('requestretry');

var client = new Client();

var Utilities = function() {



    this.getMethod = function(route, fn){
        var args = {
            'headers': {"content-type":"application/json"}

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
        request({
            url: url,
            json:true,
            maxAttempts: 5,   // (default) try 5 times
            retryDelay: 5000,  // (default) wait for 5s before trying again
            retryStrategy: myRetryStrategy // retry on 404
        },  function(err, response, body){
            if (response) {
                console.log(body);
                console.log('The number of request attempts: ' + response.attempts);
            }
            fn(body);
        });
    };


    this.postMethod = function(route, data, fn){
        var args = {
            data: '',
            headers: {"content-type":"application/json"}

        };
        args['data'] = data;

        var url = route;
        client.registerMethod("post", url, "POST");

        client.methods.post(args, function (dt, response) {
            console.log(dt);
            fn(dt);
        });
    };

    this.putMethod = function(route, data, fn){
        var args = {
            data: '',
            headers: {"content-type":"application/json"}

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
