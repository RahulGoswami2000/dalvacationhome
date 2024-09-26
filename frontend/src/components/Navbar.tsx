/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Accountcontext } from "../context/Account";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar: React.FC = () => {
  const { getSession, logout, getCurrentUserDetails } =
    useContext(Accountcontext);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  console.log(loggedIn);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const [currentUserDetails, setCurrentUserDetails] = useState<any>("");

  const getCurrentUser = async () => {
    const currentUser = (await getSession()).getAccessToken().payload;
    const userDetail = await getCurrentUserDetails(currentUser.sub);

    setCurrentUserDetails(userDetail);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Navigate to login page
      setLoggedIn(false);
      toast.success("You have been logged out. Please login again."); // Show success toast message
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  React.useEffect(() => {
    getSession()
      .then(() => {
        setLoggedIn(true);
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, [getSession]);

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-white border-b border-gray-200 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-20 items-center">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition duration-300">
          <Link to="/">DAL</Link>
        </h2>
      </div>
      <div className="hidden sm:flex sm:items-center space-x-6">
        {!loggedIn ? (
          <>
            <Link
              to="/login"
              className="text-blue-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/concerns"
              className="text-blue-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition duration-300"
            >
              {currentUserDetails === "user" ? "Raise a Concern" : "Raised Concerns"}
            </Link>
            {currentUserDetails.role === "property_agent" && (
              <>
                <Link
                  to="/addroom"
                  className="text-blue-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition duration-300"
                >
                  Add Room
                </Link>
                <Link
                  to="/user-statistics"
                  className="text-blue-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition duration-300"
                >
                  Statistics
                </Link>
              </>
            )}
            {currentUserDetails.role === "user" && (
              <Link
                to="/bookingHistory"
                className="text-blue-700 hover:text-blue-600 px-4 py-2 rounded-md text-lg font-medium transition duration-300"
              >
                Booking History
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
