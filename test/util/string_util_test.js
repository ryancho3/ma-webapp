
// DEPENDENCY
var assert = require('assert');
var stringUtil = require('../../util/string_util.js');

describe('StringUtil', function () {

    describe('#toLowercaseString()', function () {

        it('should return lowercase string for a given string', function () {

            var lowercaseString = stringUtil.toLowercaseString("Hello this IS me!");
            assert.equal(lowercaseString, "hello this is me!");
        });

        it('should return the same lowercase string for a given lowercase string', function () {

            var lowercaseString = stringUtil.toLowercaseString("foo bar");
            assert.equal(lowercaseString, "foo bar");
        });

        it('should return null if given null string', function () {

            var lowercaseString = stringUtil.toLowercaseString(null);
            assert.strictEqual(lowercaseString, null);
        });
    });
});

