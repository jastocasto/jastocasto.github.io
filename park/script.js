const colorsArchitecture = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', '#33FFF6', '#FF8C33', '#FFD133',
    '#FF33C8', '#33FF8C', '#FF335E', '#FF5733', '#5E33FF', '#33FFF3', '#8C33FF', '#FF334D',
    '#FF5733', '#FF8C33', '#33FFAA', '#FF338C', '#FF5733', '#33FF66', '#5733FF', '#FF33BB',
    '#33FFDC', '#3357FF', '#FF3357', '#57FF33', '#33FFBB', '#FF335A', '#33FFAA', '#FF5733',
    '#FF33BB', '#33FF33', '#3357FF', '#FF5733', '#33FF88', '#FF3388', '#FF5733', '#33FFA6'
];

const colorsDesign = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#FF00FF', '#FA67F8',
    '#012A00', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#FF00FF', '#FA67F8',
    '#FF00FF', '#FFFFFF', '#FF00FF', '#FA67F8'
];

const colorsPoetry = [
    '#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460', '#DEB887',
    '#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460', '#DEB887',
    '#8B4513', '#A0522D', '#D2691E'
];

const colorsArt = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', '#33FFF6', '#FF8C33', '#FFD133',
    '#FF33C8', '#33FF8C', '#FF335E', '#FF5733', '#5E33FF', '#33FFF3', '#8C33FF', '#FF334D',
    '#FF5733', '#FF8C33', '#33FFAA', '#FF338C'
];

const colorsInfo = []; // No colors needed for the Info page

// Detect the current page and assign the correct colors and square count
let colors = colorsArchitecture;
let totalSquares = 40;

if (window.location.href.includes('design.html')) {
    colors = colorsDesign;
    totalSquares = 20;
} else if (window.location.href.includes('art.html')) {
    colors = colorsArt;
    totalSquares = 20; // Adjusted to match the number of colors in colorsArt
} else if (window.location.href.includes('poetry.html')) {
    colors = colorsPoetry;
    totalSquares = 15;
} else if (window.location.href.includes('info.html')) {
    // Ensure the background color is applied
    document.body.style.backgroundColor = '#498B6D';
    totalSquares = 0; // No squares to display on the Info page
}

// Handle active state for the links
const wordLinks = document.querySelectorAll('.word-link');
wordLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// Main functionality
if (totalSquares > 0) {
    const imageContainer = document.getElementById('image-container');
    let displayedSquares = [];
    let currentIndex = 0;
    let lastX = null;
    let lastY = null;

    let threshold = 20;  // Initial threshold
    const thresholdIncrements = [20, 40, 80, 160, 240];

    const counter = document.getElementById('counter');
    const thresholdValue = document.getElementById('threshold-value');
    const decreaseButton = document.getElementById('decrease-threshold');
    const increaseButton = document.getElementById('increase-threshold');

    updateCounter();  // Initialize counter
    updateThreshold();  // Initialize threshold display

    document.addEventListener('mousemove', (event) => {
        if (lastX === null || lastY === null) {
            // Initial mouse position
            lastX = event.clientX;
            lastY = event.clientY;
        }

        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= threshold) {  // Adjust distance to threshold value
            const steps = Math.floor(distance / threshold);
            const xStep = dx / steps;
            const yStep = dy / steps;

            for (let i = 0; i < steps; i++) {
                const newX = lastX + xStep * (i + 1);
                const newY = lastY + yStep * (i + 1);

                // Create a new square element
                const square = document.createElement('div');
                square.className = 'color-square';
                square.style.backgroundColor = colors[currentIndex];
                square.style.left = `${newX - 100}px`;  // Adjust to center the square on the mouse
                square.style.top = `${newY - 100}px`;
                imageContainer.appendChild(square);
                displayedSquares.push(square);

                // Show the square
                square.style.display = 'block';

                // Loop back to the first color after the last one
                currentIndex = (currentIndex + 1) % totalSquares;

                // Update the counter
                updateCounter();

                // Remove squares if more than 10 are displayed
                if (displayedSquares.length > 10) {
                    const oldSquare = displayedSquares.shift();
                    imageContainer.removeChild(oldSquare);
                }
            }

            lastX = event.clientX;
            lastY = event.clientY;
        }
    });

    // Function to update the counter display
    function updateCounter() {
        counter.textContent = `${String(currentIndex + 1).padStart(3, '0')}/${String(totalSquares).padStart(3, '0')}`;
    }

    // Function to update the threshold display
    function updateThreshold() {
        thresholdValue.textContent = String(threshold).padStart(4, '0');

        decreaseButton.disabled = (threshold === thresholdIncrements[0]);
        increaseButton.disabled = (threshold === thresholdIncrements[thresholdIncrements.length - 1]);
    }

    // Decrease threshold
    decreaseButton.addEventListener('click', () => {
        const currentIndex = thresholdIncrements.indexOf(threshold);
        if (currentIndex > 0) {
            threshold = thresholdIncrements[currentIndex - 1];
            updateThreshold();
        }
    });

    // Increase threshold
    increaseButton.addEventListener('click', () => {
        const currentIndex = thresholdIncrements.indexOf(threshold);
        if (currentIndex < thresholdIncrements.length - 1) {
            threshold = thresholdIncrements[currentIndex + 1];
            updateThreshold();
        }
    });
}
