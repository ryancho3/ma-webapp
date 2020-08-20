
// DEPENDENCY
var sessionService = require('../service/session_service.js');
const userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;

    // Clear cookie first, even if there are errors in later part
    res.clearCookie('session_id');

    // Session not found => just show logout success
    if (sessionModel.isLoggedIn() === false) {

        return res.render('logout_success_page', {
        });
    }

    var sessionId = req.sessionModel.getSessionId();
    sessionService.deleteSession({
        'session_id': sessionId

    }, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            })
        }

        return res.render('logout_success_page', {
        });
    });
}



