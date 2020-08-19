
// DEPENDENCY
var async = require('async');
var userUtil = require('../util/user_util.js');
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

        var userObj = userUtil.mapDynamodbItemToUserObj(ddbItem);

        return callback(null, {
            'user_obj': userObj
        });
    });
}

UserService.prototype.loadUser = function(input, callback) {

    var inputUserId = input.user_id;

    var ddbParams = {
        'TableName': this.ddbUserTable,
        'Key': {'user_id': {'S': input.user_id}},
    }

    this.ddbClient.getItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }
        
        var userObj = userUtil.mapDynamodbItemToUserObj(data.Item);

        return callback(null, {
            'user_obj': userObj
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

    console.log(JSON.stringify(ddbParams))

    this.ddbClient.batchGetItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var ddbItems = data.Responses[ddbTable];

        // Parse User Objects
        var userObjList = [];
        ddbItems.forEach(function(ddbItem) {
            var userObj = userUtil.mapDynamodbItemToUserObj(ddbItem);
            userObjList.push(userObj);
        })

        return callback(null, {
            'userObjList': userObjList
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
        var userObj = userUtil.mapDynamodbItemToUserObj(ddbItem);

        return callback(null, {
            'user_obj': userObj
        });
    });
}

// EXPORT

var userService = new UserService();
module.exports = userService;
