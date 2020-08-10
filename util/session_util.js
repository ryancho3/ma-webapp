
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

function mapDynamodbItemToSessionObj(dynamodbItem) {

    if (!dynamodbItem) {
        return null;
    }

    var sessionObj = {
        'session_id': dynamodbItem.session_id['S'],
        'user_id': dynamodbItem.user_id['S']
    };

    return sessionObj;
}

module.exports.newDynamodbItemFromInput = newDynamodbItemFromInput;
module.exports.mapDynamodbItemToSessionObj = mapDynamodbItemToSessionObj;
