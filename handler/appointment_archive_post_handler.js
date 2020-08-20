
// DEPENDENCY
var appointmentService = require('../service/appointment_service.js');

module.exports = function(req, res) {

    // TODO: check permission

    var input = {};
    input.appointmentId = req.body.appointment_id;
    input.note = req.body.note;

    appointmentService.archiveAppointment(input, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        return res.redirect('/appointment-list');
    });
}
