/* jshint esversion: 6 */
var arr = [];
// select all elements
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
        // 0 : choiceA,
        // 1 : choiceB
    }, {
        question: "I would like to run my own company one day.",
        choiceA: "True",
        choiceB: "False",
        // 0 : choiceA,
        // 1 : choiceB

    }, {
        question: "You will stand your ground in an argument, even if you are wrong",
        choiceA: "True",
        choiceB: "False",
        // 0 : choiceA,
        // 1 : choiceB
    },
    {
        question: "Whenever I get lost in thought I think about:",
        choiceA: "Shapes or patterns that I see in objects",
        choiceB: "Thoughts about the future and what I can do",
        // 0 : choiceA,
        // 1 : choiceB
    },
    {
        question: "I like to convey:",
        choiceA: "Thoughts and emotions to others",
        choiceB: "Ideas and solutions to things I'm passionate about",
        // 0 : choiceA,
        // 1 : choiceB
    },
    {
        question: "I feel superior whenever I win an argument, even if I hurt the other's emotions",
        choiceA: "True",
        choiceB: "False",
        // 0 : choiceA,
        // 1 : choiceB
    },
    {
        question: "I prefer simple, quick tasks rather than time-consuming ones",
        choiceA: "True",
        choiceB: "False",
        // 0 : choiceA,
        // 1 : choiceB
    },
    {
        question: "I would prefer to go through the process of learning something by myself rather than having someone teach it to me",
        choiceA: "True",
        choiceB: "False",
        // 0 : choiceA,
        // 1 : choiceB
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

function AnswerA() {
    document.getElementById("A").innerHTML = arr.push(0);
}

function AnswerB() {
    document.getElementById("B").innerHTML = arr.push(1);
}

function checkAnswer(answer) {
    if (answer == questions[runningQuestion].choiceA) {
        AnswerA();
    } else if (answer == questions[runningQuestion].choiceB) {
        AnswerB();
    }
    answerIsComplete();
    count = 0;
    if (runningQuestion < lastQuestion) {
        runningQuestion++;
        renderQuestion();
    } else {
        // end the quiz and show the score
        scoreRender();
    }
    console.log(arr); //remove once done with debugging
}

// answer is correct
function answerIsComplete() {
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}



// score render
function scoreRender() {
    scoreDiv.style.display = "block";
    let img = "img/5.png";
    scoreDiv.innerHTML = "<img src=" + img + ">";
    scoreDiv.innerHTML += "<p>" + 8 + "</p>";

}