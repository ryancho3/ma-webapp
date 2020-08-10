
// DEPENDENCY
var userService = require('../service/user_service.js');
var sessionService = require('../service/session_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.type = req.body.type;
    input.email = req.body.email;
    input.password = req.body.password;
    input.name = req.body.name;
    input.profile = req.body.profile;

    userService.createUser(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

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

            return res.render('register_success_page', {
                'session_user': req.session_user,
                'user_obj': output.user_obj,
            });
        });
    });
}

