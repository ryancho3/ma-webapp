
module.exports = function(req, res) {

    res.render('home_page', {
        'session_user': req.session_user,
    });
}
