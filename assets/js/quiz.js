
/*jshint esversion:6 */

var arr = [];

const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");







// create our questions
let questions = [
    {
        question: "I get frustrated very easily, especially if a certain task seems impossible to complete.",
        choiceA: "True",
        choiceB: "False",
    }, {
        question: "I would like to run my own company one day.",
        choiceA: "True",
        choiceB: "False",
    }, {
        question: "You will stand your ground in an argument, even if you are wrong",
        choiceA: "True",
        choiceB: "False",
    },
    {
        question: "Whenever I get lost in thought I think about:",
        choiceA: "Shapes or patterns that I see in objects",
        choiceB: "Thoughts about the future and what I can do",
    },
    {
        question: "I like to convey:",
        choiceA: "Thoughts and emotions to others",
        choiceB: "Ideas and solutions to things I'm passionate about",
    },
    {
        question: "I feel superior whenever I win an argument, even if I hurt the other's emotions",
        choiceA: "True",
        choiceB: "False",
    },
    {
        question: "I prefer simple, quick tasks rather than time-consuming ones",
        choiceA: "True",
        choiceB: "False",
    },
    {
        question: "I would prefer to go through the process of learning something by myself rather than having someone teach it to me",
        choiceA: "True",
        choiceB: "False", 
    }
];

// create some variables

const lastQuestion = questions.length - 1;
let runningQuestion = 0;

// render a question
function renderQuestion() {
    let qs = questions[runningQuestion];
    question.innerHTML = "<p>" + qs.question + "</p>";
    choiceA.innerHTML = qs.choiceA;
    choiceB.innerHTML = qs.choiceB;
}


start.addEventListener("click", startQuiz);


// start quiz
function startQuiz() {
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();

}

// render progress
function renderProgress() {
    for (let qIndex = 0; qIndex <= lastQuestion; qIndex++) {
        progress.innerHTML += "<div class='prog' id=" + qIndex + "></div>";
    }
}

function finishQuiz() {
    const brain = require('brain.js');
    const net = new brain.NeuralNetwork();


    net.train([ //trains Neural Network on examples of inputs from quiz
        { input: { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0, eight: 0 }, output: { number: 0.13 } }, //Business
        { input: { one: 1, two: 1, three: 1, four: 1, five: 1, six: 1, seven: 1, eight: 1 }, output: { number: -0.13 } }, //Maths
        { input: { one: 1, two: 0, three: 1, four: 0, five: 1, six: 0, seven: 1, eight: 0 }, output: { number: 0.01 } }, //Debating
        { input: { one: 0, two: 1, three: 0, four: 1, five: 0, six: 1, seven: 0, eight: 1 }, output: { number: 0.21 } }, //Writing
        { input: { one: 1, two: 0, three: 1, four: 1, five: 1, six: 1, seven: 0, eight: 0 }, output: { number: -0.19 } }, //Computer Science
    ]);

    var output = net.run({ 
        one: arr[0], 
        two: arr[1], 
        three: arr[2], 
        four: arr[3], 
        five: arr[4], 
        six: arr[5], 
        seven: arr[6], 
        eight: arr[7]
    }); //converts object output to str then to float
    var myJSON = JSON.stringify(output);
    myJSON = myJSON.substr(10, 20);
    const final_number = parseFloat(myJSON);

//compares values to mindset line as discussed previously and outputs most suitable option
    let personal_output = "";
    if (final_number > 0.4) {
       personal_output = "Art";
    } else if (0.4 > final_number > 0.3) {
        personal_output = "Writing";
    } else if (0.3 > final_number > 0.1) {
    personal_output = "Debating";
    } else if (0.1 > final_number > 0) {
        personal_output = "Business";
    } else if (0 > final_number > -0.1) {
       personal_output = "Science";
    } else if (-0.1 > final_number > -0.13) {
        personal_output = "Maths";
    } else if (-0.13 > final_number) {
         personal_output = "Computer Science";
    }
}
    

function checkAnswer() {
    answerIsComplete();
    count = 0;
    if (runningQuestion < lastQuestion) {
        runningQuestion++;
        renderQuestion();
    } else {
        scoreRender();
    }
}


// answer is complete
function answerIsComplete() {
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}



// score render
function scoreRender() {
    scoreDiv.style.display = "block";
    scoreDiv.innerHTML += "<p>"+arr+"</p>";

}
