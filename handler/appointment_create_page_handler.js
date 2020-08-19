
// DEPENDENCY
var async = require('async');
var curriculumService = require("../service/curriculum_service");
var curriculumTutorAvailabilityAPI = require('../api/curriculum_tutor_availability_api.js');

module.exports = function(req, res) {

    var inputCurriculumId = req.query.curriculumId;
    var inputYYYYMMDD = req.query.yyyymmdd;
    var inputHour = req.query.hour;

    var result = {
        'curriculumId': inputCurriculumId,
        'curriculumInfo': {},
        'tutorUserList': []
    };

    // TODO: check permission

    async.parallel([

        function fetchCurriculumInfo(done) {

            curriculumService.loadCurriculum({
                curriculum_id: inputCurriculumId
            }, function(err, output) {

                if (err) {
                    return done(err);
                }

                result['curriculumInfo'] = output['curriculum_obj'];
                return done();
            })
        },

        function fetchCurriculumTutorAvailability(done) {

            var apiInput = {
                'curriculumId': inputCurriculumId,
                'yyyymmdd': inputYYYYMMDD,
                'hour': inputHour
            }

            curriculumTutorAvailabilityAPI(apiInput, function(err, apiOutput) {

                if (err) {
                    return done(err);
                }

                var tutorUserList = apiOutput['tutorUserInfoList'];
                result['tutorUserList'] = tutorUserList;
                return done();
            })
        }

    ], function(err) {

        var appointmentTime = inputHour + ":00";

        return res.render('appointment_create_page', {
            'session_user': req.session_user,
            'curriculum_info': result['curriculumInfo'],
            'curriculum_id': inputCurriculumId,
            'yyyymmdd': inputYYYYMMDD,
            'hour': inputHour,
            'appointment_date': inputYYYYMMDD,
            'appointment_time': appointmentTime,
            'tutor_user_list': result['tutorUserList']
        });
    })
}

