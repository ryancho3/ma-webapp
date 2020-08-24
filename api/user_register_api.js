// DEPENDENCY
var async = require('async');
var availabilityUtil = require('../util/availability_util.js');
var tutorService = require('../service/tutor_service.js');
var userService = require('../service/user_service.js');


module.exports = function(apiInput, apiCallback) {

    var result = {
        'userItem' : null
    }
    var password = apiInput.password;
    var repeatedPassword = apiInput.repeat;
    async.waterfall([

        function checkDuplicateEmail(next) {
            
            userService.loadUserByEmail(apiInput, function(err, output) {
                if (err) {
                    return apiCallback(err);
                }
                var userItem = output['userItem'];
                console.log(userItem);
                if (userItem) {
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
            
            userService.createUser(apiInput, function(err, output) {
                if (err) {
                    return apiCallback(err);
                }
                result['userCreated'] = true;
                result['userItem'] = output.userItem;
               
                return next();
                
            });
        }
    ], function(err) {
        if (err) {
            return apiCallback(err);
        }

        return apiCallback(null, result);
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
   /* 
    // Duplicate Email Check
    return apiCallback(null, {
        'userCreated' : true,
        'userItem' : output.userItem,
    })

    console.log('Check');
    //TODO: Password Requirement Check

    userService.createUser(apiapiInput, function(err, output) {
        if (err) {
            return apiapiCallback(err);
        }

        return apiapiCallback(null, {
            'userCreated' : true,
            'userItem' : output.userItem,
        })

        
    });
*/

}