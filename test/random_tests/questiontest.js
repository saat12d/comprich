const brain = require('brain.js');

// THIS DATA WILL BE IMPORTED
const questions = [
    {
        question: "How are you?",
        answer: "I'm fine thanks"
    },
    {
        question: "Are you okay?",
        answer: "I'm all good!"
    }
];

let data = [];

// Setting up the data.
for (let index in questions) {
    if (questions.hasOwnProperty(index)) {
        data.push({input: questions[index].question, output: questions[index].answer});
    }
}

// Setting up the net
const net = new brain.recurrent.LSTM();
// Training the net
net.train(data);

// Output
const output = net.run("How are you?");
console.log(output);