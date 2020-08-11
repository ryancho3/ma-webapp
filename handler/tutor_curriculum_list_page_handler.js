
// DEPENDENCY
var tutorService = require('../service/tutor_service.js');
var curriculumService = require('../service/curriculum_service.js');

// HANDLER
module.exports = function(req, res) {

    var sessionUser = req.session_user;
    if (!sessionUser) {
        return res.render('error_page', {
            err: new Error("no session user")
        });
    }

    var sessionUserId = sessionUser.user_id

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

            var curriculumObjList = output.curriculum_list;

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

            return res.render('tutor_curriculum_list_page', {
                'session_user': req.session_user,
                'includeCurriculumObjList': includeCurriculumObjList,
                'excludeCurriculumObjList': excludeCurriculumObjList
            });
        });
    })
}

