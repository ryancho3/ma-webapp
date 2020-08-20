
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var appointmentService = require('../service/appointment_service.js');
var curriculumService = require('../service/curriculum_service.js');
var userService = require('../service/user_service.js');
var curriculumAvailabilityAPI = require('../api/curriculum_availability_api.js');
var AppointmentModel = require('../model/appointment_model.js');

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
                return res.render('error_page', {
                    err: err
                });
            }


            var appointmentItem = result['appointmentItem'];
            var curriculumItem = result['curriculumItem'];
            var tutorUserItem = result['tutorUserItem'];
            var studentUserItem = result['studentUserItem'];

            var appointmentModel = new AppointmentModel();
            appointmentModel.setAppointmentItem(appointmentItem);
            appointmentModel.setCurriculumItem(curriculumItem);
            appointmentModel.setTutorUserItem(tutorUserItem);
            appointmentModel.setStudentUserItem(studentUserItem);

            return res.render('appointment_page', {
                'sessionModel': req.sessionModel,
                'appointmentId': inputAppointmentId,
                'appointmentModel': appointmentModel,
                'appointmentItem': result['appointmentItem'],
                'curriculumItem': result['curriculumItem'],
                'studentUserItem': result['studentUserItem'],
                'tutorUserItem': result['tutorUserItem'],
            });
        })

    })
}