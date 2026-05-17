require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { upload } = require('./config/cloudinary');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test upload endpoint
app.post('/api/test-upload', (req, res) => {
  console.log('TEST UPLOAD - headers:', req.headers['content-type']);
  upload.single('image')(req, res, (err) => {
    console.log('TEST UPLOAD - after multer, err:', err);
    console.log('TEST UPLOAD - after multer, req.file:', req.file);
    console.log('TEST UPLOAD - after multer, req.body:', req.body);
    res.json({ file: req.file ? { name: req.file.originalname } : null, body: req.body });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});