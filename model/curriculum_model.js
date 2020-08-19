
function CurriculumModel(curriculumItem) {

    this.curriculumItem = curriculumItem;
}

CurriculumModel.prototype.getId = function() {
    return this.curriculumItem['curriculum_id'];
}

CurriculumModel.prototype.getName = function() {
    return this.curriculumItem['name'];
}

CurriculumModel.prototype.getDescription = function() {
    return this.curriculumItem['description'];
}

// EXPORTS
module.exports = CurriculumModel;