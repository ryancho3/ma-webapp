// DEPENDENCY
var async = require('async');
var availabilityUtil = require('../util/availability_util.js');
var tutorService = require('../service/tutor_service.js');
var userService = require('../service/user_service.js');


module.exports = function(apiInput, apiCallback) {

    var result = {
        'userItem' : null,
        'userCreated' : false,
        'inputErrorCode' : null
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
                if (userItem) {
                    result['inputErrorCode'] = 'ERR_DUPLICATE_EMAIL';
                    return next(new Error('Duplicate Email'));
                }
                return next();
            });
        },

        function checkPassword(next) {
            
            if (password.length == 0) {
                result['inputErrorCode'] = 'ERR_NO_PASSWORD_ENTERED';
                return next(new Error('Enter a password'));
            }
            if (password.length < 8) {
                result['inputErrorCode'] = 'ERR_PASSWORD_LENGTH';
                return next(new Error('Password must be at least 8 characters'));
            }
            return next();
        },

        function checkRepeatedPassword(next) {
            if (password.valueOf() != repeatedPassword.valueOf()) {
                result['inputErrorCode'] = 'ERR_PASSWORD_REPEAT';
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
            return apiCallback(err, result);
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