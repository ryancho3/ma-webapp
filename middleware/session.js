
// DEPENDENCY
var userService = require('../service/user_service.js');
var sessionService = require('../service/session_service.js');

module.exports = function(req, res, next) {

    var cookies = req.cookies;

    // No cookies found
    if (!cookies) {
        return next();
    }

    var session_id = cookies['session_id'];

    // Cookie does not have sesion_id
    if (!session_id) {
        return next();
    }

    sessionService.loadSession({
        'session_id': session_id

    }, function(err, output) {

        // Error loading session => ignore and proceed?
        if (err) {
            return next();
        }

        // Session obj not found
        if (!output.session_obj) {
            return next();
        }

        var sessionUserId = output.session_obj.user_id;

        // Session user id not found
        if (!sessionUserId) {
            return next();
        }

        userService.loadUser({
            'user_id': sessionUserId
        }, function(err, output) {

            if (err) {
                return next();
            }

            var user_obj = output.user_obj;

            // Set session obj in request
            if (user_obj) {
                req.session_user = {
                    'session_id': session_id,
                    'user_id': user_obj.user_id,
                    'user_type': user_obj.user_type,
                    'name': user_obj.name,
                    'email': user_obj.email_lowercase,
                }
                //console.log("Middleware Loaded Session User: " + JSON.stringify(req.session_user));
            }

            return next();
        })
    });
}