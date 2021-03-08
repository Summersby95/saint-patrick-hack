export const GRID_SIZE = 21;

export function randomGridPosition() {
    return {
        // returns random number between 1 and 21
        x: Math.floor(Math.random() * GRID_SIZE + 1),
        y: Math.floor(Math.random() * GRID_SIZE + 1)
    }

}
