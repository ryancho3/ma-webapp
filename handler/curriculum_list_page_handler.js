
// DEPENDENCY
var CurriculumModel = require('../model/curriculum_model.js');
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;

    if (sessionModel.isLoggedIn() === false) {
        // TODO: figure out the right way to do this 
        return res.redirect('/register');
    }

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

        // Parse Curriculum Models
        var curriculumModels = [];
        curriculumItems.forEach(function(curriculumItem) {
            var curriculumModel = new CurriculumModel(curriculumItem);
            curriculumModels.push(curriculumModel);
        })

        res.render('curriculum_list_page', {
            'sessionModel': req.sessionModel,
            'curriculumModels': curriculumModels,
            'curriculumItems': curriculumItems
        });
    });
}
