
// DEPENDENCY
var async = require('async');
var availabilityUtil = require('../util/availability_util.js');
var tutorService = require('../service/tutor_service.js');
var curriculumService = require('../service/curriculum_service.js');

module.exports = function(input, callback) { // callback(err, output)

//module.exports = function(req, res) {

    var inputCurriculumId = input.curriculumId;
    var inputStartYYYYMMDD = input.startYYYYMMDD;
    var inputEndYYYYMMDD = input.endYYYYMMDD;

    var result = {
        'curriculumId': inputCurriculumId,
        'startYYYYMMDD': inputStartYYYYMMDD,
        'endYYYYMMDD': inputEndYYYYMMDD,
        'tutorUserIdList': [],
        'availableDateToHourListMap': {} // {yyyymmdd1: [8,9,10,18,17], yyyymmdd2: [8,9,18,19], ...}
    }

    async.waterfall([

        function fetchAvailableTutors(next) {

            fetchAvailableTutorUserIds({
                'curriculumId': inputCurriculumId

            }, function(err, output) {

                if (err) {
                    return callback(err);
                }

                // Populate result
                result['tutorUserIdList'] = output['tutorUserIdList'];
                return next();
            });
        },

        function fetchAvailability(next) {

            var tutorUserIdList = result['tutorUserIdList'];

            fetchAvailabilityForTutorUserIds({
                'tutorUserIdList': tutorUserIdList,
                'startYYYYMMDD': inputStartYYYYMMDD,
                'endYYYYMMDD': inputEndYYYYMMDD,

            }, function(err, output) {

                if (err) {
                    return next(err);
                }

                // Populate result
                result['availableDateToHourListMap'] = output['dateToHourListMap']
                return next(err);
            });
        }

    ], function(err) {

        if (err) {
            return callback(err);
        }

        return callback(null, {
            'curriculumAvailability': result['availableDateToHourListMap']
        });
    })
}

function fetchAvailabilityForTutorUserIds (input, callback) {

    var inputTutorUserIdList = input.tutorUserIdList;
    var inputStartYYYYMMDD = input.startYYYYMMDD;
    var inputEndYYYYMMDD = input.endYYYYMMDD;

    var dateToAvailableHourListMaps = [];

    async.each(inputTutorUserIdList, function(tutorUserId, callback) {

        fetchTutorAvailability({
            'tutorUserId': tutorUserId,
            'startYYYYMMDD': inputStartYYYYMMDD,
            'endYYYYMMDD': inputEndYYYYMMDD

        }, function(err, output) {

            if (err) {
                return callback();
            }

            var dateToAvailableHourListMap = output['dateToAvailableHourListMap'];
            dateToAvailableHourListMaps.push(dateToAvailableHourListMap);
            return callback();
        })

    }, function(err) {

        var mergedDateToHourListMap = availabilityUtil.mergeDateToHourListMaps(dateToAvailableHourListMaps);
        return callback(null, {
            'dateToHourListMap': mergedDateToHourListMap
        });
    })
}

// Fetches list of tutorUserIds that available to teach input curriculumId
// - input: {curriculumId: XXX}
// - output: {tutorUserIdList: [XXX]}
function fetchAvailableTutorUserIds (input, callback) {

    var inputCurriculumId = input.curriculumId;

    tutorService.listTutorUserIdsForCurriculum({
        'curriculumId': inputCurriculumId

    }, function (err, output) {

        if (err) {
            return callback(err);
        }

        var tutorUserIdList = output['tutorUserIdList'];
        return callback(null, {
            'tutorUserIdList': tutorUserIdList
        });
    })
}

function fetchTutorAvailability (input, callback) {

    var inputTutorUserId = input.tutorUserId;
    var inputStartYYYYMMDD = input.startYYYYMMDD;
    var inputEndYYYYMMDD = input.endYYYYMMDD;

    // TODO: fetch appointments and remove from availability hours

    tutorService.queryAvailabilityForTutor({
        'tutorUserId': inputTutorUserId,
        'startYYYYMMDD': inputStartYYYYMMDD,
        'endYYYYMMDD': inputEndYYYYMMDD

    }, function (err, output) {

        if (err) {
            return callback(err);
        }

        var dateToAvailableHourListMap = output.dateToAvailableHourListMap;

        return callback(null, {
            'tutorUserId': inputTutorUserId,
            'dateToAvailableHourListMap': dateToAvailableHourListMap
        });
    });
}