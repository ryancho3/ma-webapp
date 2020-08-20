
// DEPENDENCY
var SessionModel = require('../model/session_model.js');
var userService = require('../service/user_service.js');
var sessionService = require('../service/session_service.js');

module.exports = function(req, res, next) {

    // Create SessionModel
    var sessionModel = new SessionModel();
    req.sessionModel = sessionModel;

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

        var sessionItem = output['sessionItem'];

        // Session obj not found
        if (!sessionItem) {
            return next();
        }

        // Set session item
        sessionModel.setSessionItem(sessionItem);

        var sessionUserId = sessionModel.getSessionUserId();

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

            // Set Session User Item
            var userItem = output.userItem;
            if (userItem) {
                sessionModel.setUserItem(userItem);
            }

            return next();
        })
    });
}