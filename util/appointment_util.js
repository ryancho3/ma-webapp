
// DEPENDENCY
var stringUtil = require('./string_util.js')

function newDynamodbItemFromInput(input) {

    var newAppointmentId = stringUtil.generateUUIDString();
    var inputCurriculumId = input['curriculumId'];
    var inputTutorUserId = input['tutorUserId'];
    var inputStudentUserId = input['studentUserId'];
    var inputYYYYMMDD = input['yyyymmdd'];
    var inputHour = input['hour'];

    var yyyymmddhh = stringUtil.parseYYYYMMDDHHStringFromYYYYMMDDAndHour(inputYYYYMMDD, inputHour);

    var ddbItem = {
        'appointment_id' : {S: newAppointmentId},
        'curriculum_id'  : {S: inputCurriculumId},
        'tutor_user_id'  : {S: inputTutorUserId},
        'student_user_id': {S: inputStudentUserId},
        'yyyymmddhh'     : {N: yyyymmddhh}
    }
    return ddbItem;
}

function mapDynamodbItemToAppointmentItem (dynamodbItem) {

    var appointmentId = dynamodbItem.appointment_id.S;
    var curriculumId = dynamodbItem.curriculum_id.S;
    var tutorUserId = dynamodbItem.tutor_user_id.S;
    var studentUserId = dynamodbItem.student_user_id.S;
    var yyyymmddhh = dynamodbItem.yyyymmddhh.N;
    var appointmentItem = {
        'appointmentId': appointmentId,
        'curriculumId': curriculumId,
        'tutorUserId': tutorUserId,
        'studentUserId': studentUserId,
        'yyyymmddhh': yyyymmddhh,
    }

    /*if (dynamodbItem.admin_note) {
        appointmentItem['adminNote'] = dynamodbItem.admin_note.S;
    }*/
    if (dynamodbItem.note) {
        appointmentItem['tutorNote'] = dynamodbItem.note.S;
    }
    /*
    if (dynamodbItem.student_note) {
        appointmentItem['studentNote'] = dynamodbItem.student_note.S;
    }*/

    return appointmentItem;
}



// EXPORTS
module.exports.newDynamodbItemFromInput = newDynamodbItemFromInput;
module.exports.mapDynamodbItemToAppointmentItem = mapDynamodbItemToAppointmentItem;
