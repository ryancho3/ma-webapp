
// DEPENDENCY
var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.user_id = req.query.user_id;

    // Set userId from session (if not passed in the query, assume viewing my profile)
    if (!input.user_id) {
        input.user_id = req.session_user.user_id;
    }

    userService.loadUser(input, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        res.render('user_page', {
            'session_user': req.session_user,
            'user_obj': output.user_obj,
        });
    });
}

