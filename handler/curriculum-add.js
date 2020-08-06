var AWS = require('aws-sdk');
AWS.config.region = "us-east-1"; //process.env.REGION
var ddb = new AWS.DynamoDB();
var ddbTable = "mf-prod-curriculum";

module.exports = function(req, res) {

    // TODO: check permission

    res.render('curriculum-add', {
    });
}
