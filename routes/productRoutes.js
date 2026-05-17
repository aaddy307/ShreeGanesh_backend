const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    console.log('[UPLOAD MIDDLEWARE] err:', err);
    console.log('[UPLOAD MIDDLEWARE] req.file:', req.file);
    console.log('[UPLOAD MIDDLEWARE] req.body:', req.body);
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.get('/', getProducts);
router.get('/count', getProductCount);
router.get('/:id', getProductById);

router.post('/', protect, admin, uploadMiddleware, createProduct);
router.put('/:id', protect, admin, uploadMiddleware, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;