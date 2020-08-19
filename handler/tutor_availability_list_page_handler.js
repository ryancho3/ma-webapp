
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var tutorService = require('../service/tutor_service.js');
var curriculumService = require('../service/curriculum_service.js');
const session = require('../middleware/session.js');

// HANDLER
module.exports = function(req, res) {

    var sessionUser = req.session_user;
    if (!sessionUser) {
        return res.render('error_page', {
            err: new Error("no session user")
        });
    }

    var todayDate = new Date();
    var weekStartDate = new Date();
    var weekEndDate = new Date();

    weekStartDate.setDate(todayDate.getDate() - todayDate.getDay());
    weekEndDate.setDate(todayDate.getDate() - todayDate.getDay() + 7);

    var todayYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(todayDate);
    var weekStartYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(weekStartDate);
    var weekEndYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(weekEndDate);

    var sessionUserId = sessionUser.user_id
    var inputStartYYYYMMDD = weekStartYYYYMMDD;
    var inputEndYYYYMMDD = weekEndYYYYMMDD;

    async.waterfall([

        function (next) {

            tutorService.queryAvailabilityForTutor({
                'tutorUserId': sessionUserId,
                'startYYYYMMDD': inputStartYYYYMMDD,
                'endYYYYMMDD': inputEndYYYYMMDD
            }, next);
        }

    ], function(err, result) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        // {yyyymmdd1: [h1,h2,h3], yyyymmdd2: [h4,h5]}
        var dateToAvailableHourListMap = result.dateToAvailableHourListMap;

        return res.render('tutor_availability_list_page', {
            'session_user': req.session_user,
            'todayYYYYMMDD': todayYYYYMMDD,
            'weekStartYYYYMMDD': weekStartYYYYMMDD,
            'weekEndYYYYMMDD': weekEndYYYYMMDD,
            'dateToAvailableHourListMap': dateToAvailableHourListMap
            //'tutor_availability': result.dateToAvailabilityList
        });
    });
}

