
// DEPENDENCY
var appointmentService = require('../service/appointment_service.js');

module.exports = function(req, res) {

    // TODO: check permission
    req.session_user.user_id;

    var input = {};
    input.studentUserId = req.session_user.user_id;
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

        res.render('appointment_create_success_page', {
            'session_user': req.session_user,
            'appointment_item': appointmentItem
        });
    });
}
