const express = require('express');
const { addBook, getBooks, upload  } = require('../controllers/bookController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// POST requires login, GET is public
router.route('/')
  .post(protect, upload.single('image'), addBook)
  .get(protect, getBooks);

  


module.exports = router;
