
module.exports = function(req, res) {

    // TODO: check permission

    res.render('curriculum_create_page', {
        'session_user': req.session_user,
    });
}
