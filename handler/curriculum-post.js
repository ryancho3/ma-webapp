const { v4: uuidv4 } = require('uuid');

var AWS = require('aws-sdk');
AWS.config.region = "us-east-1"; //process.env.REGION
var ddb = new AWS.DynamoDB();
var ddbTable = "mf-prod-curriculum";

module.exports = function(req, res) {

    var ddbItem = {
        'curriculum_id': {'S': uuidv4()},
        'name': {'S': req.body.name},
        'description': {'S': req.body.description}
    };

    ddb.putItem({
        'TableName': ddbTable,
        'Item': ddbItem
    }, function(err, data) {

        if (err) {
            console.log(err);
            res.render('500', {
            });
            return;
        }

        var curriculum_obj = {
            'curriculum_id': ddbItem.curriculum_id['S'],
            'name': ddbItem.name['S'],
            'description': ddbItem.description['S'],
        };

        res.render('curriculum-post', {
            'curriculum_obj': curriculum_obj,
        });
        return;
    });

}
