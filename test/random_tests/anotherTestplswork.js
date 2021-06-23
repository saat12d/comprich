const brain = require("brain.js");
const net = new brain.recurrent.LSTM();

net.train([
  { input: 'I feel great about the world!', output: 'happy' },
  { input: 'The world is a terrible place!', output: 'sad' },
]);

const output = net.run('I feel great about the world!'); // 'happy'