import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import notImagefound from "../assets/Image_not_available.png";

const RequestsPage = () => {
  const [tab, setTab] = useState("mine"); // "mine" | "received"
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async (type) => {
    try {
      setLoading(true);
      const url = type === "mine" ? "/requests/mine" : "/requests/received";
      const res = await axiosInstance.get(url);
      setRequests(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests(tab);
  }, [tab]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/requests/${id}`, { status });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
      toast.success("Status updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📚 SwapBook Requests
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "mine" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setTab("mine")}
        >
          Requested by Me
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "received" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setTab("received")}
        >
          Requested to Me
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-600">No requests found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl shadow-md overflow-hidden p-4"
            >
              <img
                src={req?.book?.image || notImagefound}
                alt={req.book.title}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{req.book.title}</h2>
              <p className="text-gray-600">Author: {req.book.author}</p>

              {tab === "mine" ? (
                <p className="text-gray-500 mt-1">
                  Status:{" "}
                  <span
                    className={
                      req.status === "pending"
                        ? "text-yellow-500"
                        : req.status === "accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {req.status}
                  </span>
                </p>
              ) : (
                <>
                  <p className="text-gray-500 mt-1">
                    Requested by: {req.requester.name} ({req.requester.email})
                  </p>
                  <p className="text-gray-500 mt-1">
                    Status:{" "}
                    <span
                      className={
                        req.status === "pending"
                          ? "text-yellow-500"
                          : req.status === "accepted"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {req.status}
                    </span>
                  </p>
                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-2 py-1 rounded bg-green-500 text-white"
                        onClick={() => handleUpdateStatus(req._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-red-500 text-white"
                        onClick={() => handleUpdateStatus(req._id, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </>
              )}

              <p className="text-gray-400 text-xs mt-2">
                Requested on: {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
