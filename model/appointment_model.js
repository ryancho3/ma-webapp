
// DEPENDENCY
var stringUtil = require('../util/string_util.js');

function AppointmentModel() {

    this.appointmentItem = null;
    this.curriculumItem = null;
    this.tutorUserItem = null;
    this.studentUserItem = null;
}

// SETTERS

AppointmentModel.prototype.setAppointmentItem = function(appointmentItem) {
    this.appointmentItem = appointmentItem;
}

AppointmentModel.prototype.setCurriculumItem = function(curriculumItem) {
    this.curriculumItem = curriculumItem;
}

AppointmentModel.prototype.setTutorUserItem = function(tutorUserItem) {
    this.tutorUserItem = tutorUserItem;
}

AppointmentModel.prototype.setStudentUserItem = function(studentUserItem) {
    this.studentUserItem = studentUserItem;
}

// GETTERS

AppointmentModel.prototype.getAppointmentId = function() {
    if (!this.appointmentItem) {
        return null;
    }
    return this.appointmentItem['appointmentId'];
}

AppointmentModel.prototype.getCurriculumId = function() {

    if (!this.curriculumItem) {
        return null;
    }
    return this.curriculumItem['curriculum_id'];
}

AppointmentModel.prototype.getCurriculumName = function() {

    if (!this.curriculumItem) {
        return null;
    }
    return this.curriculumItem['name'];
}

AppointmentModel.prototype.getTutorUserId = function() {

    if (!this.tutorUserItem) {
        return null;
    }
    return this.tutorUserItem['user_id'];
}

AppointmentModel.prototype.getTutorUserName = function() {

    if (!this.tutorUserItem) {
        return null;
    }
    return this.tutorUserItem['name'];
}

AppointmentModel.prototype.getTutorUserEmail = function() {

    if (!this.tutorUserItem) {
        return null;
    }
    return this.tutorUserItem['email_lowercase'];
}

AppointmentModel.prototype.getStudentUserId = function() {

    if (!this.studentUserItem) {
        return null;
    }
    return this.studentUserItem['user_id'];
}

AppointmentModel.prototype.getStudentUserName = function() {

    if (!this.studentUserItem) {
        return null;
    }
    return this.studentUserItem['name'];
}

AppointmentModel.prototype.getStudentUserEmail = function() {

    if (!this.studentUserItem) {
        return null;
    }
    return this.studentUserItem['email_lowercase'];
}

AppointmentModel.prototype.getAdminNote = function() {

    if (!this.appointmentItem) {
        return null;
    }
    return this.appointmentItem['adminNote'];
}

AppointmentModel.prototype.getTutorNote = function() {

    if (!this.appointmentItem) {
        return null;
    }
    return this.appointmentItem['tutorNote'];
}

AppointmentModel.prototype.setTutorNote = function(note) {
    this.appointmentItem['tutorNote'] = note;
}

AppointmentModel.prototype.getAppointmentStartDateString = function() {

    if (!this.appointmentItem) {
        return null;
    }

    var yyyymmddhh = this.appointmentItem['yyyymmddhh']

    var yyyymmdd = yyyymmddhh.substring(0, 8);
    var dayString = stringUtil.parseFullDayStringFromYYYYMMDD(yyyymmdd); // ex. "Monday"

    var stringYYYY = yyyymmddhh.substring(0, 4);
    var stringMM = yyyymmddhh.substring(4, 6);
    var stringDD = yyyymmddhh.substring(6, 8);

    return stringYYYY + "/" + stringMM + "/" + stringDD + "(" + dayString + ")";
}

AppointmentModel.prototype.getAppointmentStartTimeString = function() {

    if (!this.appointmentItem) {
        return null;
    }

    var yyyymmddhh = this.appointmentItem['yyyymmddhh']

    var stringYYYY = yyyymmddhh.substring(0, 4);
    var stringMM = yyyymmddhh.substring(4, 6);
    var stringDD = yyyymmddhh.substring(6, 8);
    var stringHH = yyyymmddhh.substring(8, 10);

    var hour = parseInt(stringHH);
    return hour + ":00";
}

// EXPORTS
module.exports = AppointmentModel;
