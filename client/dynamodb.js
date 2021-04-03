
// DEPENDENCY
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws.json');

var client = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

function dynamodbClient() {
    return client;
}

function documentClient() {
    return docClient;
}

// EXPORTS
module.exports.dynamodbClient = dynamodbClient;
module.exports.documentClient = documentClient;