
// DEPENDENCY
var dynamodb = require('../client/dynamodb.js');
var appointmentUtil = require('../util/appointment_util.js');

// CLASS
function AppointmentService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbAppointmentTableName = "mf-prod-appointment";
    this.ddbTutorIndexName = "tutor_user_id-yyyymmddhh-index";
    this.ddbStudentIndexName = "student_user_id-yyyymmddhh-index";
}

AppointmentService.prototype.createAppointment = function(input, callback) {

    var ddbItem = appointmentUtil.newDynamodbItemFromInput(input);
    var ddbParams = {
        'TableName': this.ddbAppointmentTableName,
        'Item': ddbItem
    }

    this.ddbClient.putItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var appointmentItem = appointmentUtil.mapDynamodbItemToAppointmentItem(ddbItem);

        return callback(null, {
            'appointmentItem': appointmentItem
        });
    });
}

AppointmentService.prototype.loadAppointment = function(input, callback) {

    var ddbParams = {
        'TableName': this.ddbAppointmentTableName,
        'Key': {'appointment_id': {'S': input.appointmentId}}
    }

    this.ddbClient.getItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        // Not Found
        if (!data.Item) {
            return callback(null, {});
        }

        var appointmentItem = appointmentUtil.mapDynamodbItemToAppointmentItem(data.Item);

        return callback(null, {
            'appointmentItem': appointmentItem
        });
    });
}

AppointmentService.prototype.queryStudentAppointments = function(input, callback) {

    var inputStudentUserId = input['studentUserId'];
    var inputStartYYYYMMDD = input['startYYYYMMDD'];

    var startYYYYMMDDHH = inputStartYYYYMMDD + "00";

    var ddbParams = {
        'TableName': this.ddbAppointmentTableName,
        'IndexName': this.ddbStudentIndexName,
        'KeyConditionExpression': "student_user_id = :student_user_id AND :start_yyyymmddhh <= yyyymmddhh",
        'ExpressionAttributeValues': {
            ":student_user_id": {'S': inputStudentUserId},
            ":start_yyyymmddhh": {'N': startYYYYMMDDHH}
        }
    }

    this.ddbClient.query(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var appointmentItemList = [];
        data.Items.forEach(function(ddbItem) {
            var appointmentItem = appointmentUtil.mapDynamodbItemToAppointmentItem(ddbItem);
            appointmentItemList.push(appointmentItem);
        });

        return callback(null, {
            'appointmentItemList': appointmentItemList
        });
    });
}

AppointmentService.prototype.queryTutorAppointments = function(input, callback) {

    var inputTutorUserId = input['tutorUserId'];
    var inputStartYYYYMMDD = input['startYYYYMMDD'];

    var startYYYYMMDDHH = inputStartYYYYMMDD + "00";

    var ddbParams = {
        'TableName': this.ddbAppointmentTableName,
        'IndexName': this.ddbTutorIndexName,
        'KeyConditionExpression': "tutor_user_id = :tutor_user_id AND :start_yyyymmddhh <= yyyymmddhh",
        'ExpressionAttributeValues': {
            ":tutor_user_id": {'S': inputTutorUserId},
            ":start_yyyymmddhh": {'N': startYYYYMMDDHH}
        }
    }

    this.ddbClient.query(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var appointmentItemList = [];
        data.Items.forEach(function(ddbItem) {
            var appointmentItem = appointmentUtil.mapDynamodbItemToAppointmentItem(ddbItem);
            appointmentItemList.push(appointmentItem);
        });

        return callback(null, {
            'appointmentItemList': appointmentItemList
        });
    });
}

AppointmentService.prototype.updateAdminNote = function (input, callback) {

    var inputAppointmentId = input['appointmentId'];
    var inputNote = input['note'];

    var ddbParams = {
        TableName: this.ddbAppointmentTableName,
        Key: {
            'appointment_id': {S: inputAppointmentId}
        },
        UpdateExpression: 'SET admin_note = :note',
        ExpressionAttributeValues: {
            ':note': {S: inputNote}
        },
        ReturnValues: 'ALL_NEW'
    }

    this.ddbClient.updateItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        //var ddbItem = data.Attributes;
        //console.log(ddbItem);

        return callback();
    })
}

AppointmentService.prototype.updateTutorNote = function (input, callback) {

    var inputAppointmentId = input['appointmentId'];
    var inputNote = input['note'];

    var ddbParams = {
        TableName: this.ddbAppointmentTableName,
        Key: {
            'appointment_id': {S: inputAppointmentId}
        },
        UpdateExpression: 'SET tutor_note = :note',
        ExpressionAttributeValues: {
            ':note': {S: inputNote}
        },
        ReturnValues: 'ALL_NEW'
    }

    this.ddbClient.updateItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        //var ddbItem = data.Attributes;
        //console.log(ddbItem);

        return callback();
    })
}

AppointmentService.prototype.updateStudentNote = function (input, callback) {

    var inputAppointmentId = input['appointmentId'];
    var inputNote = input['note'];

    var ddbParams = {
        TableName: this.ddbAppointmentTableName,
        Key: {
            'appointment_id': {S: inputAppointmentId}
        },
        UpdateExpression: 'SET student_note = :note',
        ExpressionAttributeValues: {
            ':note': {S: inputNote}
        },
        ReturnValues: 'ALL_NEW'
    }

    this.ddbClient.updateItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        //var ddbItem = data.Attributes;
        //console.log(ddbItem);

        return callback();
    })
}

// EXPORT
var appointmentService = new AppointmentService();
module.exports = appointmentService;
