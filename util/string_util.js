
// DEPENDENCY
const { v4: uuidv4 } = require('uuid');
var crypto = require('crypto');

// Generates a new uuid
function generateUUIDString() {
    return uuidv4();
}

function toLowercaseString(str) {

    if (!str) {
        return null;
    }

    var lowercaseString = str.toLowerCase();
    return lowercaseString;
}

function parseSha256String(str) {

    if (!str) {
        return null;
    }

    var sha256String = crypto.createHash('sha256').update(str).digest('base64');
    return sha256String;
}

// EXPORTS
module.exports.generateUUIDString = generateUUIDString;
module.exports.toLowercaseString = toLowercaseString;
module.exports.parseSha256String = parseSha256String;