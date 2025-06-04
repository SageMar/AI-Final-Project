/*
Preview image after upload, before submitting
*/
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submitImage").addEventListener("click", submitImageToAI);
    const fileInput = document.getElementById("fileInput");
    const previewImg = document.getElementById("preview");
    const submitImage = document.getElementById("submitImage");

    // Show preview as soon as user selects a file
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            previewImg.src = reader.result;
        };
        reader.readAsDataURL(file); 
    });

    // Set up submit button to send to AI
    submitImage.addEventListener("click", submitImageToAI);
});

async function submitImageToAI() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if (!file) {
        return alert("Please upload an image.");
    }

    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById('preview').src = reader.result;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    const resultBox = document.getElementById('result');
    resultBox.innerText = "Analyzing...";

    const res = await fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Prediction result:', data);
        // arrange the data nicely for the user
        const topPrediction = data.predictions[0];

        const result = `
            <h3>Diagnosis</h3>
            <p>Your image appears to be a ${topPrediction.tagName}</p>
            <p>Confidence: ${(topPrediction.probability * 100).toFixed(1)}%</p>
            `;

        document.getElementById('result').innerHTML = result;
    })
    .catch(error => {
        console.error('Error during prediction:', error);
        alert('Prediction failed. See console for details.');
    });
}

