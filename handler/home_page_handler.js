
module.exports = function(req, res) {

    res.render('home_page', {
        'sessionModel': req.sessionModel,
    });
}
