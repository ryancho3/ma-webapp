
// DEPENDENCY
var async = require('async');
var dynamodb = require('../client/dynamodb.js');
var appointmentUtil = require('../util/appointment_util.js');

// CLASS
function AppointmentService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbAppointmentTableName = "mf-prod-appointment";
    this.ddbAppointmentArchiveTableName = "mf-prod-appointment-archive";
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

AppointmentService.prototype.scanAppointments = function(input, callback) {

    var inputStartYYYYMMDD = input['startYYYYMMDD'];
    var startYYYYMMDDHH = inputStartYYYYMMDD + "00";

    var ddbParams = {
        'TableName': this.ddbAppointmentTableName,
        'FilterExpression': ":start_yyyymmddhh <= yyyymmddhh",
        'ExpressionAttributeValues': {
            ":start_yyyymmddhh": {'N': startYYYYMMDDHH}
        }
    }

    this.ddbClient.scan(ddbParams, function(err, data) {

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
    var inputNote = String(input['note']);
    console.log(inputAppointmentId);
    var ddbParams = {
        'TableName': this.ddbAppointmentTableName,
        'Key': {'appointment_id': {'S': inputAppointmentId}},
        'ExpressionAttributeNames': {"#Note" : "note"},
        'ExpressionAttributeValues': {':note': {'S': inputNote}},
        'UpdateExpression': 'SET #Note = :note',  
        'ReturnValues': 'ALL_NEW'
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

AppointmentService.prototype.archiveAppointment = function (input, callback) {

    var ddbClient = this.ddbClient
    var ddbAppointmentTableName = this.ddbAppointmentTableName;
    var ddbAppointmentArchiveTableName = this.ddbAppointmentArchiveTableName;

    var inputAppointmentId = input['appointmentId'];
    var inputNote = input['note'];

    var result = {
        'ddbItem': {},
        'appointmentItem': {}
    };

    async.waterfall([

        function loadAppointment (next) {

            var ddbParams = {
                'TableName': ddbAppointmentTableName,
                'Key': {'appointment_id': {'S': inputAppointmentId}}
            }

            ddbClient.getItem(ddbParams, function(err, data) {

                if (err) {
                    return next(err);
                }

                // Not Found
                if (!data.Item) {
                    return next(null, {});
                }

                var appointmentItem = appointmentUtil.mapDynamodbItemToAppointmentItem(data.Item);
                result['appointmentItem'] = appointmentItem;
                result['ddbItem'] = data.Item;
                return next();
            });
        },

        function createAppointmentHistory (next) {

            var ddbItem = result['ddbItem'];
            if (!ddbItem) {
                return next();
            }

            ddbItem['archive_note'] = {S: inputNote};
            
            var ddbParams = {
                'TableName': ddbAppointmentArchiveTableName,
                'Item': ddbItem
            }

            ddbClient.putItem(ddbParams, function(err, data) {

                if (err) {
                    return callback(err);
                }

                var appointmentItem = appointmentUtil.mapDynamodbItemToAppointmentItem(ddbItem);
                result['appointmentItem'] = appointmentItem;
                return next();
            });
        },

        function removeActiveAppointment (next) {

            var appointmentItem = result['appointmentItem'];
            if (!appointmentItem) {
                return next();
            }

            var ddbParams = {
                'TableName': ddbAppointmentTableName,
                'Key': {
                    'appointment_id': {'S': inputAppointmentId}
                }
            }

            ddbClient.deleteItem(ddbParams, function(err, data) {
                return next(err);
            });
        }

    ], function(err) {

        if (err) {
            return callback(err);
        }

        return callback();
    })
}

// EXPORT
var appointmentService = new AppointmentService();
module.exports = appointmentService;
