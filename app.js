// This loads the environment variables from the .env file
require('dotenv-extended').load();

fetch = require('node-fetch');

var builder = require('botbuilder');
var restify = require('restify');
var Promise = require('bluebird');
var request = require('request-promise').defaults({encoding: null});

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});

// Listen for messages
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {

    var msg = session.message;
    //console.log(msg,'msg')
    if (msg.attachments.length) {
        console.log(msg.attachments, 'atachment');
        
        function sendfile() {
            var output = api('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/' +
                    '1ad8ba80-bd73-4e09-b185-260423589f69/url',
            msg.attachments[0].contentUrl);
            console.log(output, '++++++++++++++++++');
            return output
        }

        sendfile().then((output)=>{
            // Message with attachment, proceed to download it. Skype & MS Teams attachment
                // URLs are secured by a JwtToken, so we need to pass the token from our bot.
                var attachment = msg.attachments[0];
                var fileDownload = checkRequiresToken(msg)
                    ? requestWithToken(attachment.contentUrl)
                    : request(attachment.contentUrl);

                fileDownload.then(function (response) {

                    // Send reply with attachment type & size
                    var reply = new builder
                        .Message(session)
                        .text('Attachment of %s type and size of %s bytes received. %s %s', attachment.contentType, response.length, JSON.stringify(output));
                    session.send(reply);

                })
                    .catch(function (err) {
                        console.log('Error downloading attachment:', {
                            statusCode: err.statusCode,
                            message: err.response.statusMessage
                        });
                    });
        })
            
                
            
        
        

    } else {

        // No attachments were sent
        var reply = new builder
            .Message(session)
            .text('Hi there! This sample is intented to show how can I receive attachments but no a' +
                    'ttachment was sent to me. Please try again sending a new message with an attachm' +
                    'ent.');
        session.send(reply);
    }

});

// Request file with Authentication Header
var requestWithToken = function (url) {
    return obtainToken().then(function (token) {
        return request({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
};

// Promise for obtaining JWT Token (requested once)
var obtainToken = Promise.promisify(connector.getAccessToken.bind(connector));

var checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};

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
