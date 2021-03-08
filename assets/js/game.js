import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection } from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';

$(document).ready(function() {
    getQuiz(startQuiz);
});

let lastRenderTime = 0;
const gameBoard = document.getElementById('game-board');
const pauseBtn = document.getElementById('pause_button');
const restartBtn = document.getElementById('restart_button');
let scoreCard = document.getElementById('current_score');
let gameOver = false;
let score = 0;
let pauseGame = false;


function main(currentTime) {
    if(gameOver) {
        if(confirm('You lost. Press OK to restart.')) {
            window.location = '/saint-patrick-hack';
        }
        return;
    }

    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    
    // Check if game paused
    if (pauseGame === true ) return;

    // Calculate if the snake needs to move 
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;
    lastRenderTime = currentTime;

    // Update loop
    update();
    

    // Draw snake in current pos.
    draw();
}


// Start loop that updates on set time
// renders frame
window.requestAnimationFrame(main);


function update() {
    updateSnake();
    updateFood();
    checkDeath();
    updateScore();
}


function draw() {
    // clear previous snake
    gameBoard.innerHTML = '';

    // render snake
    drawSnake(gameBoard);
    drawFood(gameBoard);
}

function checkDeath() {
    gameOver = snakeIntersection();
}

function updateScore() {
    console.log(score);
    scoreCard.innerText = score;
}


// Pause the game 
function pause(){
    console.log('pause');
    const pauseModal = document.getElementById('pause-modal');
    pauseModal.classList.remove('hidden')
    pause = true;
}

// Hide the modal and continue playing
document.addEventListener('keydown', function finishPause(){
    const pauseModal = document.getElementById('pause-modal');
    pauseModal.classList.add('hidden')
    pauseGame = false;
})


pauseBtn.addEventListener('click', function (){
    console.log('pause');
    const pauseModal = document.getElementById('pause-modal');
    pauseModal.classList.remove('hidden')
    pauseGame = true;
})

// Quiz Functions

let quizData;
let totalQuestions;
let correctAnswers;
let answeredQuestions = [];
let questionIndex;
let questionObj;

function getQuiz(callback) {
    $.getJSON("assets/js/questions.json", (data) => {
            callback(data);
        }
    );
}

function startQuiz(data) {
    quizData = data;
    totalQuestions = quizData.quiz.length;
    correctAnswers = 0;
    loadQuestion();
}

function loadQuestion() {
    $("#question").css("color", "black");
    $(".answer-button").css("background-color", "transparent");
    questionIndex = getQuestionIndex();
    questionObj = quizData.quiz[questionIndex];
    $("#question").html(questionObj.question);
    $("#quizImage").attr('src', questionObj.image);
    $.each(questionObj.options, function (optionIndex, option) { 
         $("#answerBtn"+optionIndex).html(option.answer);
         $("#answerBtn"+optionIndex).val(optionIndex);
    });
    
}

function getQuestionIndex() {
    let questionIndex = Math.floor(Math.random()*10);
    if (answeredQuestions.includes(questionIndex)) {
        return getQuestionIndex();
    } else {
        return questionIndex;
    }
}

function checkAnswer(subAnswer) {
    if (questionObj != undefined) {
        let responseText;
        let responseColor;
        let responseFunc;
        if (questionObj.correctAnswer == subAnswer) {
            correctAnswers++;
            responseText = "Correct!";
            responseColor = "Green";
        } else {
            responseText = `Incorrect! The correct answer was '${questionObj.options[questionObj.correctAnswer].answer}'.`;
            responseColor = "Red";
        }
        $.each($(".answer-button"), function (buttonIndex, buttonElement) { 
            let buttonColor;
            if ($(buttonElement).val() == questionObj.correctAnswer) {
                buttonColor = "Green";
            } else {
                buttonColor = "Red";
            }
            $(buttonElement).css("background-color", buttonColor);
        });

        $("#question").html(responseText);
        $("#question").css("color", responseColor);

        answeredQuestions.push(questionIndex);

        if (answeredQuestions.length == totalQuestions) {
            responseFunc = endGame;
        } else {
            responseFunc = loadQuestion;
        }
        setTimeout(responseFunc, 5000);
    } 
}

function endGame() {
    $(".answer-button").hide();
    $("#quizImage").attr('src', "assets/images/parade.jpg");
    $("#question").css("color", "Green");
    $("#question").html(`Congratulations! You scored ${correctAnswers}/${totalQuestions}!`);
}

$(".answer-button").click(function() {
    if (!answeredQuestions.includes(questionIndex)) {
        checkAnswer($(this).val());
    }
});

