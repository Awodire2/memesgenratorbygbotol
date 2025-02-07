const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
let image = new Image();
let texts = [];
let draggingText = null;

// Load image when file is selected
imageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Function to redraw canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    texts.forEach(text => {
        ctx.font = `${text.weight} ${text.size}px Arial`;
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, text.x, text.y);
    });
}

// Add text
const addTextButton = document.getElementById("addText");
addTextButton.addEventListener("click", function () {
    const textInput = document.getElementById("text").value;
    const textColor = document.getElementById("textColor").value;
    const fontSize = document.getElementById("fontSize").value;
    const fontWeight = document.getElementById("fontWeight").value;
    
    if (textInput.trim() !== "") {
        texts.push({
            text: textInput,
            x: 50,
            y: 50 + texts.length * 40,
            color: textColor,
            size: fontSize,
            weight: fontWeight
        });
        redrawCanvas();
    }
});

// Move text
canvas.addEventListener("mousedown", function (event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    texts.forEach(text => {
        if (mouseX >= text.x && mouseX <= text.x + ctx.measureText(text.text).width && 
            mouseY >= text.y - parseInt(text.size) && mouseY <= text.y) {
            draggingText = text;
        }
    });
});

canvas.addEventListener("mousemove", function (event) {
    if (draggingText) {
        draggingText.x = event.offsetX;
        draggingText.y = event.offsetY;
        redrawCanvas();
    }
});

canvas.addEventListener("mouseup", function () {
    draggingText = null;
});

// Generate meme with notification
const generateButton = document.getElementById("generateMeme");
generateButton.addEventListener("click", function () {
    alert("Meme generated successfully! Ready for downloading.");
});

// Download meme
const downloadButton = document.getElementById("downloadMeme");
downloadButton.addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
});
