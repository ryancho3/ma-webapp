
// DEPENDENCY
const { v4: uuidv4 } = require('uuid');
var dynamodb = require("../client/dynamodb.js");

// CLASS
function SessionService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbSessionTable = "mf-prod-session";
}

SessionService.prototype.createSession = function(input, callback) {

    var inputUserId = input.user_id;

    var ddbItem = {
        'session_id': {'S': uuidv4()},
        'user_id': {'S': inputUserId}
    };

    this.ddbClient.putItem({
        'TableName': this.ddbSessionTable,
        'Item': ddbItem

    }, function(err, data) {

        if (err) {
            callback(err);
            return;
        }

        var session_obj = {
            'session_id': ddbItem.session_id['S'],
            'user_id': ddbItem.user_id['S']
        };

        return callback(null, {
            'session_obj': session_obj
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
        var ddbItem = data.Item;

        var session_obj = {
            'session_id': ddbItem.session_id['S'],
            'user_id': ddbItem.user_id['S']
        };

        return callback(null, {
            'session_obj': session_obj
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

