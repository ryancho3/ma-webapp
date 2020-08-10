
// DEPENDENCY
var stringUtil = require('../util/string_util.js');
var userService = require('../service/user_service.js');
var sessionService = require('../service/session_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.email = req.body.email;
    input.password = req.body.password;

    var input_password_sha256 = stringUtil.parseSha256String(input.password);

    userService.loadUserByEmail(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        if (!output.user_obj) {
            res.render('login_failure_page', {
                'login_failure_reason': "NOT_FOUND"
            });
            return;
        }

        var db_password_sha256 = output.user_obj['password_sha256'];

        if (db_password_sha256 != input_password_sha256) {
            res.render('login_failure_page', {
                'login_failure_reason': "WRONG_PASSWORD"
            });
            return;
        }

        // TODO: check password match
        //console.log(output.user_obj);

        var user_obj = output.user_obj;

        sessionService.createSession({
            'user_id': user_obj.user_id,

        }, function(err, output) {

            if (err) {
                res.render('error_page', {
                    err: err
                })
                return;
            }

            var session_obj = output.session_obj;

            if (session_obj) {
                var session_id = session_obj.session_id;
                res.cookie('session_id', session_id);
                req.session_user = {
                    'session_id': session_id,
                    'user_id': user_obj.user_id,
                    'user_type': user_obj.user_type,
                    'name': user_obj.name,
                    'email': user_obj.email_lowercase,
                }
            }

            res.render('login_success_page', {
                'session_user': req.session_user,
                'session_obj': session_obj
            });
            return;
        });
    });
}


