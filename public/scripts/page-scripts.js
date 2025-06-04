document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submitImage").addEventListener("click", submitImageToAI);
});

/*
Preview image after upload, before submitting
*/
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const previewImg = document.getElementById("preview");

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
    document.getElementById("submitImage").addEventListener("click", submitImageToAI);
});

async function submitImageToAI() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
    if (!file) return alert("Please upload an image.");

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
    });

    const data = await res.json();
    resultBox.innerText = JSON.stringify(data, null, 2);

    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Prediction result:', data);
        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error during prediction:', error);
        alert('Prediction failed. See console for details.');
    });
}

