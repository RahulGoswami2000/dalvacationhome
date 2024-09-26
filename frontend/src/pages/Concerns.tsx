import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Accountcontext } from "../context/Account";

// Define the concern type
interface Concern {
  bookingId: number;
  customer: string;
  propertyAgent: number;
  chat: string[];
}

const Concerns = () => {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConcern, setNewConcern] = useState({ bookingId: "", message: "" });
  const [currentUserDetails, setCurrentUserDetails] = useState<any>("");
  const context = useContext(Accountcontext);

  const { getSession, getCurrentUserDetails } = context;

  const getCurrentUser = async () => {
    const currentUser = (await getSession()).getAccessToken().payload;
    const userDetail = await getCurrentUserDetails(currentUser.sub);

    setCurrentUserDetails(userDetail);
  };

  useEffect(() => {
    console.log(currentUserDetails, "bsdjfhbuqoerbfiqnewkfjne");

    const userType =
      currentUserDetails.role == "user" ? "customer" : "propertyAgent";
    axios
      .get(
        `https://us-central1-serverless-term-project-429516.cloudfunctions.net/get-concerns?${userType}=${currentUserDetails.email}`
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.statusCode == 200) {
          setConcerns(response.data.body);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [currentUserDetails]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleRaiseConcern = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://us-central1-serverless-term-project-429516.cloudfunctions.net/concern-publisher",
        {
          ...newConcern,
          customer: currentUserDetails.email,
          senderType: currentUserDetails.role,
        }
      );
      setIsModalOpen(false);
      setNewConcern({ bookingId: "", message: "" });
      // Optionally, refresh the concerns list
    } catch (error) {
      console.error("Error submitting concern:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Your Concerns</h2>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleRaiseConcern}
      >
        Raise a Concern
      </button>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2 text-blue-700">Booking ID</th>
            <th className="border border-gray-200 px-4 py-2 text-blue-700">Property Agent</th>
          </tr>
        </thead>
        <tbody>
          {concerns.map((concern, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-4 py-2">
                <Link to={`/concerns/${concern.bookingId}`} className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300">
                  {concern.bookingId}
                </Link>
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {concern.propertyAgent}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 max-w-md w-full">
            <h2 className="text-3xl mb-6 text-center text-blue-800">Raise a Concern</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-blue-700 text-sm font-semibold mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  value={newConcern.bookingId}
                  onChange={(e) =>
                    setNewConcern({ ...newConcern, bookingId: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-blue-700 text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  value={newConcern.message}
                  onChange={(e) =>
                    setNewConcern({ ...newConcern, message: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default Concerns;
