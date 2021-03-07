/*jshint esversion: 6 */

$(document).ready(function() {
    $("#restart_button").click(restart);

    $.getJSON("assets/js/leaderboard.json", (data) => {
            let tableTemplate = ``;
            $.each(data.leaderboard, function (key, row) {
                let rowTemplate = `
                    <tr>
                        <td>${row.pos}</td>
                        <td>${row.name}</td>
                        <td>${row.score}</td>
                    </tr>`;
                tableTemplate += rowTemplate;
            });
            $("#leaderboard-table").html(tableTemplate);
            cvs.height = cvs.offsetHeight;
        }
    );

    getQuiz(startQuiz);
});

const cvs = document.getElementById("gameboard");
const ctx = cvs.getContext("2d");
const board_background = "white";
let score=0;

cvs.width = cvs.offsetWidth;
cvs.height = cvs.offsetHeight;

let frames = 0;

let foodEaten = false;

const direction = {
    current : 0,
    idle : 0,
    right : 1,
    down : 2,
    left : 3,
    up : 4
};

document.addEventListener("keydown", function(evt){
    switch(evt.keyCode){
        case 37:
            //move left
            if(direction.current != direction.left && direction.current != direction.right) direction.current = direction.left;
            break;
        case 38:
            //move up
            if(direction.current != direction.up && direction.current != direction.down) direction.current = direction.up;
            break;
        case 39:
            //move right
            if(direction.current != direction.right && direction.current != direction.left) direction.current = direction.right;
            break;
        case 40:
            //move down
            if(direction.current != direction.down && direction.current != direction.up) direction.current = direction.down;
            break;
    }

});

function getDistance(pointX1, pointY1, pointX2, pointY2) {
    let distanceX = pointX2 - pointX1;
    let distanceY = pointY2 - pointY1;

   return Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
}

const food = {
    x : cvs.width/4,
    y : cvs.height/4,
    r : 10,

    draw : function(){
        // let image = new Image();
        // image.src="./assets/images/leprachaun.png";
        // ctx.drawImage(image, food.x, food.y, 20, 20);

        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, this.r, 0 , 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
};
const snake = {
    radius : 10,
    position : [{ x : cvs.width/2, y : cvs.height/2}],

    draw : function() {
        ctx.fillStyle = "black";
        for( let i = 0; i< this.position.length; i++){
            let p = this.position[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    },

    update : function() {
        if(frames % 6 == 0){
            if(foodEaten == true){
                score++;
                $("#current_score").html(score);
                this.position.push({
                    x : this.position[this.position.length -1].x,
                    y : this.position[this.position.length -1].y
                });
                foodEaten = false;
            }

            if(this.position[0].x < 0 ) this.position[0].x = cvs.width - 10;
            if(this.position[0].x > cvs.width ) this.position[0].x = 10;
            if(this.position[0].y < 0 ) this.position[0].y = cvs.height - 10;
            if(this.position[0].y > cvs.height ) this.position[0].y = 10;

            for( let i = this.position.length -1; i > 0;  i--){
                    if(this.position[0].x == this.position[i].x && this.position[0].y == this.position[i].y && this.position.length > 2) {
                        this.position.splice(1);
                        showScoreModal(score);
                        score = 0;
                        $("#current_score").html(score);
                        break;
                    }
                    this.position[i].x = this.position[i-1].x;
                    this.position[i].y = this.position[i-1].y;
                }
            if(direction.current == direction.right) {

                this.position[0].x += 20;
            }
            if(direction.current == direction.left) {
                this.position[0].x -= 20;
            }
            if(direction.current == direction.up) {
                this.position[0].y -= 20;
            }
            if(direction.current == direction.down) {
                this.position[0].y += 20;
            }
            if(getDistance(food.x,food.y,this.position[0].x, this.position[0].y) <= 2*food.r){
                food.x = Math.random() * cvs.width;
                food.y = Math.random() * cvs.height;
                foodEaten = true;
            }
        }

    }
};

function restart(){
  location.reload();
  return false;
}

function main() {

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    snake.update();
    snake.draw();
    food.draw();
    frames ++;
    requestAnimationFrame(main);

}
requestAnimationFrame(main);

$("#gameboard").click(function() {
    $(document).keydown(function() {
        preventScrollKeys(event);
    });
});

let keys = {37: 1, 38: 1, 39: 1, 40: 1};
    
function preventDefault(e) {
    e.preventDefault();
}

function preventScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function showScoreModal(subScore) {
    $('#scoreModal').modal('toggle');
    $('#scoreDisplay').html(subScore + "!");
}


$("#scoreSubmitBtn").click(function() {
    scoreName = $("#scoreName").val();
    score = parseInt($("#scoreDisplay").html());
    if (scoreName == "") {
        alert("Name field cannot be blank!");
        return false;
    }
});


// Pause the game 

function pause(){
    const pauseModal = document.getElementById('pause-modal');
    pauseModal.classList.remove('hidden');
    direction.current = 0;    
}

// Hide the modal and continue playing
document.addEventListener('keydown', function finishPause(){
    const pauseModal = document.getElementById('pause-modal');
    pauseModal.classList.add('hidden');
});



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
