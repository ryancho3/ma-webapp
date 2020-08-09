
// DEPENDENCY
var sessionService = require('../service/session.js');
const userService = require('../service/user.js');

// HANDLER
module.exports = function(req, res) {

    var userSession = req.user_session;

    // Session not found => just show logout success
    if (!userSession || userSession.session_id) {
        return res.render('user-logout-success', {
        });
    }

    sessionService.deleteSession({
        'session_id': userSession.session_id

    }, function(err, output) {

        if (err) {
            return res.render('500', {
                err: err
            })
        }

        return res.render('user-logout-success', {
        });
    });
}



