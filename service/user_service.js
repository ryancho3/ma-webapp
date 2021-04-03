
// DEPENDENCY
var async = require('async');
var userUtil = require('../util/user_util.js');
var stringUtil = require('../util/string_util.js');
var dynamodb = require("../client/dynamodb.js");



// CLASS
function UserService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbUserTable = "mf-prod-user";
    this.ddbEmailIndex = "email_lowercase-index";
}

UserService.prototype.createUser = function(input, callback) {

    var ddbItem = userUtil.newDynamodbItemFromInput(input);
    var ddbParams = {
        'TableName': this.ddbUserTable,
        'Item': ddbItem
    };
    this.ddbClient.putItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var userItem = userUtil.mapDynamodbItemToUserItem(ddbItem);

        return callback(null, {
            'userItem': userItem,
        });
    });
}

UserService.prototype.loadUser = function(input, callback) {

    var inputUserId = input.user_id;

    var ddbParams = {
        'TableName': this.ddbUserTable,
        'Key': {'user_id': {'S': inputUserId}},
    }

    this.ddbClient.getItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }
        
        var userItem = userUtil.mapDynamodbItemToUserItem(data.Item);

        return callback(null, {
            'userItem': userItem
        });
    });
}

UserService.prototype.loadUserInBatch = function(input, callback) {

    var inputUserIdList = input['userIdList'];

    var ddbTable = this.ddbUserTable;

    var ddbKeys = [];
    inputUserIdList.forEach(function(userId) {
        var ddbKey = {'user_id': {'S': userId}};
        ddbKeys.push(ddbKey);
    });

    var ddbRequestItems = {};
    ddbRequestItems[ddbTable] = {Keys: ddbKeys};

    var ddbParams = {
        RequestItems: ddbRequestItems
    };

    this.ddbClient.batchGetItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var ddbItems = data.Responses[ddbTable];

        // Parse User Objects
        var userItems = [];
        ddbItems.forEach(function(ddbItem) {
            var userItem = userUtil.mapDynamodbItemToUserItem(ddbItem);
            userItems.push(userItem);
        })

        return callback(null, {
            'userItems': userItems
        });
    })
}

UserService.prototype.loadUserByEmail = function(input, callback) { 

    var inputEmail = input.email;
    var email_lowercase = inputEmail.toLowerCase();

    var ddbParams = {
        'TableName': this.ddbUserTable,
        'IndexName': this.ddbEmailIndex,
        'KeyConditionExpression': "email_lowercase = :email_lowercase", 
        'ExpressionAttributeValues': {
            ":email_lowercase": {'S': email_lowercase}
        }, 
    }

    this.ddbClient.query(ddbParams, function(err, data) {

        if (err) {
            callback(err);
            return;
        }
        
        if (data.Items.length === 0) {
            return callback(null, {});
        }

        var ddbItem = data.Items[0];
        var userItem = userUtil.mapDynamodbItemToUserItem(ddbItem);

        return callback(null, {
            'userItem': userItem,
        });
    });
}

UserService.prototype.changePassword = function(input, callback) {
    
    var inputUserId = input.user_id;
    var passwordSha256 = stringUtil.parseSha256String(input.password);
    var ddbParams = {
        'TableName': this.ddbUserTable,
        'Key': {'user_id': {'S': inputUserId}},
        'ExpressionAttributeNames': {"#P" : "password_sha256"},
        'ExpressionAttributeValues': {":p": {'S' : passwordSha256}},
        'UpdateExpression' : "SET #P = :p",
        'ReturnValues' : "ALL_NEW"
       };
    this.ddbClient.updateItem(ddbParams, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        
        return callback(null, null);
    });
}

UserService.prototype.updateProfile = function(input, callback) {
    
    var inputUserId = input.user_id;
    var profile = input.profile;
    var ddbParams = {
        'TableName': this.ddbUserTable,
        'Key': {'user_id': {'S': inputUserId}},
        'ExpressionAttributeNames': {"#Profile" : "profile"},
        'ExpressionAttributeValues': {":profile": {'S' : profile}},
        'UpdateExpression' : "SET #Profile = :profile",
        'ReturnValues' : "ALL_NEW"
       };
    this.ddbClient.updateItem(ddbParams, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        
        return callback(null, null);
    })
}

// EXPORT

var userService = new UserService();
module.exports = userService;
