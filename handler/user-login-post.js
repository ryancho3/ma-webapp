
// DEPENDENCY
var crypto = require('crypto');
var userService = require('../service/user.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.email = req.body.email;
    input.password = req.body.password;

    var input_password_sha256 = crypto.createHash('sha256').update(input.password).digest('base64');

    userService.loadUserByEmail(input, function(err, output) {

        if (err) {
            res.render('500', {});
            return;
        }

        if (!output.user_obj) {
            res.render('user-login-failure', {
                'login_failure_reason': "NOT_FOUND"
            });
            return;
        }

        var db_password_sha256 = output.user_obj['password_sha256'];

        if (db_password_sha256 != input_password_sha256) {
            res.render('user-login-failure', {
                'login_failure_reason': "WRONG_PASSWORD"
            });
            return;
        }

        // TODO: check password match
        console.log(output.user_obj);

        res.render('user-login-success', {
            'user_obj': output.user_obj,
        });
        return;
    });
}


