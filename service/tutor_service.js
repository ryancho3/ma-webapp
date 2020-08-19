
// DEPENDENCY
var dynamodb = require("../client/dynamodb.js");

// CLASS
function TutorService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbTutorCurriculumTable = "mf-prod-tutor-curriculum";
    this.ddbCurriculumIdIndex = "curriculum_id-index";
    this.ddbTutorAvailabilityTable = "mf-prod-tutor-availability";
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

TutorService.prototype.listTutorUserIdsForCurriculum = function(input, callback) {

    var inputCurriculumId = input.curriculumId;

    var ddbParams = {
        'TableName': this.ddbTutorCurriculumTable,
        'IndexName': this.ddbCurriculumIdIndex,
        'KeyConditionExpression': "curriculum_id = :curriculum_id",
        'ExpressionAttributeValues': {
            ":curriculum_id": {'S': inputCurriculumId}
        }
    };

    this.ddbClient.query(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        // Parse tutor userIds
        var tutorUserIdList = [];
        data.Items.forEach(function(ddbItem){
            var tutorUserId = ddbItem.tutor_user_id.S;
            tutorUserIdList.push(tutorUserId);
        });

        // Return success
        return callback(null, {
            'tutorUserIdList': tutorUserIdList
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

TutorService.prototype.updateAvailabilityForTutor = function(input, callback) {

    var inputTutorUserId = input.tutorUserId;
    var inputYYYYMMDD = "" + input.yyyymmdd;
    var inputHourStringList = _convertHourNumberListToHourStringList(input.hours); // [8,9,18] => ["8","9","18"]

    var ddbItem = {
        "tutor_user_id": {'S': inputTutorUserId},
        "yyyymmdd": {'N': inputYYYYMMDD},
        "hours": {'NS': inputHourStringList}
    }

    var ddbParams = {
        'TableName': this.ddbTutorAvailabilityTable,
        'Item': ddbItem
    }

    this.ddbClient.putItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        return callback(null, {
            'tutorUserId': input.tutorUserId,
            'yyyymmdd': input.yyyymmdd,
            'hours': input.hours
        });
    });
}

TutorService.prototype.queryAvailabilityForTutor = function(input, callback) {

    var inputTutorUserId = input.tutorUserId;
    var inputStartYYYYMMDD = "" + input.startYYYYMMDD;
    var inputEndYYYYMMDD = "" + input.endYYYYMMDD;

    var ddbParams = {
        'TableName': this.ddbTutorAvailabilityTable,
        'KeyConditionExpression': "tutor_user_id = :tutor_user_id AND yyyymmdd BETWEEN :start_yyyymmdd AND :end_yyyymmdd", // BETWEEN is inclusive (greater than or equal + less than equal)
        'ExpressionAttributeValues': {
            ":tutor_user_id": {'S': inputTutorUserId},
            ":start_yyyymmdd": {'N': inputStartYYYYMMDD},
            ":end_yyyymmdd": {'N': inputEndYYYYMMDD}
        }
    }

    this.ddbClient.query(ddbParams, function(err, data) {

        if (err) {
            callback(err);
            return;
        }

        // {yyyymmdd1: [h1, h2, h3], yyyymmdd2: [h4, h5]}
        var dateToAvailableHourListMap = {};
        data.Items.forEach(function(ddbItem) {
            var datestr = "" + ddbItem.yyyymmdd.N;
            var hourNumberList = _convertHourStringListToHourNumberList(ddbItem.hours.NS);
            dateToAvailableHourListMap[datestr] = hourNumberList;
        })

        return callback(null, {
            'dateToAvailableHourListMap': dateToAvailableHourListMap
        });
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

function _convertHourNumberListToHourStringList (hourNumberList) {

    var hourStringList = [];
    hourNumberList.forEach(function(hourString) {
        var hourNumber = "" + hourString;
        hourStringList.push(hourNumber);
    });

    return hourStringList;
}

function _convertHourStringListToHourNumberList (hourStringList) {

    var hourNumberList = [];
    hourStringList.forEach(function(hourString) {
        var hourNumber = parseInt(hourString);
        hourNumberList.push(hourNumber);
    });

    return hourNumberList;
}

// EXPORTS
var tutorService = new TutorService();
module.exports = tutorService;
