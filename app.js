// Api = require('./api');
/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

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

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

//var pictureUrl="http://www.9thaihealth.com/wp-content/uploads/2014/07/%E0%B9%82%E0%B8%A3%E0%B8%84%E0%B8%AB%E0%B8%B4%E0%B8%941.jpg";

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

bot.dialog('/', function (session) {
    var msg = session.message;
    //msg.attachments=pictureUrl;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
     var attachment = msg.attachments[0];
        session.send({
            text: fetch("https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/1ad8ba80-bd73-4e09-b185-260423589f69/url", {
                method: 'post',
                body: JSON.stringify({
                    Url:url
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return data;
            })
            // attachments: [
            //     {
            //         contentType: attachment.contentType,
            //         contentUrl: attachment.contentUrl,
            //         name: attachment.name
            //     }
            // ]
        });
    } else {
        // Echo back users text
        session.send("SkinDoc said: %s", session.message.text);
    }
});

