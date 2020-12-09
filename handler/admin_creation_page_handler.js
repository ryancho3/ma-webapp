// DEPENDENCY
var userService = require('../service/user_service.js');

// HANDLER
module.exports = function(req, res) {

    res.render('admin_creation_page', {
        'sessionModel': req.sessionModel,
    });
}
