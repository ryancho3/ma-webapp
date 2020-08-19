
// DEPENDENCY
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    curriculumService.listCurriculum(function(err, output) {

        if (err) {
            res.render('error_page');
            return;
        }

        var curriculumItems = output['curriculumItems'];

        // Sort Curriculum Items
        curriculumItems.sort(function(a, b) {
            var nameA = a['name'];
            var nameB = b['name'];
            return nameA.localeCompare(nameB);
        })

        res.render('curriculum_list_page', {
            'session_user': req.session_user,
            'curriculumItems': curriculumItems
        });
    });
}
