
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
    var inputCurriculumId = req.body.curriculum_id;

    tutorService.removeCurriculumForTutor({
        'tutorUserId': sessionUserId,
        'curriculumId': inputCurriculumId

    }, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }
        
        return res.redirect('/tutor-curriculum-list');
    })
}



