export const addProduct = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    // ✅ USE PLURAL CATEGORIES
    const folderMap = {
      shirts: "products/shirts",
      shoes: "products/shoes",
      watches: "products/watches",
      bottles: "products/bottles",
    };

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: folderMap[category],
    });

    fs.unlinkSync(req.file.path);

    const product = await Product.create({
      name,
      category, // shirts | shoes | watches | bottles
      price,
      quantity: 30,
      description,
      image: result.secure_url,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

