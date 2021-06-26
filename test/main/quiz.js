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
        question : "I get frustrated very easily, especially if a certain task seems impossible to complete.",
        choiceA : "True",
        choiceB : "False",
        0 : choiceA,
        1 : choiceB
    },{
        question : "I would like to run my own company one day.",
        choiceA : "True",
        choiceB : "False",
        0 : choiceA,
        1 : choiceB
        
    },{
        question : "You will stand your ground in an argument, even if you are wrong",
        choiceA : "True",
        choiceB : "False",
        0 : choiceA,
        1 : choiceB
    },
    {
        question : "Whenever I get lost in thought I think about:",
        choiceA : "Shapes or patterns that I see in objects",
        choiceB : "Thoughts about the future and what I can do",
        0 : choiceA,
        1 : choiceB
    },
    {
        question : "I like to convey:",
        choiceA : "Thoughts and emotions to others",
        choiceB : "Ideas and solutions to things I'm passionate about",
        0 : choiceA,
        1 : choiceB
    },
    {
        question : "I feel superior whenever I win an argument, even if I hurt the other's emotions",
        choiceA : "True",
        choiceB : "False",
        0 : choiceA,
        1 : choiceB
    },
    {
        question : "I prefer simple, quick tasks rather than time-consuming ones",
        choiceA : "True",
        choiceB : "False",
        0 : choiceA,
        1 : choiceB
    },
    {
        question : "I would prefer to go through the process of learning something by myself rather than having someone teach it to me",
        choiceA : "True",
        choiceB : "False",
        0 : choiceA,
        1 : choiceB
    }
];

// create some variables

const lastQuestion = questions.length - 1;
let runningQuestion = 0;
let count = 0;
const questionTime = 10; // 10s
const gaugeWidth = 150; // 150px
const gaugeUnit = gaugeWidth / questionTime;
let TIMER;
let score = 0;

// render a question
function renderQuestion(){
    let q = questions[runningQuestion];
    
    question.innerHTML = "<p>"+ q.question +"</p>";
    choiceA.innerHTML = q.choiceA;
    choiceB.innerHTML = q.choiceB;

}

start.addEventListener("click",startQuiz);

// start quiz
function startQuiz(){
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();
     // 1000ms = 1s
}

// render progress
function renderProgress(){
    for(let qIndex = 0; qIndex <= lastQuestion; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}



function checkAnswer(answer){
    if( answer == questions[runningQuestion].choiceA){
       
        score++; //send data to mainml file
        
        answerIsCorrect();
    }else{
        
        answerIsCorrect();
    }
    count = 0;
    if(runningQuestion < lastQuestion){
        runningQuestion++;
        renderQuestion();
    }else{
        // end the quiz and show the score
        clearInterval(TIMER);
        scoreRender();
    }
}

// answer is correct
function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// answer is Wrong
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// score render
function scoreRender(){
    scoreDiv.style.display = "block";
    
    // calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score/questions.length);
    
    // choose the image based on the scorePerCent
    let img = (scorePerCent >= 80) ? "img/5.png" :
              (scorePerCent >= 60) ? "img/4.png" :
              (scorePerCent >= 40) ? "img/3.png" :
              (scorePerCent >= 20) ? "img/2.png" :
              "img/1.png";
    
    scoreDiv.innerHTML = "<img src="+ img +">";
    scoreDiv.innerHTML += "<p>"+ scorePerCent +"%</p>";
}





















