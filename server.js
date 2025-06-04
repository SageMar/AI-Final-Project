import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' }); // Save uploads temporarily

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use(express.static("./public"));

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const imageBuffer = fs.readFileSync(filePath);

        const response = await axios.post(
            process.env.AZURE_ENDPOINT + 'computervision/imageanalysis:analyze?api-version=2023-02-01-preview',
            imageBuffer,
            {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': process.env.KEY,
                },
                params: {
                    features: 'caption,read',
                },
            }
        );

        // Cleanup the uploaded file
        fs.unlinkSync(filePath);

        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
});

app.listen(3000, () => console.log("Server started on port 3000"));