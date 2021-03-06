/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var needle = require('needle');

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
    var options = {
        headers: { 'Prediction-Key': '9ba907306c8740cea52aabd508df5c94',
                   'Content-Type': 'application/json'}
    }
    var data = {
        Url: 'https://cdn.pixabay.com/photo/2013/04/06/11/50/image-editing-101040_960_720.jpg'
    }
    if (msg.attachments && msg.attachments.length > 0) {
        api('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/' +
                '1ad8ba80-bd73-4e09-b185-260423589f69/url',
        session.message.attachments[0].contentUrl).then((output) => {
            session.send(output.Predictions[0].Tag+ " " + Math.round(output.Predictions[0].Probability*100) + '%\n' +
                output.Predictions[1].Tag+ "\t" + Math.round(output.Predictions[1].Probability*100) + '%\n' +
                output.Predictions[2].Tag+ "\t" + Math.round(output.Predictions[2].Probability*100) + '%\n' +
                output.Predictions[3].Tag+ "\t" + Math.round(output.Predictions[3].Probability*100) + '%\n' +
                output.Predictions[4].Tag+ "\t" + Math.round(output.Predictions[4].Probability*100) + '%\n' +
                output.Predictions[5].Tag+ "\t" + Math.round(output.Predictions[5].Probability*100) + '%\n' 
            )
        })
    } else 
        session.send('Please send Picture to Predict disease');
});

function api(url, picUrl) {
    return fetch(url, {
        method: 'post',

        headers: {
            'Prediction-Key': '9ba907306c8740cea52aabd508df5c94',
            'content-type': 'application/json'
        },
            body: JSON.stringify({Url: picUrl})
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data;
        });
}

