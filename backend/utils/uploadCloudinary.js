import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";

/* ---------- LOAD ENV FIRST ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

/* ---------- HARD VALIDATION ---------- */
if (
  !process.env.CLOUD_NAME ||
  !process.env.CLOUD_KEY ||
  !process.env.CLOUD_SECRET
) {
  console.error("❌ Cloudinary ENV missing", {
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_KEY: process.env.CLOUD_KEY,
    CLOUD_SECRET: process.env.CLOUD_SECRET
  });
  process.exit(1);
}

/* ---------- CONFIGURE CLOUDINARY HERE ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

console.log("✅ Cloudinary configured");

/* ---------- UPLOAD ---------- */
const categories = ["shirts", "shoes", "watches", "bottles"];

const upload = async () => {
  for (const category of categories) {
    const filePath = path.join(__dirname, `../data/${category}-images.json`);
    const urls = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (let i = 0; i < urls.length; i++) {
      await cloudinary.uploader.upload(urls[i], {
        folder: `products/${category}`,
        public_id: `${category}${i + 1}`
      });
      console.log(`☁️ Uploaded ${category}${i + 1}`);
    }
  }
};

upload()
  .then(() => console.log("🎉 ALL IMAGES UPLOADED"))
  .catch(err => {
    console.error("❌ Upload failed:", err.message);
    process.exit(1);
  });



