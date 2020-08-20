
// DEPENDENCY
var tutorService = require('../service/tutor_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;

    if (!sessionModel.isLoggedIn()) {
        return res.render('error_page', {
            err: new Error("no session user")
        });
    }

    var sessionUserId = sessionModel.getSessionUserId();
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



