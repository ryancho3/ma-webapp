
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var tutorService = require('../service/tutor_service.js');
var appointmentService = require('../service/appointment_service.js');

function fetchTutorAvailability (input, callback) {

    var inputTutorUserId = input.tutorUserId;
    var inputStartYYYYMMDD = input.startYYYYMMDD;
    var inputEndYYYYMMDD = input.endYYYYMMDD;

    // TODO: fetch appointments and remove from availability hours

    var result = {
        'tutorUserId': inputTutorUserId,
        'dateToAvailableHourListMap': {},
        'appointmentItemList': []
    };

    async.parallel([

        function fetchTutorAvailability (done) {

            tutorService.queryAvailabilityForTutor({
                'tutorUserId': inputTutorUserId,
                'startYYYYMMDD': inputStartYYYYMMDD,
                'endYYYYMMDD': inputEndYYYYMMDD

            }, function (err, output) {

                if (err) {
                    return done(err);
                }

                var dateToAvailableHourListMap = output.dateToAvailableHourListMap;
                result['dateToAvailableHourListMap'] = dateToAvailableHourListMap;
                return done();
            });
        },

        function fetchTutorAppointments (done) {

            appointmentService.queryTutorAppointments({
                'tutorUserId': inputTutorUserId,
                'startYYYYMMDD': inputStartYYYYMMDD

            }, function(err, output) {

                if (err) {
                    return done(err);
                }

                var appointmentItemList = output['appointmentItemList'];
                result['appointmentItemList'] = appointmentItemList;
                return done();
            });
        }

    ], function(err) {

        if (err) {
            return callback(err);
        }

        // 1. Parse appointment yyyymmddhh list
        var appointmentYYYYMMDDHHList = [];
        var appointmentItemList = result['appointmentItemList'];
        appointmentItemList.forEach(function(appointmentItem) {
            var tmpYYYYMMDDHH = "" + appointmentItem['yyyymmddhh'];
            appointmentYYYYMMDDHHList.push(tmpYYYYMMDDHH);
        })

        // 2. Parse working hours
        var dateToAvailableHourListMap = result['dateToAvailableHourListMap'];

        // 3. Remove appointment hours from available hours
        var finalDateToAvailableHourListMap = {};
        Object.keys(dateToAvailableHourListMap).forEach(function(yyyymmdd) {

            // Final hour list
            var finalHourList = [];
            var availableHourList = dateToAvailableHourListMap[yyyymmdd];
            availableHourList.forEach(function(hour) {
                var yyyymmddhh = stringUtil.parseYYYYMMDDHHStringFromYYYYMMDDAndHour(yyyymmdd, hour);
                if (!appointmentYYYYMMDDHHList.includes(yyyymmddhh)) {
                    finalHourList.push(hour);
                }
            })

            finalDateToAvailableHourListMap[yyyymmdd] = finalHourList;
        });

        return callback(null, {
            'tutorUserId': inputTutorUserId,
            'dateToAvailableHourListMap': finalDateToAvailableHourListMap
        });
    })
}

// EXPORTS
module.exports.fetchTutorAvailability = fetchTutorAvailability;
