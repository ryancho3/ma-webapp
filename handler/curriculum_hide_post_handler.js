
// DEPENDENCY
var curriculumService = require('../service/curriculum_service.js');

module.exports = function(req, res) {

    // TODO: check permission

    var input = {};
    input.curriculumId = req.body.curriculum_id;

    curriculumService.hideCurriculum(input, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }


        return res.redirect('/curriculum-list');
    });
}
