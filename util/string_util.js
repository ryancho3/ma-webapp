
// DEPENDENCY
const { v4: uuidv4 } = require('uuid');
var crypto = require('crypto');
var dateformat = require('dateformat');

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

function parseYYYYMMDDIntFromDate(date) {
    var yyyymmdd = dateformat(date, "yyyymmdd");
    return parseInt(yyyymmdd);
}

function parseYYYYMMDDStringFromDate(date) {
    var yyyymmdd = dateformat(date, "yyyymmdd");
    return yyyymmdd;
}

function parseDateFromYYYYMMDD(yyyymmdd) {
    
    var yyyymmddString = "" + yyyymmdd; // force it to be string (in case it's a number)

    // validate
    if (yyyymmddString.length !== 8) {
        return null;
    }

    var stringYYYY = str.substring(0, 4);
    var stringMM = str.substring(4, 6);
    var stringDD = str.substring(6, 8);

    var intYYYY = parseInt(stringYYYY);
    var intMM = parseInt(stringMM);
    var intDD = parseInt(stringDD);

    var date = new Date(intYYYY, (intMM - 1), intDD, 0, 0, 0, 0);
    return date;
}

function parseYYYYMMDDHHStringFromYYYYMMDDAndHour(yyyymmdd, hour) {

    var stringYYYYMMDD = "" + yyyymmdd;
    var stringHH = "" + hour;

    if (stringHH.length != 2) {
        stringHH = "0" + stringHH;
    }

    return stringYYYYMMDD + "" + stringHH;
}

function parseShortDayStringFromYYYYMMDD(yyyymmdd) {

    if (!yyyymmdd) {
        return null;
    }

    var stringYYYY = yyyymmdd.substring(0, 4);
    var stringMM = yyyymmdd.substring(4, 6);
    var stringDD = yyyymmdd.substring(6, 8);

    var intYYYY = parseInt(stringYYYY);
    var intMM = parseInt(stringMM);
    var intDD = parseInt(stringDD);

    var date = new Date(intYYYY, intMM - 1, intDD);
    var dayInt = date.getDay();

    var dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayStrings[dayInt];
}

function parseFullDayStringFromYYYYMMDD(yyyymmdd) {

    if (!yyyymmdd) {
        return null;
    }

    var stringYYYY = yyyymmdd.substring(0, 4);
    var stringMM = yyyymmdd.substring(4, 6);
    var stringDD = yyyymmdd.substring(6, 8);

    var intYYYY = parseInt(stringYYYY);
    var intMM = parseInt(stringMM);
    var intDD = parseInt(stringDD);

    var date = new Date(intYYYY, intMM - 1, intDD);
    var dayInt = date.getDay();

    var dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayStrings[dayInt];
}

function parseDisplayStringFromYYYYMMDD(yyyymmdd) {
    var yyyymmddString = "" + yyyymmdd; // force it to be string (in case it's a number)

    // validate
    if (yyyymmddString.length !== 8) {
        return null;
    }

    var stringYYYY = str.substring(0, 4);
    var stringMM = str.substring(4, 6);
    var stringDD = str.substring(6, 8);

    var intYYYY = parseInt(stringYYYY);
    var intMM = parseInt(stringMM);
    var intDD = parseInt(stringDD);

    var date = new Date(intYYYY, (intMM - 1), intDD, 0, 0, 0, 0);
    return date;
}

function parseYYYYMMDDHHStringFromYYYYMMDDAndHour(yyyymmdd, hour) {

    var stringYYYYMMDD = "" + yyyymmdd;
    var stringHH = "" + hour;

    if (stringHH.length != 2) {
        stringHH = "0" + stringHH;
    }

    return stringYYYYMMDD + "" + stringHH;
}

function parseShortDayStringFromYYYYMMDD(yyyymmdd) {

    if (!yyyymmdd) {
        return null;
    }

    var stringYYYY = yyyymmdd.substring(0, 4);
    var stringMM = yyyymmdd.substring(4, 6);
    var stringDD = yyyymmdd.substring(6, 8);

    return (stringYYYY + "/" + stringMM + "/" + stringDD);
}


// EXPORTS
module.exports.generateUUIDString = generateUUIDString;
module.exports.toLowercaseString = toLowercaseString;
module.exports.parseSha256String = parseSha256String;
module.exports.parseYYYYMMDDIntFromDate = parseYYYYMMDDIntFromDate;
module.exports.parseYYYYMMDDStringFromDate = parseYYYYMMDDStringFromDate;
module.exports.parseDateFromYYYYMMDD = parseDateFromYYYYMMDD;
module.exports.parseYYYYMMDDHHStringFromYYYYMMDDAndHour = parseYYYYMMDDHHStringFromYYYYMMDDAndHour;
module.exports.parseShortDayStringFromYYYYMMDD = parseShortDayStringFromYYYYMMDD;
module.exports.parseFullDayStringFromYYYYMMDD = parseFullDayStringFromYYYYMMDD;
