
// DEPENDENCY
var appointmentService = require('../service/appointment_service.js');
var emailService = require('../service/email_service.js');

module.exports = function(req, res) {

    // TODO: check permission

    var input = {};
    input.studentUserId = req.sessionModel.getSessionUserId();
    input.curriculumId = req.body.curriculum_id;
    input.tutorUserId = req.body.tutor_user_id;
    input.yyyymmdd = req.body.yyyymmdd;
    input.hour = req.body.hour;

    appointmentService.createAppointment(input, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        var appointmentItem = output['appointmentItem'];

        emailService.sendAppointmentEmailNotificationToTutor(appointmentItem);
        emailService.sendAppointmentEmailNotificationToStudent(appointmentItem);

        res.render('appointment_create_success_page', {
            'sessionModel': req.sessionModel,
            'appointment_item': appointmentItem
        });
    });
}
