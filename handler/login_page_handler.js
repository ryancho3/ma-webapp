
// DEPENDENCY
var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    res.render('login_form_page', {
        'sessionModel': req.sessionModel,
    });
}
