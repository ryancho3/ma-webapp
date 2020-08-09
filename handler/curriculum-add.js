
module.exports = function(req, res) {

    // TODO: check permission

    res.render('curriculum-add', {
        'session_user': req.session_user,
    });
}
