import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection } from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';

let lastRenderTime = 0;
const gameBoard = document.getElementById('game-board')
const pauseBtn = document.getElementById('pause_button');
let gameOver = false;
let score = 0;
let pauseGame = false;


function main(currentTime) {
    if(gameOver) {
        if(confirm('You lost. Press OK to restart.')) {
            window.location = '/'
        }
        return
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