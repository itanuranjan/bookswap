const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage with auto-create folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/books');

    // Create folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// Add a new book
const addBook = async (req, res) => {
  const { title, author, condition } = req.body;
  const image = req.file ? `/uploads/books/${req.file.filename}` : null;
  

  try {
    const book = await Book.create({
      title,
      author,
      condition,
      image,
      user: req.user.id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get books with filter
const getBooks = async (req, res) => {
  try {
    const type = req.query.type; // "my", "other", or undefined
    let filter = {};

    if (type === "my") {
      if (!req.user) return res.status(401).json({ message: "Login required for 'my' books" });
      filter.user = req.user.id;
    } else if (type === "other") {
      if (!req.user) return res.status(401).json({ message: "Login required for 'other' books" });
      filter.user = { $ne: req.user.id };
    }
    // else "all" or undefined → no filter

    const books = await Book.find(filter).populate('user', 'name email');

    // Prepend full URL for uploaded images
    const host = `${req.protocol}://${req.get('host')}`;
    const booksWithFullImageUrl = books.map((book) => {
      return {
        ...book.toObject(),
        image: book.image && !book.image.startsWith('http')
          ? `${host}${book.image}`
          : book.image,
      };
    });

    res.json(booksWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addBook,
  upload,
  getBooks,
};
