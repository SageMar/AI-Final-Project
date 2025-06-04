document.addEventListener("DOMContentLoaded", () => {
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
}