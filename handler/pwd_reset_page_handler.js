var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    res.render('pwd_reset_page', {
        'sessionModel': req.sessionModel,
    });
}