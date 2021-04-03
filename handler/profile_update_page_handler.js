var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {
    var sessionModel = req.sessionModel;

    var input = {};
    input.user_id = req.sessionModel.getSessionUserId();
    userService.loadUser(input, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }
        console.log(output);
        res.render('profile_update_page', {
            'sessionModel': req.sessionModel,
            'userItem': output.userItem,
        });
    });
}