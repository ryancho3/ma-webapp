module.exports = function(req, res) {

    res.render('locked_page', {
        'sessionModel': req.sessionModel,
    });
}