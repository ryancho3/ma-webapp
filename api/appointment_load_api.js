
// DEPENDENCY
var async = require('async');
var appointmentService = require('../service/appointment_service.js');
var userService = require('../service/user_service.js');
var curriculumService = require("../service/curriculum_service");

module.exports = function(apiInput, apiCallback) {

    var inputAppointmentId = apiInput['appointmentId'];

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
            return apiCallback(err);
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

                    var userItem = output['userItem'];
                    result['studentUserItem'] = userItem; 
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

                    var userItem = output['userItem'];
                    result['tutorUserItem'] = userItem; 
                    return done();
                });
            }

        ], function(err) {

            if (err) {
                return apiCallback(err);
            }

            return apiCallback(null, {
                'appointment': result
            });
        })
    })
}
