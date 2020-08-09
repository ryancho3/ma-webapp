
// DEPENDENCY
const { v4: uuidv4 } = require('uuid');
var dynamodb = require("../client/dynamodb.js");

// CLASS
function CurriculumService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbTable = "mf-prod-curriculum";
}

CurriculumService.prototype.createCurriculum = function(input, callback) {

    var ddbItem = {
        'curriculum_id': {'S': uuidv4()},
        'name': {'S': input.name},
        'description': {'S': input.description}
    };

    this.ddbClient.putItem({
        'TableName': this.ddbTable,
        'Item': ddbItem

    }, function(err, data) {

        if (err) {
            callback(err);
            return;
        }

        var curriculum_obj = {
            'curriculum_id': ddbItem.curriculum_id['S'],
            'name': ddbItem.name['S'],
            'description': ddbItem.description['S'],
        };

        return callback(null, {
            'curriculum_obj': curriculum_obj
        });
    });
}

CurriculumService.prototype.loadCurriculum = function(input, callback) {

    this.ddbClient.getItem({
        'TableName': this.ddbTable,
        'Key': {'curriculum_id': {'S': input.curriculum_id}}

    }, function(err, data) {

        if (err) {
            return callback(err);
        }

        var ddbItem = data.Item;
        var curriculum_obj = {
            'curriculum_id': ddbItem.curriculum_id['S'],
            'name': ddbItem.name['S'],
            'description': ddbItem.description['S'],
        };

        return callback(null, {
            'curriculum_obj': curriculum_obj,
        });
    });

}

CurriculumService.prototype.listCurriculum = function(callback) {

    this.ddbClient.scan({
        'TableName': this.ddbTable,

    }, function(err, data) {

        if (err) {
            return callback(err);
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

        return callback(null, {
            'curriculum_list': curriculum_list
        });
    });
}

// EXPORT

var curriculumService = new CurriculumService();
module.exports = curriculumService;