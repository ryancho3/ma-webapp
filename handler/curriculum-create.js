
module.exports = function(req, res) {

    res.render('curriculum_create', {
        static_path: 'static',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
}
