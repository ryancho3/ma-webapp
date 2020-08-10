
// DEPENDENCY
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    curriculumService.listCurriculum(function(err, output) {

        if (err) {
            res.render('error_page');
            return;
        }

        res.render('curriculum_list_page', {
            'session_user': req.session_user,
            'curriculum_list': output.curriculum_list,
        });
    });
}
