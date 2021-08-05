

// DEPENDENCY
var mediaUtil = require('./media_util.js')

function getFileExtension(path) {
    var ext = null
    if (path.includes('.jpg')) {
        ext = '.jpg'
    } else if (path.includes('.png')) {
        ext = '.png'
    }

    return ext;
}

module.exports.getFileExtension = getFileExtension;
