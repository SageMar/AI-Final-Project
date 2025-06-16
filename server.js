import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import multer from 'multer';
import fs from 'fs';
import { OpenAI } from 'openai';

dotenv.config();
console.log(dotenv.config.AZURE_ENDPOINT)

const groq = new OpenAI({
  apiKey: process.env.GROQ_KEY, 
  baseURL: 'https://api.groq.com/openai/v1',
});

const app = express();
// saves our images temporarilly
const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use(express.static("./public"));

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.post('/analyze', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);

    const predictionKey = process.env.KEY;
    const endpoint = process.env.AZURE_ENDPOINT;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Prediction-Key': predictionKey,
                'Content-Type': 'application/octet-stream'
            },
            body: imageBuffer
        });

        const result = await response.json();
        res.json(result);
    } catch (err) {
        console.error('Azure call failed:', err);
        res.status(500).json({ error: 'Prediction failed' });
    } finally {
        fs.unlinkSync(imagePath); 
    }
});

app.post('/treatment', async (req, res) => {
    const { diagnosis } = req.body;

    if (!diagnosis) {
        return res.status(400).json({
            error: 'No diagnosis found, please try again.'
        });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [
                {
                    role: 'system',
                    content: `You are a botanist giving helpful tips on how to treat a plant disease. 
                    You should respond in this format <li>tip1</li><li>tip2</li> and so on, 
                    with no extra wordage. If the diagnosis has the word 'healthy' within it, 
                    simply respond "Congratulations, your plant doesn't need anything right now!"`
                },
                {
                    role: 'user',
                    content: `I have a ${diagnosis}. What are three things I can do to treat it?`
                },
            ],
        });

        const tips = completion.choices[0].message.content.trim();
        res.json({tips});
    } catch (error) {
        console.error("Groq API error" + error);
        res.status(500).json({
            error: 'Treatment request failed.'
        });
    }
})

app.listen(3000, () => console.log("Server started on port 3000"));