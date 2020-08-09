
// DEPENDENCY
var userService = require('../service/user.js');

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
            res.render('500', {});
            return;
        }

        res.render('user-register-success', {
            'user_obj': output.user_obj,
        });
        return;
    });
}

