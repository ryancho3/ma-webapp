
// DEPENDENCY
var tutorService = require('../service/tutor_service.js');
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionModel = req.sessionModel;

    if (!sessionModel.isLoggedIn()) {
        return res.render('error_page', {
            err: new Error("no session user")
        });
    }

    var sessionUserId = sessionModel.getSessionUserId();

    tutorService.listCurriculumIdsForUser({
        'tutorUserId': sessionUserId
    }, function(err, output) {

        if (err) {
            return res.render('error_page', {
                err: err
            });
        }

        var tutorCurriculumIdList = output.curriculumIdList;

        curriculumService.listCurriculum(function(err, output) {

            if (err) {
                return res.render('error_page', {
                    err: err
                });
            }

            var curriculumObjList = output['curriculumItems'];

            var includeCurriculumIdMap = {};
            tutorCurriculumIdList.forEach(function (curriculumId) {
                includeCurriculumIdMap[curriculumId] = true;
            });

            // Parse curriculum object map
            var includeCurriculumObjList = [];
            var excludeCurriculumObjList = [];
            curriculumObjList.forEach(function(curriculumObj) {
                var curriculumId = curriculumObj.curriculum_id;
                if (includeCurriculumIdMap[curriculumId] === true) {
                    includeCurriculumObjList.push(curriculumObj);
                } else {
                    excludeCurriculumObjList.push(curriculumObj);
                }
            });

            // Sort Include Curriculum Items
            includeCurriculumObjList.sort(function(a, b) {
                var nameA = a['name'];
                var nameB = b['name'];
                return nameA.localeCompare(nameB);
            })

            // Sort Exclude Curriculum Items
            excludeCurriculumObjList.sort(function(a, b) {
                var nameA = a['name'];
                var nameB = b['name'];
                return nameA.localeCompare(nameB);
            })

            return res.render('tutor_curriculum_list_page', {
                'sessionModel': req.sessionModel,
                'includeCurriculumObjList': includeCurriculumObjList,
                'excludeCurriculumObjList': excludeCurriculumObjList
            });
        });
    })
}

