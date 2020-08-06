var AWS = require('aws-sdk');
AWS.config.region = "us-east-1"; //process.env.REGION
var ddb = new AWS.DynamoDB();
var ddbTable = "mf-prod-curriculum";

module.exports = function(req, res) {

    var curriculum_id = req.query.curriculum_id;

    ddb.getItem({
        'TableName': ddbTable,
        'Key': {'curriculum_id': {'S': curriculum_id}}

    }, function(err, data) {

        if (err) {
            res.render('500', {});
            return;
        }

        var ddbItem = data.Item;
        var curriculum_obj = {
            'curriculum_id': ddbItem.curriculum_id['S'],
            'name': ddbItem.name['S'],
            'description': ddbItem.description['S'],
        };

        res.render('curriculum-view', {
            'curriculum_obj': curriculum_obj,
        });
    });

}
