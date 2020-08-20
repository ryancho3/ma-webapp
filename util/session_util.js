
// DEPENDENCY
var stringUtil = require('./string_util.js')

function newDynamodbItemFromInput(sessionInput) {

    var newSessionId = stringUtil.generateUUIDString();

    var dynamodbItem = {
        'session_id': {'S': newSessionId},
        'user_id': {'S': sessionInput.user_id},
        // TODO: created_at
    };

    return dynamodbItem;
}

function mapDynamodbItemToSessionItem(dynamodbItem) {

    if (!dynamodbItem) {
        return null;
    }

    var sessionItem = {
        'sessionId': dynamodbItem.session_id['S'],
        'userId': dynamodbItem.user_id['S']
    };

    return sessionItem;
}

module.exports.newDynamodbItemFromInput = newDynamodbItemFromInput;
module.exports.mapDynamodbItemToSessionItem = mapDynamodbItemToSessionItem;
