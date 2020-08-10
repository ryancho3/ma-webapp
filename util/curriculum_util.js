
// DEPENDENCY
var stringUtil = require('./string_util.js')

function newDynamodbItemFromInput(curriculumInput) {

    var newCurriculumId = stringUtil.generateUUIDString();

    var dynamodbItem = {
        'curriculum_id': {'S': newCurriculumId},
        'name': {'S': curriculumInput.name},
        'description': {'S': curriculumInput.description}
    };

    return dynamodbItem;
}

function mapDynamodbItemToCurriculumObj(dynamodbItem) {

    if (!dynamodbItem) {
        return null;
    }

    var curriculumObj = {
        'curriculum_id': dynamodbItem.curriculum_id['S'],
        'name': dynamodbItem.name['S'],
        'description': dynamodbItem.description['S'],
    };
    
    return curriculumObj;
}

module.exports.newDynamodbItemFromInput = newDynamodbItemFromInput;
module.exports.mapDynamodbItemToCurriculumObj = mapDynamodbItemToCurriculumObj;