
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

// EXPORT
var appointmentService = new AppointmentService();
module.exports = appointmentService;
