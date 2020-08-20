
// CLASS
function SessionModel(sessionItem) {

    this.sessionItem = sessionItem;
    this.userItem = null;
}

// SETTERS

SessionModel.prototype.setSessionItem = function(sessionItem) {
    this.sessionItem = sessionItem;
}

SessionModel.prototype.setUserItem = function(userItem) {
    this.userItem = userItem;
}

// GETTERS

SessionModel.prototype.isLoggedIn = function() {

    return (this.sessionItem && this.userItem);
}

SessionModel.prototype.isUserAdmin = function() {
    return this._isUserType('ADMIN');
}

SessionModel.prototype.isUserTutor = function() {
    return this._isUserType('TUTOR');
}

SessionModel.prototype.isUserStudent = function() {
    return this._isUserType('STUDENT');
}

SessionModel.prototype.getSessionId = function() {

    if (!this.sessionItem) {
        return null;
    }
    return this.sessionItem['sessionId'];
}

SessionModel.prototype.getSessionUserId = function() {
    if (this.sessionItem) {
        return this.sessionItem['userId'];
    } else {
        return null;
    }
}

SessionModel.prototype.getUserType = function() {

    if (!this.userItem) {
        return null;
    }
    return this.userItem['user_type'];
}

SessionModel.prototype.getUserName = function() {

    if (!this.userItem) {
        return null;
    }
    return this.userItem['name'];
}

SessionModel.prototype.getUserEmail = function() {

    if (!this.userItem) {
        return null;
    }
    return this.userItem['email_lowercase'];
}

// HELPERS

SessionModel.prototype._isUserType = function(userType) {

    if (!this.userItem) {
        return false;
    }
    return (userType == this.userItem['user_type']);
}

// EXPORTS
module.exports = SessionModel;
