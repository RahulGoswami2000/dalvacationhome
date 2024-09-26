/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Accountcontext } from "../context/Account";

// Define the Room type
interface Booking {
  bookingRef: number;
  startDate: string;
  endDate: number;
  roomId: string[];
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<any>("");
  const context = useContext(Accountcontext);
  const navigate = useNavigate();

  const { getSession, getCurrentUserDetails } = context;

  const getCurrentUser = async () => {
    const currentUser = (await getSession()).getAccessToken().payload;
    const userDetail = await getCurrentUserDetails(currentUser.sub);

    setCurrentUserDetails(userDetail);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/bookings/user?userId=${currentUserDetails.email}`
      )
      .then((response) => {
        setBookings(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [currentUserDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
  <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-4xl">
    <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Your Bookings</h2>
    <table className="table-auto w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-200 px-6 py-4 text-blue-700">Booking Ref/ID</th>
          <th className="border border-gray-200 px-6 py-4 text-blue-700">Room ID</th>
          <th className="border border-gray-200 px-6 py-4 text-blue-700">Start Date</th>
          <th className="border border-gray-200 px-6 py-4 text-blue-700">End Date</th>
          <th className="border border-gray-200 px-6 py-4 text-blue-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((room, index) => (
          <tr key={index}>
            <td className="border border-gray-200 px-6 py-4">{room.bookingRef}</td>
            <td className="border border-gray-200 px-6 py-4">{room.roomId}</td>
            <td className="border border-gray-200 px-6 py-4">{room.startDate}</td>
            <td className="border border-gray-200 px-6 py-4">{room.endDate}</td>
            <td className="border border-gray-200 px-6 py-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => navigate(`/concerns`)}
              >
                Raise a Concern
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default BookingHistory;
