
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var appointmentService = require('../service/appointment_service.js');
var curriculumService = require('../service/curriculum_service.js');
var userService = require('../service/user_service.js');
var curriculumAvailabilityAPI = require('../api/curriculum_availability_api.js');

// HANDLER
module.exports = function(req, res) {

    var inputAppointmentId = req.query.appointment_id;

    var result = {
        'appointmentId': inputAppointmentId,
        'appointmentItem': {},
        'curriculumItem': {},
        'studentUserItem': {},
        'tutorUserItem': {}
    };

    // Load appointment item
    appointmentService.loadAppointment({
        'appointmentId': inputAppointmentId
    }, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        var appointmentItem = output['appointmentItem'];
        result['appointmentItem'] = appointmentItem;

        async.parallel([

            function loadCurriculum(done) {

                var appointmentItem = result['appointmentItem'];
                var curriculumId = appointmentItem['curriculumId'];

                curriculumService.loadCurriculum({
                    'curriculum_id': curriculumId

                }, function(err, output) {

                    if (err) {
                        return done(err);
                    }

                    var curriculumObj = output['curriculum_obj'];
                    result['curriculumItem'] = curriculumObj; 
                    return done();
                });
            },

            function loadStudent(done) {

                var appointmentItem = result['appointmentItem'];
                var studentUserId = appointmentItem['studentUserId'];

                userService.loadUser({
                    'user_id': studentUserId

                }, function(err, output) {

                    if (err) {
                        return done(err);
                    }

                    var userObj = output['user_obj'];
                    result['studentUserItem'] = userObj; 
                    return done();
                });
            },

            function loadTutor(done) {

                var appointmentItem = result['appointmentItem'];
                var tutorUserId = appointmentItem['tutorUserId'];

                userService.loadUser({
                    'user_id': tutorUserId

                }, function(err, output) {

                    if (err) {
                        return done(err);
                    }

                    var userObj = output['user_obj'];
                    result['tutorUserItem'] = userObj; 
                    return done();
                });
            }

        ], function(err) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            return res.render('appointment_page', {
                'session_user': req.session_user,
                'appointmentId': inputAppointmentId,
                'appointmentItem': result['appointmentItem'],
                'curriculumItem': result['curriculumItem'],
                'studentUserItem': result['studentUserItem'],
                'tutorUserItem': result['tutorUserItem'],
            });
        })

    })
}