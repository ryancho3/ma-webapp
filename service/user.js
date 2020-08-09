
// DEPENDENCY
const { v4: uuidv4 } = require('uuid');
var crypto = require('crypto');
var dynamodb = require("../client/dynamodb.js");

// CLASS
function UserService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbUserTable = "mf-prod-user";
    this.ddbEmailIndex = "email_lowercase-index";
}

UserService.prototype.createUser = function(input, callback) {

    var inputType = input.type;
    var inputPassword = input.password;
    var inputEmail = input.email;

    var email_lowercase = inputEmail.toLowerCase();
    var password_sha256 = crypto.createHash('sha256').update(inputPassword).digest('base64');

    var ddbItem = {
        'user_id': {'S': uuidv4()},
        'user_type': {'S': inputType},
        'email_lowercase': {'S': email_lowercase},
        'password_sha256': {'S': password_sha256},
        'name': {'S': input.name},
        'profile': {'S': input.profile}
    };

    this.ddbClient.putItem({
        'TableName': this.ddbUserTable,
        'Item': ddbItem

    }, function(err, data) {

        if (err) {
            callback(err);
            return;
        }

        var user_obj = {
            'user_id': ddbItem.user_id['S'],
            'user_type': ddbItem.user_type['S'],
            'email_lowercase': ddbItem.email_lowercase['S'],
            'name': ddbItem.name['S'],
            'profile': ddbItem.profile['S'],
        };

        return callback(null, {
            'user_obj': user_obj
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
            callback(err);
            return;
        }
        
        var ddbItem = data.Item;

        var user_obj = {
            'user_id': ddbItem.user_id['S'],
            'user_type': ddbItem.user_type['S'],
            'email_lowercase': ddbItem.email_lowercase['S'],
            'password_sha256': ddbItem.password_sha256['S'],
            'name': ddbItem.name['S'],
            'profile': ddbItem.profile['S'],
        };

        return callback(null, {
            'user_obj': user_obj
        });
    });
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

        var user_obj = {
            'user_id': ddbItem.user_id['S'],
            'user_type': ddbItem.user_type['S'],
            'email_lowercase': ddbItem.email_lowercase['S'],
            'password_sha256': ddbItem.password_sha256['S'],
            'name': ddbItem.name['S'],
            'profile': ddbItem.profile['S'],
        };

        return callback(null, {
            'user_obj': user_obj
        });
    });
}

// EXPORT

var userService = new UserService();
module.exports = userService;
