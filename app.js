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
   console.log("sent-2")
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

console.log("sent-31")

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);
console.log("sent-11")

bot.dialog('/', function (session) {
    var msg = session.message;
    console.log("sent0")
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
     console.log("sent1")
        request.post(
            {
                url : url,
                headers : headers,
                body : body
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    session.send({text: body});
                    console.log("sent2")
                }
            }
        );
        console.log("sent3")
    } else {
        console.log("sent4")
        // Echo back users text
        session.send("Skin said: %s", session.message.text);
        console.log("sent5")
    }
    console.log("sent6")
});