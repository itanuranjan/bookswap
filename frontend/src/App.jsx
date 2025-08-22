import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookList from "./pages/BookList";
import AddBook from "./pages/AddBook";
import RequestsPage from "./pages/RequestsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { loginSuccess, setLoading } from "./redux/authSlice";
import axiosInstance from "./api/axiosInstance";
import { useEffect } from "react";

// PrivateRoute handles loading
const PrivateRoute = ({ children }) => {
  const { isLogin, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return isLogin ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isLogin, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  // Hide header/footer on login & signup
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        dispatch(loginSuccess(response.data));
      } catch (error) {
        console.error("profile get failed:", error);
        dispatch(setLoading(false));
      }
    };
    checkLogin();
  }, [dispatch]);

  // Show loader if still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className="flex-grow">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{ duration: 3000 }}
        />
        <Routes>
          <Route
            path="/"
            element={
              isLogin ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<PrivateRoute><BookList /></PrivateRoute>} />
          <Route path="/booklist" element={<PrivateRoute><BookList /></PrivateRoute>} />
          <Route path="/bookrequest" element={<PrivateRoute><RequestsPage /></PrivateRoute>} />
          <Route path="/addbook" element={<PrivateRoute><AddBook /></PrivateRoute>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
