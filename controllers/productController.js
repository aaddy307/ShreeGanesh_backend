const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadToCloudinary } = require('../config/cloudinary');

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;

  console.log('=== CREATE PRODUCT DEBUG ===');
  console.log('req.body:', JSON.stringify(req.body));
  console.log('req.file:', req.file);
  console.log('req.file?.buffer:', req.file?.buffer ? 'exists' : 'none');
  console.log('===========================');

  if (!name || !category || !price || !description || !req.file) {
    res.status(400);
    throw new Error(`All fields are required - name:${!!name}, cat:${!!category}, price:${!!price}, desc:${!!description}, file:${!!req.file}`);
  }

  // Upload to Cloudinary from memory
  const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);

  const product = new Product({
    name,
    category,
    price: parseFloat(price),
    description,
    image: cloudinaryResult.secure_url,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = name || product.name;
  product.category = category || product.category;
  product.price = price ? parseFloat(price) : product.price;
  product.description = description || product.description;

  if (req.file) {
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    product.image = cloudinaryResult.secure_url;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

const getProductCount = asyncHandler(async (req, res) => {
  const count = await Product.countDocuments();
  res.json({ count });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
};