
// DEPENDENCY
var SessionModel = require('../model/session_model.js');
var stringUtil = require('../util/string_util.js');
var userService = require('../service/user_service.js');
var sessionService = require('../service/session_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.email = req.body.email;
    input.password = req.body.password;

    //
    /*
    {
        "email": "XXX@XXX.com",
        "password": DDD
    }
    */

    var input_password_sha256 = stringUtil.parseSha256String(input.password);

    userService.loadUserByEmail(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        if (!output.userItem) {
            res.render('login_failure_page', {
                'login_failure_reason': "NOT_FOUND"
            });
            return;
        }

        var db_password_sha256 = output.userItem['password_sha256'];

        if (db_password_sha256 != input_password_sha256) {
            res.render('login_failure_page', {
                'login_failure_reason': "WRONG_PASSWORD"
            });
            return;
        }

        // TODO: check password match
        //console.log(output.userItem);

        var userItem = output.userItem;

        sessionService.createSession({
            'user_id': userItem.user_id,

        }, function(err, output) {

            if (err) {
                res.render('error_page', {
                    err: err
                })
                return;
            }

            var sessionItem = output.sessionItem;

            if (sessionItem) {

                // Cookie
                var sessionId = sessionItem['sessionId'];
                res.cookie('session_id', sessionId);

                // SessionModel
                req.sessionModel = new SessionModel();
                req.sessionModel.setSessionItem(sessionItem);
                req.sessionModel.setUserItem(userItem);
            }

            res.render('login_success_page', {
                'sessionModel': req.sessionModel
            });
            return;
        });
    });
}


