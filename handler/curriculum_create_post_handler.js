
// DEPENDENCY
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.name = req.body.name;
    input.description = req.body.description;

    curriculumService.createCurriculum(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        res.render('curriculum_create_success_page', {
            'sessionModel': req.sessionModel,
            'curriculum_obj': output.curriculum_obj,
        });
        return;
    });
}
