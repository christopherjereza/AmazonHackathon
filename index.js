var Alexa = require('alexa-sdk');

var handlers = {
    'LaunchRequest': function () {
        this.emit('HelloWorldIntent');
    },
    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    }
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};