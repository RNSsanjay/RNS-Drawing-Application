document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const opacity = document.getElementById('opacity');
    const shapeSelector = document.getElementById('shapeSelector');
    const brushType = document.getElementById('brushType');
    const clearButton = document.getElementById('clearCanvas');
    const saveCanvasButton = document.getElementById('saveCanvas');
    const loadCanvasButton = document.getElementById('loadCanvas');
    const toggleDarkMode = document.getElementById('toggleDarkMode');
    const toggleNav = document.getElementById('toggleNav');
    const sideNav = document.getElementById('sideNav');
    const closeNavButton = document.getElementById('closeNav');
    const eraserButton = document.getElementById('eraserButton');  // New eraser button

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0; // Store initial mouse position for shapes
    let currentColor = colorPicker.value;
    let currentBrushSize = parseInt(brushSize.value, 10);
    let currentOpacity = parseFloat(opacity.value);
    let currentShape = shapeSelector.value;
    let currentBrushType = brushType.value;
    let isEraserMode = false; // Track if eraser mode is active

    // Set initial properties
    ctx.globalAlpha = currentOpacity;
    ctx.lineJoin = 'round'; // For smooth joins, especially useful for round brush
    ctx.lineCap = currentBrushType; // Start with the selected brush type (round or square)

    // Load dark mode state from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        toggleDarkMode.textContent = '☀️'; // Sun icon when dark mode is enabled
    } else {
        document.body.classList.remove('dark-mode');
        toggleDarkMode.textContent = '🌙'; // Moon icon for light mode
    }

    // Load previous canvas state (saved image) if available
    const savedCanvas = localStorage.getItem('savedCanvas');
    if (savedCanvas) {
        const img = new Image();
        img.src = savedCanvas;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    }

    // Event listeners for drawing on canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
        startX = e.offsetX;
        startY = e.offsetY; // Store initial mouse position when starting a shape
    }

    function draw(e) {
        if (!isDrawing) return;

        ctx.strokeStyle = isEraserMode ? "#ffffff" : currentColor;  // Use white color for eraser mode
        ctx.lineWidth = currentBrushSize;

        // Drawing shapes based on selected shape
        if (currentShape === 'free') {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if (currentShape === 'line') {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for line drawing only
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if (currentShape === 'rectangle') {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for rectangle drawing only
            let width = e.offsetX - startX;
            let height = e.offsetY - startY;
            ctx.beginPath();
            ctx.rect(startX, startY, width, height);
            ctx.stroke();
        } else if (currentShape === 'circle') {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for circle drawing only
            let radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Update drawing settings based on user input
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
    });

    brushSize.addEventListener('input', (e) => {
        currentBrushSize = e.target.value;
    });

    opacity.addEventListener('input', (e) => {
        currentOpacity = e.target.value;
        ctx.globalAlpha = currentOpacity;
    });

    shapeSelector.addEventListener('change', (e) => {
        currentShape = e.target.value;
    });

    brushType.addEventListener('change', (e) => {
        currentBrushType = e.target.value;
        ctx.lineCap = currentBrushType;  // Update the brush type when selected
    });

    // Eraser functionality
    eraserButton.addEventListener('click', () => {
        isEraserMode = !isEraserMode;
        // Change button text to indicate the current mode
        eraserButton.textContent = isEraserMode ? "✏️" : "Erase"; // Change button to "Erase" when in drawing mode
    });

    // Clear canvas
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save canvas as image
    saveCanvasButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.png';
        link.click();

        // Save the drawing to localStorage as well
        localStorage.setItem('savedCanvas', dataURL);
    });

    // Load canvas from saved image
    loadCanvasButton.addEventListener('click', () => {
        const dataURL = localStorage.getItem('savedCanvas');
        if (dataURL) {
            const img = new Image();
            img.src = dataURL;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        } else {
            alert('No saved canvas found.');
        }
    });

    // Toggle dark mode
    toggleDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Save dark mode state to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'true');
            toggleDarkMode.textContent = '☀️'; // Change icon to sun for light mode
        } else {
            localStorage.setItem('darkMode', 'false');
            toggleDarkMode.textContent = '🌙'; // Change icon to moon for dark mode
        }
    });

    // Toggle navigation bar
    toggleNav.addEventListener('click', () => {
        sideNav.classList.toggle('open');
    });

    closeNavButton.addEventListener('click', () => {
        sideNav.classList.remove('open');
    });
});
