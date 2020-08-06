var AWS = require('aws-sdk');
AWS.config.region = "us-east-1"; //process.env.REGION
var ddb = new AWS.DynamoDB();
var ddbTable = "mf-prod-curriculum";

module.exports = function(req, res) {

    ddb.scan({
        'TableName': ddbTable,
    }, function(err, data) {

        if (err) {
            return;
        }

        var curriculum_list = [];

        data.Items.forEach(function(ddbItem){

            var curriculum_obj = {
                'curriculum_id': ddbItem.curriculum_id['S'],
                'name': ddbItem.name['S'],
                'description': ddbItem.description['S'],
            };

            curriculum_list.push(curriculum_obj);
        });

        res.render('curriculum-list', {
            'curriculum_list': curriculum_list,
        });
    });

}
