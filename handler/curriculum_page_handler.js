
// DEPENDENCY
var async = require('async');
var stringUtil = require('../util/string_util.js');
var curriculumService = require('../service/curriculum_service.js');
var curriculumAvailabilityAPI = require('../api/curriculum_availability_api.js');

// HANDLER
module.exports = function(req, res) {

    var input = {};
    input.curriculum_id = req.query.curriculum_id;

    var todayDate = new Date();
    var endDate = new Date();
    endDate.setDate(todayDate.getDate() + 7);

    var todayYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(todayDate);
    var endYYYYMMDD = stringUtil.parseYYYYMMDDIntFromDate(endDate);

    var result = {
        'curriculumId': input.curriculumId,
        'curriculumInfo': {},
        'curriculumAvailability': {}
    };

    async.parallel([

        function fetchCurriculum(done) {

            curriculumService.loadCurriculum(input, function(err, output) {

                if (err) {
                    return done(err);
                }

                var curriculumInfo = output.curriculum_obj;
                result['curriculumInfo'] = curriculumInfo;

                return done();
            });
        },

        function fetchCurriculumAvailability(done) {

            var apiInput = {
                'curriculumId': input.curriculum_id,
                'startYYYYMMDD': todayYYYYMMDD,
                'endYYYYMMDD': endYYYYMMDD
            }

            curriculumAvailabilityAPI(apiInput, function(err, apiOutput) {

                if (err) {
                    return done(err);
                }

                //console.log(apiOutput);

                result['curriculumAvailability'] = apiOutput['curriculumAvailability'];
                return done();
            });
        }

    ], function(err) {

        if (err) {
            res.render('error_page', {});
            return;
        }

        res.render('curriculum_page', {
            'sessionModel': req.sessionModel,
            'curriculumId': input.curriculum_id,
            'curriculumInfo': result['curriculumInfo'],
            'curriculumAvailability': result['curriculumAvailability']
        });
    })
}
