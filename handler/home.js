var cookieparser = require('cookie-parser')

module.exports = function(req, res) {

    res.render('index', {
        'session_user': req.session_user,
    });
}
