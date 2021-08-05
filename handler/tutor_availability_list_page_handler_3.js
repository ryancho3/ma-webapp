
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var dateUtil = require('../util/date_util.js');
var tutorService = require('../service/tutor_service.js');
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;

    if (!sessionModel.isLoggedIn()) {
        return res.render('error_page', {
            err: new Error("no session user")
        });
    }

    var todayDate = new Date();
   
    var weekStartDate = dateUtil.getWeekStartDate(todayDate.getDate() + 14);
    var weekEndDate = dateUtil.getWeekEndDate(todayDate.getDate() + 14);
    console.log(weekStartDate);
    var todayYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(todayDate);
    var weekStartYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(weekStartDate);
    var weekEndYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(weekEndDate);
    var weekdaysYYYYMMDD = [];
    var displayYYYYMMDD = [];
    for (var i = weekStartYYYYMMDD; i<weekStartYYYYMMDD+7; i++) {
        weekdaysYYYYMMDD.push(dateUtil.verifyYYYYMMDD(i));
    }

    for (var i = 0; i<weekdaysYYYYMMDD.length; i++) {
        displayYYYYMMDD.push(stringUtil.parseDisplayStringFromYYYYMMDD(weekdaysYYYYMMDD[i]));
    }

    console.log(displayYYYYMMDD);

    var sessionUserId = sessionModel.getSessionUserId();
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
            'sessionModel': req.sessionModel,
            'todayYYYYMMDD': todayYYYYMMDD,
            'weekStartYYYYMMDD': weekStartYYYYMMDD,
            'weekEndYYYYMMDD': weekEndYYYYMMDD,
            'weekdaysYYYYMMDD': weekdaysYYYYMMDD,
            'displayYYYYMMDD' : displayYYYYMMDD,
            'dateToAvailableHourListMap': dateToAvailableHourListMap
            //'tutor_availability': result.dateToAvailabilityList
        });
    });
}


