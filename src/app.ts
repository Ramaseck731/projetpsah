import express from "express";
import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import { router as authRoutes } from "./routes/auth.js";
import swaggerUi from "swagger-ui-express";
import yamljs from "yamljs";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Recréer __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_API = process.env.PREFIX_URI;

const PORT = process.env.PORT ; 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use(`${BASE_API}`, authRoutes);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



