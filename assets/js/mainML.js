/* jshint esversion: 6 */
const brain = require('brain.js'); //dont convert to "import" in es6 or else it won't work
const net = new brain.NeuralNetwork();

net.train([ //trains Neural Network on examples of inputs from quiz (FYI, computed the following values in Jupyter Notebooks in Python)
    { input: { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0, eight: 0 }, output: { number: 0.13 } }, //Business
    { input: { one: 1, two: 1, three: 1, four: 1, five: 1, six: 1, seven: 1, eight: 1 }, output: { number: -0.13 } }, //Maths
    { input: { one: 1, two: 0, three: 1, four: 0, five: 1, six: 0, seven: 1, eight: 0 }, output: { number: 0.01 } }, //Debating
    { input: { one: 0, two: 1, three: 0, four: 1, five: 0, six: 1, seven: 0, eight: 1 }, output: { number: 0.21 } }, //Writing
    { input: { one: 1, two: 0, three: 1, four: 1, five: 1, six: 1, seven: 0, eight: 0 }, output: { number: -0.19 } }, //Computer Science
]);



var output = net.run({ one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0, eight: 1 }); //converts object output to str then to float
var myJSON = JSON.stringify(output);
myJSON = myJSON.substr(10, 20);
const final_number = parseFloat(myJSON);

//compares values to mindset line as discussed previously and outputs most suitable option
if (final_number > 0.4) {
    output = "Art";
} else if (0.4 > final_number > 0.3) {
    output = "Writing";
} else if (0.3 > final_number > 0.1) {
    output = "Debating";
} else if (0.1 > final_number > 0) {
    output = "Business";
} else if (0 > final_number > -0.1) {
    output = "Science";
} else if (-0.1 > final_number > -0.13) {
    output = "Maths";
} else if (-0.13 > final_number) {
    output = "Computer Science";
}

console.log(output);