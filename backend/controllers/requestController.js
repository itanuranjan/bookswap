const Request = require('../models/Request');
const Book = require('../models/Book');

// Create request (existing)
const createRequest = async (req, res) => {
  const { bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Prevent requesting own book
    if (book.user.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot request your own book" });
    }
    const request = await Request.create({
      book: bookId,
      requester: req.user.id,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (existing)
const updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Requests I made
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.id })
      .populate("book", "title author image user");

    const host = `${req.protocol}://${req.get('host')}`;

    const requestsWithFullImageUrl = requests.map((reqItem) => {
      const book = reqItem.book.toObject();
      if (book.image && !book.image.startsWith('http')) {
        book.image = `${host}${book.image}`;
      }
      return {
        ...reqItem.toObject(),
        book,
      };
    });

    res.json(requestsWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Requests made to me
// Requests made to me
const getReceivedRequests = async (req, res) => {
  try {
    // Find all my books
    const myBooks = await Book.find({ user: req.user.id }).select("_id");
    const myBookIds = myBooks.map((b) => b._id);

    const requests = await Request.find({ book: { $in: myBookIds } })
      .populate("book", "title author image user")
      .populate("requester", "name email"); // requester info

    const host = `${req.protocol}://${req.get('host')}`;

    const requestsWithFullImageUrl = requests.map((reqItem) => {
      const book = reqItem.book.toObject();
      if (book.image && !book.image.startsWith('http')) {
        book.image = `${host}${book.image}`;
      }
      return {
        ...reqItem.toObject(),
        book,
      };
    });

    res.json(requestsWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createRequest,
  updateRequestStatus,
  getMyRequests,
  getReceivedRequests,
};
