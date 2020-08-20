
// DEPENDENCY
var appointmentService = require('../service/appointment_service.js');
const session = require('../middleware/session.js');

module.exports = function(req, res) {

    var sessionModel = req.sessionModel;
    var sessionUserType = sessionModel.getUserType();

    // TODO: check permission

    var input = {};
    input.appointmentId = req.body.appointmentId;
    input.note = req.body.note;

    if (sessionUserType == 'ADMIN') {

        appointmentService.updateAdminNote(input, function(err, output) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            return res.redirect('/appointment-view?appointment_id=' + input.appointmentId);
        });

    } else if (sessionUserType == 'TUTOR') {

        appointmentService.updateTutorNote(input, function(err, output) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            return res.redirect('/appointment-view?appointment_id=' + input.appointmentId);
        });

    } else {

        appointmentService.updateStudentNote(input, function(err, output) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            return res.redirect('/appointment-view?appointment_id=' + input.appointmentId);
        });
    }
}

