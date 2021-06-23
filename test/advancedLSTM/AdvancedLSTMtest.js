const brain = require("brain.js");
var net = new brain.recurrent.LSTMTimeStep();
net.train([
  [1, 3],
  [2, 2],
  [3, 1],
]);    
var output = net.run([[1, 3], [2, 2]]);  // [3, 1]