
// DEPENDENCY
var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;

    var input = {};
    input.user_id = req.query.user_id;

    // Set userId from session (if not passed in the query, assume viewing my profile)
    if (!input.user_id) {
        input.user_id = sessionModel.getSessionUserId();
    }

    userService.loadUser(input, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        res.render('user_page', {
            'sessionModel': req.sessionModel,
            'userItem': output.userItem,
        });
    });
}

