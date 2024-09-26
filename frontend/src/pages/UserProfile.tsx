import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import { Accountcontext } from "../context/Account";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile: React.FC = () => {
  const { getSession, logout } = useContext(Accountcontext);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      try {
        const session = await getSession();
        const email = session.getIdToken().payload.email;
        
        const response = await axios.get(`https://yrvee3xkzb.execute-api.us-east-1.amazonaws.com/dev/user/getuser?email=${email}`);
        setUserProfile(response.data); // Assuming response.data contains name and email
        setError('');
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Error fetching user profile');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [getSession]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserProfile(null); // Clear user profile state after logout
      navigate('/login'); // Navigate to login page
      toast.success('You have been logged out. Please login again.'); // Show success toast message
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userProfile) {
    return <p>No user profile found.</p>;
  }

  return (
    <div className="ml-4 p-4">
     
      <h3 className="text-lg font-bold mb-4">User Profile</h3>
      <div>
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        {/* Additional fields as needed */}
        <button onClick={handleLogout} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
          Logout
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserProfile;
