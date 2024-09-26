
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";
import { parse, format, isAfter, isBefore, addDays } from "date-fns";
import { Accountcontext } from "../context/Account";

interface Booking {
  bookingRef: string;
  endDate: string;
  roomId: number;
  startDate: string;
  userId: string;
}

interface Feedback {
  fbId: string;
  userId: string;
  fb: string;
  roomId: string;
  attitude: string;
}

interface RoomDetail {
  roomId: number;
  roomType: string;
  roomPrice: number;
  roomFeatures: string[];
}

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [newFeedback, setNewFeedback] = useState<string>("");
  const [roomDetails, setRoomDetails] = useState<RoomDetail>();
  const [currentUserDetails, setCurrentUserDetails] = useState<any>("");
  const [bookingError, setBookingError] = useState<string>("");
  const [feedbackError, setFeedbackError] = useState<string>("");

  const context = useContext(Accountcontext);

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
    if (roomId) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get(
            `https://pmzftdpyy3mvsfgkrutvdwqgty0bxnlg.lambda-url.us-east-1.on.aws/?roomId=${roomId}`
          );
          setBookings(response.data.bookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };

      const fetchFeedbacks = async () => {
        try {
          const response = await axios.post(
            `https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/feedback/get`,
            {
              roomId: roomId,
            }
          );
          setFeedbacks(response.data.data);
        } catch (error) {
          console.error("Error fetching feedbacks:", error);
        }
      };

      const fetchRoomDetails = async () => {
        try {
          const response = await axios.post(
            "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/rooms/details",
            {
              roomId: Number(roomId),
            }
          );
          setRoomDetails(response.data.data[0]);
        } catch (error) {
          console.error("Error fetching room details:", error);
        }
      };
      fetchRoomDetails();
      fetchBookings();
      fetchFeedbacks();
    }
  }, [roomId]);

  const parseDate = (dateString: string) =>
    parse(dateString, "dd-MM-yyyy", new Date());

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && isAfter(date, endDate)) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date && startDate && isBefore(date, startDate)) {
      setStartDate(null);
    }
  };

  const getDisabledDates = () => {
    const disabledDates: Date[] = [];
    bookings.forEach((booking) => {
      const start = parseDate(booking.startDate);
      const end = parseDate(booking.endDate);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        disabledDates.push(new Date(d));
      }
    });
    return disabledDates;
  };

  const handleBookRoom = async () => {
    setBookingError("");

    if (!startDate || !endDate || !roomId) {
      setBookingError("Please select both start and end dates.");
      return;
    }

    if (isBefore(endDate, startDate)) {
      setBookingError("End date must be after start date.");
      return;
    }

    if (isBefore(startDate, new Date())) {
      setBookingError("Start date must be in the future.");
      return;
    }

    const bookingData = {
      userId: currentUserDetails.email,
      roomId: parseInt(roomId, 10),
      startDate: format(startDate, "dd-MM-yyyy"),
      endDate: format(endDate, "dd-MM-yyyy"),
    };

    try {
      await axios.post(
        "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/bookings/create",
        bookingData
      );
      navigate("/rooms");
    } catch (error) {
      console.error("Error booking room:", error);
      setBookingError("Failed to book room. Please try again.");
    }
  };

  const handleFeedbackChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewFeedback(event.target.value);
  };

  const handleAddFeedback = async () => {
    setFeedbackError("");

    if (!newFeedback.trim() || !roomId) {
      setFeedbackError("Please enter feedback before submitting.");
      return;
    }

    const feedbackData = {
      userId: currentUserDetails.email,
      roomId: roomId,
      feedback: newFeedback.trim(),
    };

    try {
      await axios.post(
        "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/feedback/add",
        feedbackData
      );
      setNewFeedback("");
      const response = await axios.post(
        `https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/feedback/get`,
        {
          roomId: roomId,
        }
      );
      setFeedbacks(response.data.data);
    } catch (error) {
      console.error("Error adding feedback:", error);
      setFeedbackError("Failed to add feedback. Please try again.");
    }
  };

  const getPolarityColor = (attitude: string) => {
    switch (attitude.toLowerCase()) {
      case "positive":
        return "bg-green-500";
      case "neutral":
        return "bg-yellow-500";
      case "negative":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">Room Details</h1>

      {roomDetails && (
        <div className="mb-10 p-8 border rounded-xl shadow-xl bg-white">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">
            Room ID: {roomDetails.roomId}
          </h2>
          <p className="mb-4 text-xl">
            <strong className="text-blue-600">Type:</strong>{" "}
            {roomDetails.roomType}
          </p>
          <p className="mb-4 text-xl">
            <strong className="text-blue-600">Price:</strong> $
            {roomDetails.roomPrice}
          </p>
          <p className="mb-4 text-xl">
            <strong className="text-blue-600">Features:</strong>{" "}
            {roomDetails.roomFeatures.join(", ")}
          </p>
        </div>
      )}
      {currentUserDetails.role === "user" && (
        <div className="mb-10 p-8 border rounded-xl shadow-xl bg-white">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">
            Book This Room
          </h2>
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold text-blue-600">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                excludeDates={getDisabledDates()}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-600">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                excludeDates={getDisabledDates()}
                minDate={startDate ? addDays(startDate, 1) : new Date()}
                dateFormat="dd-MM-yyyy"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleBookRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Book Room
            </button>
            {bookingError && (
              <p className="text-red-500 text-sm mt-3">{bookingError}</p>
            )}
          </div>
        </div>
      )}

      <div className="mb-10 p-8 border rounded-xl shadow-xl bg-white">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          User Feedbacks
        </h2>
        <p className="mb-6 text-xl">
          <strong className="text-blue-600">Overall Rating:</strong>{" "}
        </p>
        {feedbacks.length > 0 ? (
          <ul className="space-y-6">
            {feedbacks.map((feedback) => (
              <li
                key={feedback.fbId}
                className="p-6 border rounded-lg shadow-md bg-gray-50"
              >
                <p className="mb-3 text-lg">
                  <strong className="text-blue-600">User:</strong>{" "}
                  {feedback.userId}
                </p>
                <p className="mb-3 text-lg">
                  <strong className="text-blue-600">Feedback:</strong>{" "}
                  {feedback.fb}
                </p>
                <p className="text-lg">
                  <strong className="text-blue-600">Attitude:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded text-white ${getPolarityColor(
                      feedback.attitude
                    )}`}
                  >
                    {feedback.attitude}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-lg">
            No feedbacks available for this room.
          </p>
        )}
      </div>

      {currentUserDetails.role === "user" && (
        <div className="mb-10 p-8 border rounded-xl shadow-xl bg-white">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">
            Add Feedback
          </h2>
          <textarea
            value={newFeedback}
            onChange={handleFeedbackChange}
            rows={4}
            placeholder="Enter your feedback here..."
            className="border p-4 w-full rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddFeedback}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Feedback
          </button>
          {feedbackError && (
            <p className="text-red-500 text-sm mt-3">{feedbackError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomDetails;