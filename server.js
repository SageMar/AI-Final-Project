import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import multer from 'multer';
import fs from 'fs';

dotenv.config();
console.log(dotenv.config.AZURE_ENDPOINT)

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

app.listen(3000, () => console.log("Server started on port 3000"));