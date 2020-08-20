
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var appointmentService = require('../service/appointment_service.js');
var appointmentLoadAPI = require('../api/appointment_load_api.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;
    var sessionUserId = sessionModel.getSessionUserId();
    var sessionUserType = sessionModel.getUserType();

    var todayDate = new Date();
    var lastWeekDate = new Date();
    lastWeekDate.setDate(todayDate.getDate() - 7);

    // Fetch appointments starting from a week ago
    var todayYYYYMMDD = stringUtil.parseYYYYMMDDStringFromDate(todayDate);
    var lastWeekYYYYMMDD = stringUtil.parseYYYYMMDDStringFromDate(lastWeekDate);

    if (sessionUserType === 'ADMIN') {
        
        loadUpcomingAppointments(todayYYYYMMDD, function(err, appointmentList) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            // Sort Appointments
            appointmentList.sort(function(a, b) {
                var yyyymmddhhA = a['appointmentItem']['yyyymmddhh'];
                var yyyymmddhhB = b['appointmentItem']['yyyymmddhh'];
                return yyyymmddhhA - yyyymmddhhB;
            });

            return res.render('appointment_list_page', {
                'sessionModel': sessionModel,
                'appointmentList': appointmentList
            });
        })

    } else if (sessionUserType === 'TUTOR') {

        loadTutorAppointments(sessionUserId, lastWeekYYYYMMDD, function(err, appointmentList) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            // Sort Appointments
            appointmentList.sort(function(a, b) {
                var yyyymmddhhA = a['appointmentItem']['yyyymmddhh'];
                var yyyymmddhhB = b['appointmentItem']['yyyymmddhh'];
                return yyyymmddhhA - yyyymmddhhB;
            });

            return res.render('appointment_list_page', {
                'sessionModel': sessionModel,
                'appointmentList': appointmentList
            });
        })

    } else {

        loadStudentAppointments(sessionUserId, lastWeekYYYYMMDD, function(err, appointmentList) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            // Sort Appointments
            appointmentList.sort(function(a, b) {
                var yyyymmddhhA = a['appointmentItem']['yyyymmddhh'];
                var yyyymmddhhB = b['appointmentItem']['yyyymmddhh'];
                return yyyymmddhhA - yyyymmddhhB;
            });

            return res.render('appointment_list_page', {
                'sessionModel': sessionModel,
                'appointmentList': appointmentList
            });
        })
    }
}

function loadUpcomingAppointments(startYYYYMMDD, callback) {
    
    appointmentService.scanAppointments({
        'startYYYYMMDD': startYYYYMMDD

    }, function(err, output) {

        if (err) {
            return callback(err);
        }

        var appointmentItemList = output['appointmentItemList'];

        //console.log(appointmentItemList);

        var inputAppointmentIdList = [];
        appointmentItemList.forEach(function(appointmentItem) {
            var appointmentId = appointmentItem['appointmentId'];
            inputAppointmentIdList.push(appointmentId);
        })

        //console.log(inputAppointmentIdList);

        var appointmentList = [];

        async.each(inputAppointmentIdList, function(appointmentId, callback) {

            appointmentLoadAPI({
                appointmentId: appointmentId
            }, function(err, output) {

                if (err) {
                    return callback(err);
                }

                var appointment = output['appointment'];
                appointmentList.push(appointment);

                return callback();
            })

        }, function(err) {

            if (err) {
                return callback(err);
            }

            return callback(null, appointmentList);
        })
    })
}

function loadTutorAppointments(tutorUserId, startYYYYMMDD, callback) {
    
    appointmentService.queryTutorAppointments({
        'tutorUserId': tutorUserId,
        'startYYYYMMDD': startYYYYMMDD

    }, function(err, output) {

        if (err) {
            return callback(err);
        }

        var appointmentItemList = output['appointmentItemList'];

        //console.log(appointmentItemList);

        var inputAppointmentIdList = [];
        appointmentItemList.forEach(function(appointmentItem) {
            var appointmentId = appointmentItem['appointmentId'];
            inputAppointmentIdList.push(appointmentId);
        })

        //console.log(inputAppointmentIdList);

        var appointmentList = [];

        async.each(inputAppointmentIdList, function(appointmentId, callback) {

            appointmentLoadAPI({
                appointmentId: appointmentId
            }, function(err, output) {

                if (err) {
                    return callback(err);
                }

                var appointment = output['appointment'];
                appointmentList.push(appointment);

                return callback();
            })

        }, function(err) {

            if (err) {
                return callback(err);
            }

            return callback(null, appointmentList);
        })
    })
}

function loadStudentAppointments(studentUserId, startYYYYMMDD, callback) {

    appointmentService.queryStudentAppointments({
        'studentUserId': studentUserId,
        'startYYYYMMDD': startYYYYMMDD

    }, function(err, output) {

        if (err) {
            return callback(err);
        }

        var appointmentItemList = output['appointmentItemList'];

        //console.log(appointmentItemList);

        var inputAppointmentIdList = [];
        appointmentItemList.forEach(function(appointmentItem) {
            var appointmentId = appointmentItem['appointmentId'];
            inputAppointmentIdList.push(appointmentId);
        })

        //console.log(inputAppointmentIdList);

        var appointmentList = [];

        async.each(inputAppointmentIdList, function(appointmentId, callback) {

            appointmentLoadAPI({
                appointmentId: appointmentId
            }, function(err, output) {

                if (err) {
                    return callback(err);
                }

                var appointment = output['appointment'];
                appointmentList.push(appointment);

                return callback();
            })

        }, function(err) {

            if (err) {
                return callback(err);
            }

            return callback(null, appointmentList);
        })
    })
}
