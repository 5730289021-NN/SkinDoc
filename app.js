/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var request = require('request');
var querystring = require('querystring');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



// Create your bot with a function to receive messages from the user
// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
    var attachment = msg.attachments[0];
    var form = { Url: attachment.contentUrl };
    var formData = querystring.stringify(form);
    request({
        header: {
            'Prediction-Key' : '9ba907306c8740cea52aabd508df5c94',
            'Content-Type' : 'application/json'
        },
        uri: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/1ad8ba80-bd73-4e09-b185-260423589f69/url',
        body: formData,
        method: 'POST'
    }, function (err, res, body){
        console.log(res);
        console.log(body);
    });
        /*session.send({
            text: "You sent:",
            attachments: [
                {
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }
            ]
        });*/

    } else {
        // Echo back users text
        session.send("You said: %s", session.message.text);
    }
});