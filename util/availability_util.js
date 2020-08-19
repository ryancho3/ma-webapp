
function mergeHourLists(hourLists) { // [ [1,2,3], [2,4,5], [1,3,5],.. ]

    // Put from list1
    var hourMap = {}; // {1 => true, 4 => true, ...}
    hourLists.forEach(function(tmpHourList) {

        if (!Array.isArray(tmpHourList)) {
            return; // skip non-array
        }

        tmpHourList.forEach(function(hour) {
            hourMap[hour] = true;
        })
    });

    // Parse hour list
    var hourList = [];
    Object.keys(hourMap).forEach(function(hour) {
        hourList.push(hour);
    });

    return hourList;
}

function mergeDateToHourListMaps(dateToHourListMaps) { // [ {yyyymmdd1: [1,2,3]}, {yyyymmdd2: [2,4,6]}, ...]

    // 1. Create unique date list
    var dateMap = {};
    dateToHourListMaps.forEach(function(dateToHourList) {

        Object.keys(dateToHourList).forEach(function(yyyymmdd) {
            dateMap[yyyymmdd] = true;
        });
    })

    var dateList = [];
    Object.keys(dateMap).forEach(function(date) {
        dateList.push(date);
    })

    // 2. Parse result
    var resultDateToHourListMap = {};
    dateList.forEach(function(yyyymmdd) {

        var hourLists = [];

        dateToHourListMaps.forEach(function(dateToHourListMap) {

            var tmpHourList = dateToHourListMap[yyyymmdd];
            if (tmpHourList) {
                hourLists.push(tmpHourList);
            }
        });

        var mergedHourList = mergeHourLists(hourLists);
        resultDateToHourListMap[yyyymmdd] = mergedHourList;
    });

    return resultDateToHourListMap;
}

// EXPORTS
module.exports.mergeHourLists = mergeHourLists;
module.exports.mergeDateToHourListMaps = mergeDateToHourListMaps;