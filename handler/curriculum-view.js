
// DEPENDENCY
var curriculumService = require('../service/curriculum.js');

module.exports = function(req, res) {

    var input = {};
    input.curriculum_id = req.query.curriculum_id;

    curriculumService.loadCurriculum(input, function(err, output) {

        if (err) {
            res.render('500', {});
            return;
        }

        res.render('curriculum-view', {
            'curriculum_obj': output.curriculum_obj,
        });
    });
}
