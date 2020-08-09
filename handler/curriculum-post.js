
// DEPENDENCY
var curriculumService = require('../service/curriculum.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.name = req.body.name;
    input.description = req.body.description;

    curriculumService.createCurriculum(input, function(err, output) {

        if (err) {
            res.render('500', {});
            return;
        }

        res.render('curriculum-post', {
            'curriculum_obj': output.curriculum_obj,
        });
        return;
    });
}
