import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
  console.error("❌ PEXELS_API_KEY missing in .env");
  process.exit(1);
}

const categories = {
  shirts: "men shirt fashion",
  shoes: "sports shoes product",
  watches: "wrist watch product",
  bottles: "water bottle product"
};

const fetchImages = async () => {
  for (const category in categories) {
    console.log(`🔍 Fetching ${category} images...`);

    const res = await axios.get(
      "https://api.pexels.com/v1/search",
      {
        headers: {
          Authorization: API_KEY
        },
        params: {
          query: categories[category],
          per_page: 30
        }
      }
    );

    const urls = res.data.photos.map(p => p.src.large);

    fs.writeFileSync(
      `backend/data/${category}-images.json`,
      JSON.stringify(urls, null, 2)
    );

    console.log(`✅ ${category}: ${urls.length} images saved`);
  }

  console.log("🎉 ALL IMAGES FETCHED SUCCESSFULLY");
};

fetchImages().catch(err => {
  console.error("❌ ERROR:", err.response?.data || err.message);
});
