
// DEPENDENCY
var tutorService = require('../service/tutor_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionUser = req.session_user;
    if (!sessionUser) {
        return res.render('error_page', {
            err: new Error("no session user")
        });
    }

    var sessionUserId = sessionUser.user_id
    var inputYYYYMMDD = req.body.yyyymmdd;

    // input hours
    var inputHours = [];
    if (typeof req.body.hour == "string") { // single value selected
        var hourNumber = parseInt(req.body.hour);
        inputHours = [hourNumber];

    } else if (Array.isArray(req.body.hour)) { // multiple value selected
        req.body.hour.forEach(function(hourString) {
            var hourNumber = parseInt(hourString);
            inputHours.push(hourNumber);
        })
    }

    tutorService.updateAvailabilityForTutor({
        'tutorUserId': sessionUserId,
        'yyyymmdd': inputYYYYMMDD,
        'hours': inputHours

    }, function(err) {

        console.log(err);

        return res.redirect('/tutor-availability-list');
    })
}


