const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");

const widthSlider = document.getElementById("widthSlider");
const heightSlider = document.getElementById("heightSlider");
const widthLabel = document.getElementById("widthLabel");
const heightLabel = document.getElementById("heightLabel");
const aspectLabel = document.getElementById("aspectLabel");
const aspectPreset = document.getElementById("aspectPreset");
const areaInput = document.getElementById("areaInput");
const areaSlider = document.getElementById("areaSlider");
const imageInput = document.getElementById("imageInput");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const swapBtn = document.getElementById("swapBtn");
const copyWidthBtn = document.getElementById("copyWidthBtn");
const copyHeightBtn = document.getElementById("copyHeightBtn");
const areaSpan = document.getElementById("areaSpan");
const widthSpan = document.getElementById("widthSpan");
const heightSpan = document.getElementById("heightSpan");

let totalPixels = 1048576;
let uploadedImage = null;

function updatePreview(w, h) {
    const scale = Math.min(canvas.width / w, canvas.height / h);
    const scaledW = w * scale;
    const scaledH = h * scale;
    const offsetX = (canvas.width - scaledW) / 2;
    const offsetY = (canvas.height - scaledH) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, uploadedImage.width, uploadedImage.height, 0, 0, canvas.width, canvas.height);
    }

    // Draw a rectangle
    ctx.strokeStyle = "#FF0000";
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.lineWidth = 2;
    ctx.fillRect(offsetX, offsetY, scaledW, scaledH);
    ctx.strokeRect(offsetX, offsetY, scaledW, scaledH);

    areaSpan.textContent = `${totalPixels} (${Math.sqrt(totalPixels)})`;
    widthSpan.textContent = `${w}`;
    heightSpan.textContent = `${h}`;
}

function updateByWidth(newWidth) {
    const newHeight = Math.min(Math.round(totalPixels / newWidth), 2048);
    widthSlider.value = newWidth;
    heightSlider.value = newHeight;
    widthInput.value = newWidth;
    heightInput.value = newHeight;
    areaSlider.value = totalPixels;
    aspectLabel.textContent = (newWidth / newHeight).toFixed(2);
    updatePreview(newWidth, newHeight);
}

function updateByHeight(newHeight) {
    const newWidth = Math.min(Math.round(totalPixels / newHeight), 2048);
    heightSlider.value = newHeight;
    widthSlider.value = newWidth;
    heightInput.value = newHeight;
    widthInput.value = newWidth;
    areaSlider.value = totalPixels;
    aspectLabel.textContent = (newWidth / newHeight).toFixed(2);
    updatePreview(newWidth, newHeight);
}

function reset() {
    totalPixels = 1048576;
    areaInput.value = totalPixels;
    updateByWidth(1024);
    aspectPreset.value = "";
}

widthSlider.addEventListener("input", () => {
    const value = parseInt(widthSlider.value);
    widthInput.value = value;
    updateByWidth(value);
});
widthInput.addEventListener("input", () => {
    const value = parseInt(widthInput.value);
    if (!isNaN(value) && value > 0) {
        widthSlider.value = value;
        updateByWidth(value);
    }
});

heightSlider.addEventListener("input", () => {
    const value = parseInt(heightSlider.value);
    heightInput.value = value;
    updateByHeight(value);
});

heightInput.addEventListener("input", () => {
    const value = parseInt(heightInput.value);
    if (!isNaN(value) && value > 0) {
        heightSlider.value = value;
        updateByHeight(value);
    }
});


aspectPreset.addEventListener("change", () => {
    const val = aspectPreset.value;
    if (!val) return;
    const [wRatio, hRatio] = val.split("/").map(Number);
    const newHeight = Math.sqrt(totalPixels / (wRatio / hRatio));
    const newWidth = totalPixels / newHeight;
    updateByWidth(Math.round(newWidth));
});

areaSlider.addEventListener("input", () => {
    const newArea = parseInt(areaSlider.value);
    totalPixels = newArea;
    areaInput.value = newArea;
    const aspect = parseInt(widthSlider.value) / parseInt(heightSlider.value);
    const newHeight = Math.min(Math.round(Math.sqrt(totalPixels / aspect)), 2048);
    const newWidth = Math.min(Math.round(totalPixels / newHeight), 2048);
    updateByWidth(newWidth);
});

areaInput.addEventListener("input", () => {
    const newArea = parseInt(areaInput.value);
    if (!isNaN(newArea) && newArea > 0) {
        totalPixels = newArea;
        areaSlider.value = newArea; // <- нове
        const aspect = parseInt(widthSlider.value) / parseInt(heightSlider.value);
        const newHeight = Math.min(Math.round(Math.sqrt(totalPixels / aspect)), 2048);
        const newWidth = Math.min(Math.round(totalPixels / newHeight), 2048);
        updateByWidth(newWidth);
    }
});


imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            uploadedImage = img;
            updateByWidth(parseInt(widthSlider.value));
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

swapBtn.addEventListener("click", () => {
    const currentWidth = parseInt(widthInput.value);
    const currentHeight = parseInt(heightInput.value);

    if (!isNaN(currentWidth) && !isNaN(currentHeight) && currentWidth > 0 && currentHeight > 0) {
        // We swap
        updateByWidth(currentHeight); // Set width as previous height
    }
});

copyWidthBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(widthInput.value)
});

copyHeightBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(heightInput.value)
});


// Initial state
updateByWidth(1024);