
// DEPENDENCY
var sessionService = require('../service/session_service.js');
const userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    var userSession = req.user_session;

    // Clear cookie first, even if there are errors in later part
    res.clearCookie('session_id');

    // Session not found => just show logout success
    if (!userSession || userSession.session_id) {


        return res.render('logout_success_page', {
        });
    }

    sessionService.deleteSession({
        'session_id': userSession.session_id

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



