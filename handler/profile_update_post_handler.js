var async = require('async');
var SessionModel = require('../model/session_model.js');
var userService = require('../service/user_service.js');



// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.profile = req.body.profile;
    input.user_id = req.sessionModel.getSessionUserId();


    userService.updateProfile(input, function(err, output) {
        if (err) {
            res.render('error_page', {});
            return;
        }

        res.render('profile_update_success_page', {
            'sessionModel': req.sessionModel,
        });
    })
}
