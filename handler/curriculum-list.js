
// DEPENDENCY
var curriculumService = require('../service/curriculum.js');

// HANDLER
module.exports = function(req, res) {

    curriculumService.listCurriculum(function(err, output) {

        if (err) {
            res.render('500');
            return;
        }

        res.render('curriculum-list', {
            'curriculum_list': output.curriculum_list,
        });
    });
}
