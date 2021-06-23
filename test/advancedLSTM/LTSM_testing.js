
const brain = require("brain.js");
const data = require("../data.json");

const network = new brain.recurrent.LSTM();

const trainingData = data.questions.map(item => ({
    input: item.one/item.two/item.three/item.four/item.five/item.six/item.seven/item.eight, 
    output: item.result
})); //.map goes thru array and creates new array

network.train(trainingData, {
    iterations: 100
});

const output = network.run(0);

console.log(` ${output}`);