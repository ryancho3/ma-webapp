
// DEPENDENCY
var dynamodb = require("../client/dynamodb.js");
var sessionUtil = require('../util/session_util.js');

// CLASS
function SessionService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbSessionTable = "mf-prod-session";
}

SessionService.prototype.createSession = function(input, callback) {

    var ddbItem = sessionUtil.newDynamodbItemFromInput(input);
    var ddbParams = {
        'TableName': this.ddbSessionTable,
        'Item': ddbItem
    };

    this.ddbClient.putItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var sessionObj = sessionUtil.mapDynamodbItemToSessionObj(ddbItem);

        return callback(null, {
            'session_obj': sessionObj
        });
    });
}

SessionService.prototype.loadSession = function(input, callback) {

    var inputSessionId = input.session_id;

    var ddbParams = {
        'TableName': this.ddbSessionTable,
        'Key': {'session_id': {'S': inputSessionId}}
    }

    this.ddbClient.getItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        // Session not found
        if (!data.Item) {
            return callback(null, {});
        }

        // Session found
        var sessionObj = sessionUtil.mapDynamodbItemToSessionObj(data.Item);

        return callback(null, {
            'session_obj': sessionObj
        });
    });
}

SessionService.prototype.deleteSession = function(input, callback) {

    var inputSessionId = input.session_id;

    var ddbParams = {
        'TableName': this.ddbSessionTable,
        'Key': {'session_id': {'S': inputSessionId}}
    }

    this.ddbClient.getItem(ddbParams, function(err, data) {
        return callback(err);
    });
}

// EXPORT
var sessionService = new SessionService();
module.exports = sessionService;

