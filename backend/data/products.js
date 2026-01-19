const products = [];

// SHIRTS (30)
for (let i = 1; i <= 30; i++) {
  products.push({
    name: `Men Casual Shirt ${i}`,
    category: "shirt",
    price: 15 + i,
    quantity: 30,
    description: "Premium cotton casual shirt",
    image: `https://res.cloudinary.com/demo/image/upload/shirt${i}.jpg`
  });
}

// SHOES (30)
for (let i = 1; i <= 30; i++) {
  products.push({
    name: `Running Shoes ${i}`,
    category: "shoe",
    price: 40 + i,
    quantity: 30,
    description: "Comfortable running shoes",
    image: `https://res.cloudinary.com/demo/image/upload/shoe${i}.jpg`
  });
}

// WATCHES (30)
for (let i = 1; i <= 30; i++) {
  products.push({
    name: `Analog Watch ${i}`,
    category: "watch",
    price: 60 + i,
    quantity: 30,
    description: "Stylish analog wrist watch",
    image: `https://res.cloudinary.com/demo/image/upload/watch${i}.jpg`
  });
}

// BOTTLES (30)
for (let i = 1; i <= 30; i++) {
  products.push({
    name: `Steel Water Bottle ${i}`,
    category: "bottle",
    price: 10 + i,
    quantity: 30,
    description: "Leak proof steel bottle",
    image: `https://res.cloudinary.com/demo/image/upload/bottle${i}.jpg`
  });
}

export default products;
