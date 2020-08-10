
// DEPENDENCY
var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.user_id = req.query.user_id;

    userService.loadUser(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        res.render('user_page', {
            'session_user': req.session_user,
            'user_obj': output.user_obj,
        });
    });
}

