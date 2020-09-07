// DEPENDENCY
var assert = require('assert');
var dateUtil = require('../../util/date_util.js');

describe('DateUtil', function () {

    describe('#verifyYYYYMMDD()', function () {

        it('should return the same YYYYMMDD if already correct', function () {

            var yyyymmdd = dateUtil.verifyYYYYMMDD(20200901);
            assert.equal(yyyymmdd, 20200901);
        });

        it('should return the corrected YYYYMMDD', function () {

            var yyyymmdd = dateUtil.verifyYYYYMMDD(20200931);
            assert.equal(yyyymmdd, 20201001);
        });

        it('should return null if given null', function () {

            var yyyymmdd = dateUtil.verifyYYYYMMDD(null);
            assert.strictEqual(yyyymmdd, null);
        });
    });

    describe('getDaysInMonth()', function () {

        it('should return the right number of days for each month', function () {

            var days = dateUtil.getDaysInMonth(9,2020);
            assert.equal(days, 30);
        });
    });
});