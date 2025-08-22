import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import notImagefound from "../assets/image_not_available.png";

const BookList = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | my | other

  // Fetch books based on filter
  const fetchBooks = async (type = "all") => {
    try {
      let url = "/books";
      if (type === "my" || type === "other") {
        url = `/books?type=${type}`;
      }
      const response = await axiosInstance.get(url);
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks(filter);
  }, [filter]);

  // Handle request creation
  const handleRequestBook = async () => {
    if (!selectedBook) return;

    try {
      setLoading(true);
      await axiosInstance.post("/requests", { bookId: selectedBook._id });
      toast.success(`Requested "${selectedBook.title}" successfully!`);
      setSelectedBook(null);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request book");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📚 Available Books
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => setFilter("all")}
        >
          All Books
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "my" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => setFilter("my")}
        >
          My Books
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "other" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => setFilter("other")}
        >
          Other Users' Books
        </button>
      </div>

      {/* Book Grid */}
      {books.length === 0 ? (
        <p className="text-center text-gray-600">No books available</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book._id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition duration-300 cursor-pointer ${
                book.user._id === userId ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl"
              }`}
              onClick={() => {
                if (book.user._id !== userId) setSelectedBook(book);
              }}
            >
              <img
                src={book?.image || notImagefound}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  ✍️ Author: <span className="font-medium">{book.author}</span>
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  📖 Condition: <span className="font-medium">{book.condition}</span>
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  👤 Posted by: <span className="font-medium">{book.user?.name}</span>
                </p>
                {book.user._id === userId && (
                  <p className="text-red-500 text-sm mt-1">This is your book</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  ⏰ {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedBook(null)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Request Book</h2>
            <p className="mb-4">
              Are you sure you want to request <strong>{selectedBook.title}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setSelectedBook(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleRequestBook}
                disabled={loading}
              >
                {loading ? "Requesting..." : "Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
