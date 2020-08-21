
// run: node test.js

function addTwoNumber(firstNumber, secondNumber, callback) { // callback(err, data)

    // takes a really long time..

    var result = firstNumber + secondNumber;

    //callback(null, result);

    callback(new Error("hello"));
}

addTwoNumber(12, 13, function(err, data) {

    if (err) {
        console.log("Error!");
        console.log(err);
        return;
    }

    console.log(data);
    return;
});
