const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = 320;
canvas.height = 480;

// Bird settings
let birdX = 50;
let birdY = canvas.height / 2;
let birdWidth = 20;
let birdHeight = 20;
let gravity = 0.6;
let lift = -15;
let velocity = 0;

// Pipe settings
let pipes = [];
let pipeWidth = 40;
let pipeGap = 100;
let pipeSpeed = 2;
let score = 0;
let gameRunning = false;

// Get difficulty from settings
const difficultySelect = document.getElementById('difficulty');

// Get buttons
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

// Handle clicking anywhere on the screen to control the bird
canvas.addEventListener('click', function() {
    if (gameRunning) {
        velocity = lift;
    }
});

// Handle difficulty change
difficultySelect.addEventListener('change', function() {
    const difficulty = parseInt(this.value);
    if (difficulty === 1) { // Easy
        pipeSpeed = 2;
        pipeGap = 120;
    } else if (difficulty === 2) { // Medium
        pipeSpeed = 3;
        pipeGap = 100;
    } else if (difficulty === 3) { // Hard
        pipeSpeed = 4;
        pipeGap = 80;
    }
});

// Create Pipes
function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        passed: false
    });
}

// Update game
function update() {
    if (!gameRunning) return; // Pause the game if not running

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Prevent bird from falling off canvas
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight;
        velocity = 0;
    }

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Update pipes and check collision
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // Check for collision
        if (
            birdX + birdWidth > pipes[i].x &&
            birdX < pipes[i].x + pipeWidth &&
            (birdY < pipes[i].y || birdY + birdHeight > pipes[i].y + pipeGap)
        ) {
            // Collision detected - reset game
            resetGame();
            return;
        }

        // Check if the bird successfully passed a pipe
        if (!pipes[i].passed && pipes[i].x + pipeWidth < birdX) {
            pipes[i].passed = true;
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
        }

        // Remove pipes that go off screen
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = '#F00';  // Bird is red
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);

    // Draw pipes
    pipes.forEach(pipe => {
        ctx.fillStyle = '#0F0';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });
}

// Main game loop
function gameLoop() {
    update();
    render();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game
startButton.addEventListener('click', function() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop(); // Start the game loop
    }
});

// Stop the game
stopButton.addEventListener('click', function() {
    gameRunning = false; // Stop the game
});

// Reset the game
function resetGame() {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById('score').textContent = 'Score: ' + score;
    gameRunning = false;
}

// Start with game stopped
resetGame();
