
// DEPENDENCY
var dynamodb = require("../client/dynamodb.js");

// CLASS
function TutorService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbTutorCurriculumTable = "mf-prod-tutor-curriculum";
    this.ddbCurriculumIdIndex = "curriculum_id-index";
}

TutorService.prototype.listCurriculumIdsForUser = function(input, callback) {

    var inputTutorUserId = input.tutorUserId;

    var ddbParams = {
        TableName: this.ddbTutorCurriculumTable,
        KeyConditionExpression: "tutor_user_id = :tutor_user_id", 
        ExpressionAttributeValues: {
            ":tutor_user_id": {S: inputTutorUserId}
        }, 
    };

    this.ddbClient.query(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var curriculumIdList = [];

        data.Items.forEach(function(ddbItem){
            var curriculumId = ddbItem.curriculum_id.S;
            curriculumIdList.push(curriculumId);
        });

        return callback(null, {
            'curriculumIdList': curriculumIdList
        })
    });
}

TutorService.prototype.addCurriculumForTutor = function(input, callback) {

    var ddbItem = _newDynamodbItem(
        input.tutorUserId,
        input.curriculumId
    );

    var ddbParams = {
        'TableName': this.ddbTutorCurriculumTable,
        'Item': ddbItem
    }

    this.ddbClient.putItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        return callback(null, {
            'tutorUserId': input.tutorUserId,
            'curriculumId': input.curriculumId
        });
    });
}

TutorService.prototype.removeCurriculumForTutor = function(input, callback) {

    var inputTutorUserId = input.tutorUserId;
    var inputCurriculumId = input.curriculumId;

    var ddbParams = {
        'TableName': this.ddbTutorCurriculumTable,
        'Key': {
            'tutor_user_id': {'S': inputTutorUserId},
            'curriculum_id': {'S': inputCurriculumId}
        }
    }

    this.ddbClient.deleteItem(ddbParams, function(err, data) {
        return callback(err);
    });
}

function _newDynamodbItem (tutorUserId, curriculumId) {

    if (!tutorUserId || !curriculumId) {
        return null;
    }

    var dynamodbItem = {
        "tutor_user_id": {'S': tutorUserId},
        "curriculum_id": {'S': curriculumId},
    };

    return dynamodbItem;
}

// EXPORTS
var tutorService = new TutorService();
module.exports = tutorService;
