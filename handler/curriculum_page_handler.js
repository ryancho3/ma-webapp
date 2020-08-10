
// DEPENDENCY
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.curriculum_id = req.query.curriculum_id;

    curriculumService.loadCurriculum(input, function(err, output) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        res.render('curriculum_page', {
            'session_user': req.session_user,
            'curriculum_obj': output.curriculum_obj,
        });
    });
}
