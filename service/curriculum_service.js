
// DEPENDENCY
var dynamodb = require('../client/dynamodb.js');
var curriculumUtil = require('../util/curriculum_util.js');

// CLASS
function CurriculumService () {
    
    this.ddbClient = dynamodb.dynamodbClient();
    this.ddbTable = "mf-prod-curriculum";
}

CurriculumService.prototype.createCurriculum = function(input, callback) {

    var ddbItem = curriculumUtil.newDynamodbItemFromInput(input);
    var ddbParams = {
        'TableName': this.ddbTable,
        'Item': ddbItem
    }

    this.ddbClient.putItem(ddbParams, function(err, data) {

        if (err) {
            return callback(err);
        }

        var curriculum_obj = curriculumUtil.mapDynamodbItemToCurriculumObj(ddbItem);

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

        var curriculum_obj = curriculumUtil.mapDynamodbItemToCurriculumObj(data.Item);

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

        var curriculumItems = [];

        data.Items.forEach(function(ddbItem){
            var curriculum_obj = curriculumUtil.mapDynamodbItemToCurriculumObj(ddbItem);
            curriculumItems.push(curriculum_obj);
        });

        return callback(null, {
            'curriculumItems': curriculumItems
        });
    });
}

CurriculumService.prototype.removeCurriculum = function(input, callback) {

    var inputCurriculumId = input['curriculumId'];

    var ddbParams = {
        'TableName': this.ddbTable,
        'Key': {
            'curriculum_id': {'S': inputCurriculumId}
        }
    }

    this.ddbClient.deleteItem(ddbParams, function(err, data) {
        return callback(err);
    });
}

// EXPORT
var curriculumService = new CurriculumService();
module.exports = curriculumService;