import { getInputDirection } from "./input.js";
import { GRID_SIZE } from "./grid.js";

// How many times the snake moves per second
export const SNAKE_SPEED = 3;
const snakeBody = [
    { x: 11, y: 11 },
]
let newSegments = 0;

export function update() {
    addSegments();
    const inputDirection = getInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = {...snakeBody[i]}
    };
    snakeBody[0].x += inputDirection.x;
    if (snakeBody[0].x < 1) snakeBody[0].x = GRID_SIZE;
    if (snakeBody[0].x > GRID_SIZE) snakeBody[0].x = 1;
    if (snakeBody[0].y < 1) snakeBody[0].y = GRID_SIZE;
    if (snakeBody[0].y > GRID_SIZE) snakeBody[0].y = 1;
    snakeBody[0].y +=  inputDirection.y;
}


export function draw(gameBoard) {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;

        // Add css
        snakeElement.classList.add('snake');

        // Add to markup
        gameBoard.appendChild(snakeElement);
    })
}

export function expandSnake(amount) {
    newSegments += amount;
}

export function onSnake(position, {ignoreHead = false} = {}) {
    return snakeBody.some((segment, index) => {
        if(ignoreHead && index === 0) return false;
        // check if on snake
        return equalPositions(segment, position)
    })
}

// get coordinates of the snake head
export function getSnakeHead(){
    return snakeBody[0];
}

export function snakeIntersection() {
    return onSnake(snakeBody[0], {ignoreHead: true})
}

// check if x/y coords of 2 positions match
function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y; 
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({...snakeBody[snakeBody.length - 1]})
    }
    newSegments = 0;
}