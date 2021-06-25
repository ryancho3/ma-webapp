
// DEPENDENCY
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws.json');

var client = new AWS.S3();

function s3Client() {
    return client;
}



// EXPORTS
module.exports.s3Client = s3Client;
