
// DEPENDENCY
var async = require('async');
var tutorService = require('../service/tutor_service.js');
var userService = require('../service/user_service.js');

module.exports = function(apiInput, apiCallback) {

    var inputCurriculumId = apiInput['curriculumId'];
    var inputYYYYMMDD = apiInput['yyyymmdd'];
    var inputHour = apiInput['hour'];

    var result = {};

    async.waterfall([

        function fetchAvailableTutors(next) {

            fetchAvailableTutorUserIds({
                'curriculumId': inputCurriculumId

            }, function(err, output) {

                if (err) {
                    return next(err);
                }

                // Populate result
                result['tutorUserIdList'] = output['tutorUserIdList'];
                return next();
            });
        },

        function fetchAvailableTutorUserIds(next) {

            fetchAvailabilityForTutorUserIds ({
                'tutorUserIdList': result['tutorUserIdList'],
                'yyyymmdd': inputYYYYMMDD,
                'hour': inputHour

            }, function(err, output) {

                if (err) {
                    return next(err);
                }

                result['tutorUserIdList'] = output['tutorUserIdList'];
                return next();
            });
        },

        function fetchTutorUserInfo(next) {

            var userIds = result['tutorUserIdList'];

            userService.loadUserInBatch({
                'userIdList': userIds
            }, function(err, output) {

                if (err) {
                    return next(err);
                }

                result['tutorUserInfoList'] = output['userObjList'];
                return next();
            })
        }

    ], function(err) {

        if (err) {
            return apiCallback(err);
        }

        return apiCallback(null, result);
    });
}

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

function fetchAvailabilityForTutorUserIds (input, callback) {

    var inputTutorUserIdList = input.tutorUserIdList;
    var inputYYYYMMDD = input.yyyymmdd;
    var inputHour = input.hour;
    inputHour = parseInt(inputHour);

    var outputTutorUserIds = [];

    async.each(inputTutorUserIdList, function(tutorUserId, callback) {

        fetchTutorAvailability({
            'tutorUserId': tutorUserId,
            'startYYYYMMDD': inputYYYYMMDD,
            'endYYYYMMDD': inputYYYYMMDD

        }, function(err, output) {

            if (err) {
                return callback();
            }

            var dateToAvailableHourListMap = output['dateToAvailableHourListMap'];
            var hourList = dateToAvailableHourListMap[inputYYYYMMDD];

            if (hourList && hourList.includes(inputHour)) {
                outputTutorUserIds.push(tutorUserId)
            }

            return callback();
        })

    }, function(err) {

        if (err) {
            return callback(err);
        }

        return callback(null, {
            'tutorUserIdList': outputTutorUserIds
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
