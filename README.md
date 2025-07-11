# AI-Final-Project

## Authors:
- Sage Markwardt

## Project Slides
https://docs.google.com/presentation/d/18UXxXwkLLTuN8jZrJv0m4LWG8YPt3D6X-1Y9w1ITw_g/edit?slide=id.g36710955293_0_13#slide=id.g36710955293_0_13

## Setup

To run this project, first run the following command:

```npm install express cors dotenv multer openai```

Then open a terminal and run

```npm run dev ```
 
This will open the site on http://localhost:3000/

## Project Structure Overview
AI-Final-Project/  
│  
├── public/                   # Static frontend files served by Express  
│   ├── index.html            # Main HTML file for UI  
│   ├── style.css             # Styling of the page  
│   └── script.js             # Frontend JavaScript for UI interactions  
│  
├── uploads/                 # Temporary storage for uploaded images   
│  
├── server.js                # File where the backend work and AI interaction happens, treatment routes exist here  
├── .env                     # Environment variables (API keys, endpoints)  
├── .gitignore               # Files and folders to ignore in version control  
├── package.json             # Project dependencies and metadata  
├── README.md                # Project documentation  
│  
└── node_modules/            # auto-generated by Express  

## API Integration

This project integrates two major APIs — GROQ and Azure Cognitive Services — to provide AI-powered diagnosis and treatment suggestions for plant health.

### Azure Custom Vision API

Used to analyze uploaded plant images and extract health-related predictions.

    Endpoint: Stored in .env as AZURE_ENDPOINT

    Datasets: https://www.kaggle.com/datasets/emmarex/plantdisease, https://www.kaggle.com/datasets/dixitakhilesh/plant-disease-dataset

    Key: Stored as KEY

    Request Format: POST with application/octet-stream

    Upload Handling: Uses multer to temporarily store images in uploads/

    API Endpoint:
    POST /analyze
    Accepts an image file and returns JSON prediction data.

### GROQ LLM API

Used to generate treatment tips based on the diagnosis returned from Azure Custom Vision.

    Endpoint: https://api.groq.com/openai/v1

    Model Used: llama3-8b-8192

    API Key: Stored in .env as GROQ_KEY

    Prompt:

        Uses a system prompt to instruct the model to return treatment tips as <li> elements.

        If the word "healthy" appears in the diagnosis, a congratulatory message is returned without treatment suggestions.

    API Endpoint:
    POST /treatment
    Accepts a diagnosis string in JSON and returns HTML-formatted treatment tips.

## Capabilities and Limitations

This app has a limited dataset of 22 different plant types and 9 different diseases. Often with plants, what looks like a disease may be a nutrient deficiency. This will not be covered by the AI and it could try to match the deficiency to one of the 9 diseases instead. 

A more comprehensive dataset for training would make this tool work much better, as it is the user should be fairly certain what they have is indeed a disaese and not some other ailment. This makes the app most useful for a semi-seasoned gardener. 

Treatments are not able to be tailored and are currently working off an AI which is not fine-tuned for this purpose, they should be taken with a grain of salt. 

### Future Improvements
A more expanded dataset would be the most noticeable improvement for this application. Important things to add in would be environmental stress issues (i.e. sunburn), pests (i.e. aphids) and nutrient deficiencies (i.e. pale leaves from lack of nitrogen).

Data for the genAI would be a nice addition so it could be fine tuned on what are appropriate treatments.
The ability to tailor treatment to the users preferences / location. Even just organic vs. non-organic options.

Mobile version to make taking photos and uploading them easier. 

Accessibility additions like screen-reader and keyboard navigation.




