const brain = require('brain.js'); //dont convert to "import" in es6 or else it won't work
const net = new brain.NeuralNetwork();

net.train([ //trains Neural Network on examples of inputs from quiz (FYI, computed the following values in Jupyter Notebooks in Python)
  { input: { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven:0, eight:0 }, output: {number: 0.13} }, //Business
  { input: { one: 1, two: 1, three: 1, four: 1, five: 1, six: 1, seven:1, eight:1 }, output: {number: -0.13} }, //Maths
  { input: { one: 1, two: 0, three: 1, four: 0, five: 1, six: 0, seven:1, eight:0 }, output: {number: 0.01} }, //Debating
  { input: { one: 0, two: 1, three: 0, four: 1, five: 0, six: 1, seven:0, eight:1 }, output: {number:0.41} }, //Writing
  { input: { one: 1, two: 1, three: 0, four: 1, five: 1, six: 0, seven:1, eight:1 }, output: {number:0.47} }, //Art
  { input: { one: 1, two: 0, three: 1, four: 1, five: 1, six: 1, seven:0, eight:0 }, output: {number: -0.19} }, //Computer Science
]);

var output = net.run({one: 0, two: 1, three: 1, four: 1, five: 0, six: 1, seven:0, eight:1}); //converts object output to str then to float
var myJSON = JSON.stringify(output);
myJSON = myJSON.substr(10,20);
const final_number = parseFloat(myJSON);

var final_decision = (0); //compares values to mindset line as discussed previously and outputs most suitable option
if (output > 0.4) {
    final_decision = "Art";
} else if (0.4 > output > 0.3) {
    final_decision = "Writing";
} else if (0.3 > output > 0.1) {
    final_decision = "Debating";
} else if (0.1 > output > 0) {
    final_decision = "Business";
} else if (0 > output > -0.1) {
    final_decision = "Science";
} else if (-0.1 > output > -0.13) {
    final_decision = "Maths";
} else if (-0.13 > output) {
    final_decision = "Computer Science";
}

console.log(final_decision);