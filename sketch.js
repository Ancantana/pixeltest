document.addEventListener('DOMContentLoaded', function() {
    const captureVideo = document.getElementById('captureVideo');
    const textInput = document.getElementById('textInput');
    const asciiArtContainer = document.getElementById('asciiArtContainer');
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            captureVideo.srcObject = stream;
            captureVideo.onloadedmetadata = function() {
                canvas.width = captureVideo.videoWidth;
                canvas.height = captureVideo.videoHeight;
                captureVideo.play();
            };
        })
        .catch(function(error) {
            console.error("Error accessing the webcam: ", error);
        });

    textInput.addEventListener('input', function() {
        captureAndConvertFrame();
    });

    function captureAndConvertFrame() {
        context.drawImage(captureVideo, 0, 0, canvas.width, canvas.height);
        convertToAscii(context.getImageData(0, 0, canvas.width, canvas.height));
    }

    function convertToAscii(imageData) {
        let inputChars = textInput.value;
        if (inputChars.length === 0) inputChars = ' '; // Fallback to space if empty
        let charIndex = 0;

        asciiArtContainer.innerHTML = ''; // Clear existing content
        for (let i = 0; i < imageData.height; i += 10) {
            let line = '';
            for (let j = 0; j < imageData.width; j += 5) {
                const offset = (i * imageData.width + j) * 4;
                const red = imageData.data[offset];
                const green = imageData.data[offset + 1];
                const blue = imageData.data[offset + 2];
                const color = `rgb(${red},${green},${blue})`;

                const character = inputChars[charIndex % inputChars.length];
                line += `<span style="color: ${color};">${character}</span>`;

                charIndex++; // Move to next character in the input string
            }
            asciiArtContainer.innerHTML += line + '<br>';
        }
    }
});


