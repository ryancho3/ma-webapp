
// DEPENDENCY
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws.json');

var client = new AWS.DynamoDB();

function dynamodbClient() {
    return client;
}

// EXPORTS
module.exports.dynamodbClient = dynamodbClient;