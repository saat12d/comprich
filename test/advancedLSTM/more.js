const brain = require("brain.js");
const net = new brain.recurrent.LSTMTimeStep({
    inputSize: 3,
    hiddenLayers: [10],
    outputSize: 3
});

//Same test as previous, but combined on a single set
const trainingData = [
    [8,8,1],[8,8,3],[8,8,5],[8,2,8],[3,6,6],[8,4,5]
];

net.train(trainingData, { iterations:200 });

console.log( net.run([[8,2,3]]));

console.log( net.forecast([[8,8,2]], 7)) ;