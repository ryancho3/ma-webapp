//Dependency
var dateformat = require('dateformat');
var stringUtil = require('./string_util')

function getDaysInMonth(month,year) {
   return new Date(year, month, 0).getDate();
};

function verifyYYYYMMDD(yyyymmdd) {
    if (yyyymmdd == null) {
        return null;
    }
    
    var yyyymmddString = "" + yyyymmdd;
    
    var stringYYYY = yyyymmddString.substring(0, 4);
    var stringMM = yyyymmddString.substring(4, 6);
    var stringDD = yyyymmddString.substring(6, 8);

    if (stringMM > 12) {
        stringMM = 01;
    }
    var intYYYY = parseInt(stringYYYY);
    var intMM = parseInt(stringMM);
    var intDD = parseInt(stringDD);

    if (intDD > getDaysInMonth(intMM, intYYYY)) {
        var intDD = intDD - getDaysInMonth(intMM, intYYYY);
        var intMM = intMM + 1;
    }
    
    var intDate = (intYYYY*10000) + (intMM*100) + intDD;

    return intDate;
}

function getWeekStartDate(date) {
    var weekStartDate = new Date();
    var givenDate = new Date();
    givenDate.setDate(date);
    console.log(givenDate);
    weekStartDate.setDate(givenDate.getDate() - givenDate.getDay());
    return weekStartDate;
}

function getWeekEndDate(date) {
    var weekEndDate = new Date();
    var givenDate = new Date();
    givenDate.setDate(date);
    weekEndDate.setDate(givenDate.getDate() - givenDate.getDay() + 7);
    return weekEndDate;
}

module.exports.verifyYYYYMMDD = verifyYYYYMMDD;
module.exports.getDaysInMonth = getDaysInMonth;
module.exports.getWeekStartDate = getWeekStartDate;
module.exports.getWeekEndDate = getWeekEndDate;





