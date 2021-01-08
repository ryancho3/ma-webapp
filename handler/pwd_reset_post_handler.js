var async = require('async');
var SessionModel = require('../model/session_model.js');
var userService = require('../service/user_service.js');



// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.password = req.body.password;
    input.repeatpassword = req.body.repeat_password;
    input.user_id = req.sessionModel.getSessionUserId();

    var userItem;

    userService.changePassword(input, function(err, output) {
        if (err) {
            res.render('error_page', {});
            return;
        }

        res.render('pwd_reset_success_page', {
            'sessionModel': req.sessionModel,
            'userItem': output.userItem,
        });
    })
}
