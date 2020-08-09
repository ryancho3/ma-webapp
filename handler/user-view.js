
// DEPENDENCY
var userService = require('../service/user.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.user_id = req.query.user_id;

    userService.loadUser(input, function(err, output) {

        if (err) {
            res.render('500', {});
            return;
        }

        res.render('user-view', {
            'session_user': req.session_user,
            'user_obj': output.user_obj,
        });
    });
}

