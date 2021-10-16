
/*jshint esversion:6 */
var arr = [];
// select all elements
// const brain = require('brain.js');
// const net = new brain.NeuralNetwork();
const start = document.getElementById("startButton");
const title1 = document.getElementById("title1");
const title2 = document.getElementById("title2");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
var finalNumber = 0;



// create our questions
let questions = [
    {
        question: "I get frustrated very easily, especially if a certain task seems impossible to complete.",
        choiceA: "True",
        choiceB: "False",
        scoreA: 0.2,
        scoreB: -0.2
    }, {
        question: "I would like to run my own company one day.",
        choiceA: "True",
        choiceB: "False",
        scoreA: -0.15,
        scoreB: 0.15
    }, {
        question: "You will stand your ground in an argument, even if you are wrong",
        choiceA: "True",
        choiceB: "False",
        scoreA: 0.1,
        scoreB: -0.1,
    },
    {
        question: "Whenever I get lost in thought I think about:",
        choiceA: "Shapes or patterns that I see in objects",
        choiceB: "Thoughts about the future and what I can do",
        scoreA: -0.11,
        scoreB: 0.11,
    },
    {
        question: "I like to convey:",
        choiceA: "Thoughts and emotions to others",
        choiceB: "Ideas and solutions to things I'm passionate about",
        scoreA: 0.09,
        scoreB: -0.09
    },
    {
        question: "I feel superior whenever I win an argument, even if I hurt the other's emotions",
        choiceA: "True",
        choiceB: "False",
        scoreA: 0.2,
        scoreB: -0.2
    },
    {
        question: "I prefer simple, quick tasks rather than time-consuming ones",
        choiceA: "True",
        choiceB: "False",
        scoreA: -0.12,
        scoreB: 0.12
    },
    {
        question: "I would prefer to go through the process of learning something by myself rather than having someone teach it to me",
        choiceA: "True",
        choiceB: "False",
        scoreA: -0.08,
        scoreB: 0.08 
    }
];


const lastQuestion = questions.length - 1;
let runningQuestion = 0;

// render a question
function renderQuestion() {
    let qs = questions[runningQuestion];
    question.innerHTML = "<h6>" + qs.question + "</h6>";
    choiceA.innerHTML = qs.choiceA;
    choiceB.innerHTML = qs.choiceB;

}

function addA(){
    finalNumber += questions[runningQuestion].scoreA;
}

function addB(){
    finalNumber += questions[runningQuestion].scoreB;
}

start.addEventListener("click", startQuiz);


// start quiz
function startQuiz() {

    title1.style.display = "none";
    title2.style.display = "none";
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();

}

// render progress
// function renderProgress() {
//     for (let qIndex = 0; qIndex <= lastQuestion; qIndex++) {
//         progress.innerHTML += "<div class='prog' id=" + qIndex + "></div>";
//     }
// }

function renderProgress() {
    for (let qIndex = lastQuestion; qIndex >= 0; qIndex--) {
        progress.innerHTML += "<div class='prog' id=" + qIndex + "></div>";
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
// function scoreRender() {
//     scoreDiv.style.display = "block";
//     let img = "img/5.png";
//     scoreDiv.innerHTML = "<img src=" + img + ">";
//     scoreDiv.innerHTML += "<p>Thank you</p>";

// }

function scoreRender() {
    quiz.style.display = "none"
    scoreDiv.style.display = "block";
    if (finalNumber > 0.4) {
        personal_output = "Art";
    } else if (0.4 > finalNumber > 0.3) {
        personal_output = "Writing";
    } else if (0.3 > finalNumber > 0.1) {
        personal_output = "Debating";
    } else if (0.1 > finalNumber > 0) {
        personal_output = "Business";
    } else if (0 > finalNumber > -0.1) {
        personal_output = "Science";
    } else if (-0.1 > finalNumber > -0.13) {
        personal_output = "Maths";
    } else if (-0.13 > finalNumber) {
        personal_output = "Computer Science";
    }
    scoreDiv.innerHTML += "<p>"+personal_output+"</p>";
}
