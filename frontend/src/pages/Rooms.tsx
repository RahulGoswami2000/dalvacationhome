import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the Room type
interface Room {
  roomId: number;
  roomType: string;
  roomPrice: number;
  roomFeatures: string[];
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "https://lr2hgk25feunhjtw635obzpdpe0jvioy.lambda-url.us-east-1.on.aws/"
      )
      .then((response) => {
        setRooms(response.data.rooms);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
  <div className="flex justify-center">
    <div className="shadow-xl rounded-lg overflow-hidden bg-white w-full max-w-5xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 pt-6">Our Rooms</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Room ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Room Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Room Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Room Features</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room, index) => (
              <tr key={index} className="hover:bg-blue-50 transition duration-300">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.roomId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${room.roomPrice}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{room.roomFeatures.join(", ")}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => navigate(`/room/${room.roomId}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  );
};

export default Rooms;
