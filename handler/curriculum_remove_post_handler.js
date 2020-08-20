
// DEPENDENCY
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    // TODO: check permission

    var input = {};
    input['curriculumId'] = req.body.curriculum_id;

    curriculumService.removeCurriculum(input, function(err, output) {

        if (err) {
            return res.render('error_page', {});
        }

        return res.redirect('/curriculum-list');
    });
}
