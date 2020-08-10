
// DEPENDENCY
var stringUtil = require('./string_util.js')

function newDynamodbItemFromInput(userInput) {

    var newUserId = stringUtil.generateUUIDString();
    var emailLowercase = stringUtil.toLowercaseString(userInput.email);
    var passwordSha256 = stringUtil.parseSha256String(userInput.password);

    var dynamodbItem = {
        'user_id': {'S': newUserId},
        'user_type': {'S': userInput.type},
        'email_lowercase': {'S': emailLowercase},
        'password_sha256': {'S': passwordSha256},
        'name': {'S': userInput.name},
        'profile': {'S': userInput.profile}
    };

    return dynamodbItem;
}

function mapDynamodbItemToUserObj(dynamodbItem) {

    if (!dynamodbItem) {
        return null;
    }

    var userObj = {
        'user_id': dynamodbItem.user_id['S'],
        'user_type': dynamodbItem.user_type['S'],
        'email_lowercase': dynamodbItem.email_lowercase['S'],
        'password_sha256': dynamodbItem.password_sha256['S'],
        'name': dynamodbItem.name['S'],
        'profile': dynamodbItem.profile['S'],
    };

    return userObj;
}

module.exports.newDynamodbItemFromInput = newDynamodbItemFromInput;
module.exports.mapDynamodbItemToUserObj = mapDynamodbItemToUserObj;
