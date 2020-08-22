// DEPENDENCY
var async = require('async');
var availabilityUtil = require('../util/availability_util.js');
var tutorService = require('../service/tutor_service.js');
var helper = require('./helper.js');
var userService = require('../service/user_service.js');


module.exports = function(input, callback) {

    var result = {
        'userItem' : null
    }
    var password = input.password;
    var repeatedPassword = input.repeat;
    async.waterfall([

        function checkDuplicateEmail(next) {
            
            userService.loadUserByEmail(input, function(err, output) {
                if (err) {
                    return callback(err);
                }
        
                if (output['noItem'] == false) {
                    return next(new Error('Duplicate Email'));
                }
                return next();
            });
        },

        function checkPassword(next) {
            
            if (password.length == 0) {
                return next(new Error('Enter a password'));
            }
            if (password.length < 8) {
                return next(new Error('Password must be at least 8 characters'));
            }
            return next();
        },

        function checkRepeatedPassword(next) {
            if (password.valueOf() != repeatedPassword.valueOf()) {
                return next(new Error('Passwords do not match'));
            }
            return next();
        },

        function generateUser(next) {
            
            userService.createUser(input, function(err, output) {
                if (err) {
                    return callback(err);
                }
                result['userCreated'] = true;
                result['userItem'] = output.userItem;
               
                return next();
                
            });
        }
    ], function(err) {
        if (err) {
            return callback(err);
        }

        return callback(null, result);
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
   /* 
    // Duplicate Email Check
    return callback(null, {
        'userCreated' : true,
        'userItem' : output.userItem,
    })

    console.log('Check');
    //TODO: Password Requirement Check

    userService.createUser(apiInput, function(err, output) {
        if (err) {
            return apiCallback(err);
        }

        return apiCallback(null, {
            'userCreated' : true,
            'userItem' : output.userItem,
        })

        
    });
*/

}