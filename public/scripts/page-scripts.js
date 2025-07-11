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
        if (!file) {
            previewImg.style.display = "none";
            previewImg.src = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            previewImg.src = reader.result;
            previewImg.style.display = "block";
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

    // create a variable to hold our result to send again
    let topPrediction = '';



    const formData = new FormData();
    formData.append("image", file);

    const resultBox = document.getElementById('result');
    resultBox.innerHTML = `<span style="color:#388e3c;font-weight:500;">Analyzing...</span>`;

    const res = await fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(async data => {
        console.log('Prediction result:', data);
        // arrange the data nicely for the user
        topPrediction = data.predictions[0];

        let result = `
            <h3>Diagnosis</h3>
            <p>Your image appears to be a ${topPrediction.tagName}</p>
            `;
    

    // call on LLM for treatments
    const treatmentSuggestion = await fetch('/treatment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({diagnosis: topPrediction.tagName})
    });

    const treatmentData = await treatmentSuggestion.json();

    if (treatmentData.tips) {
        result += `
        <H3>Suggestions for Treatment:</h3>
        <ul>${treatmentData.tips}</ul>
        `;
    } else {
        result += `<p>No tips found.</p>`
    }
     document.getElementById('result').innerHTML = result;
}) .catch(error => {
        console.error('Error during prediction:', error);
        alert('Prediction failed.');
    });
}

