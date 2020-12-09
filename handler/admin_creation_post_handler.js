
// DEPENDENCY
var async = require('async');
var SessionModel = require('../model/session_model.js');
var userService = require('../service/user_service.js');
var sessionService = require('../service/session_service.js');
var userRegisterAPI = require('../api/user_register_api.js')

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.type = "ADMIN";
    input.email = req.body.email;
    input.password = req.body.password;
    input.repeat = req.body.repeat_password;
    input.name = req.body.name;
    input.profile = req.body.profile;

    var userItem;

    async.waterfall([
        
        function createUser(next) {
            userRegisterAPI(input, function(err, output) {
                if (err) {
                    return next(err);
                }
        
                /*
                if (output.userCreated === false) {
                    res.render('error_page', {
                        err: output.abortReason
                    })
                    return;
                }
                */
                userItem = output.userItem;
                if (!userItem) {
                    next(new Error("userItem not set"));
                }
                
                return next();
            });
        },
        
        function createSession(next) {
            sessionService.createSession({
                'user_id': userItem.user_id,
    
            }, function(err, output) {
                if (err) {
                    return next(err);
                }
    
                var sessionItem = output.sessionItem;
    
                if (sessionItem) {
    
                    // Set Cookie
                    var sessionId = sessionItem['sessionId'];
                    res.cookie('session_id', sessionId);
    
                    // Set SessionModel
                    req.sessionModel = new SessionModel();
                    req.sessionModel.setSessionItem(sessionItem);
                    req.sessionModel.setUserItem(userItem);
                }
    
    
                res.render('register_success_page', {
                    'sessionModel': req.sessionModel,
                    'userItem': output.userItem,
                });
                return next();
            });
        }
     ], function(err) {
            if (err) {
                res.render('error_page', {
                    err: err});
            }

        });
    /*userService.createUser(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        var userItem = output.userItem;

        sessionService.createSession({
            'user_id': userItem.user_id,

        }, function(err, output) {

            if (err) {
                res.render('error_page', {
                    err: err
                })
                return;
            }

            var sessionItem = output.sessionItem;

            if (sessionItem) {

                // Set Cookie
                var sessionId = sessionItem['sessionId'];
                res.cookie('session_id', sessionId);

                // Set SessionModel
                req.sessionModel = new SessionModel();
                req.sessionModel.setSessionItem(sessionItem);
                req.sessionModel.setUserItem(userItem);
            }


            return res.render('register_success_page', {
                'sessionModel': req.sessionModel,
                'userItem': output.userItem,
            });
        });
    }); */

}
