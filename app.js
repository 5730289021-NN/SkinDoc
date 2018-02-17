/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var request = require('request');

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

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */
console.log("sent-1")

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var url = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/1ad8ba80-bd73-4e09-b185-260423589f69/url';
var headers = { 
    'Prediction-Key': '9ba907306c8740cea52aabd508df5c94',
    'Content-Type' : 'application/json' 
};
var body = {
    'Url' : 'http://www.moronface.com/make-pictures/funny-pictures-2010-2/dddd1-34982.jpg'
}


// Create your bot with a function to receive messages from the user
/*
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);
*/

var bot = new builder.UniversalBot(connector, function (session) {
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
     var attachment = msg.attachments[0];
        session.send({
            text: "You sent:",
            attachments: [
                {
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }
            ]
        });
    } else {
        // Echo back users text
        session.send("You said: %s", session.message.text);
    }
});
/*

bot.dialog('/', function (session) {
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
        request.post(
            {
                url : url,
                headers : headers,
                body : body
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    session.send({text: body});
                }
            }
        );
    } else {
        // Echo back users text
        session.send("Skin said: %s", session.message.text);
    }
});
*/