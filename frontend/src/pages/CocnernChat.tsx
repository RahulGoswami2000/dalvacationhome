import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Accountcontext } from "../context/Account";

// Define the conern type
interface Concern {
  bookingId: number;
  customer: string;
  propertyAgent: number;
  chat: chat[];
}

interface chat {
  senderType: string;
  message: string;
}
const ConcernChat = () => {
  const { bookingId } = useParams();
  const [concernChat, setConcernChat] = useState<Concern | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<any>("");
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
    axios
      .get(
        `https://us-central1-serverless-term-project-429516.cloudfunctions.net/get-concern-chat-1?bookingId=${bookingId}`
      )
      .then((response) => {
        setConcernChat(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [bookingId]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        "https://us-central1-serverless-term-project-429516.cloudfunctions.net/concern-publisher",
        {
          bookingId,
          customer: currentUserDetails.email,
          message: newMessage,
          senderType: currentUserDetails.role,
        }
      );

      if (response.data) {
        setConcernChat((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              chat: [
                ...prevState.chat,
                {
                  senderType:
                    currentUserDetails.role == "user"
                      ? "User"
                      : "Property Agent",
                  message: newMessage,
                },
              ],
            };
          }
          return prevState;
        });
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">
        Chat Details for Booking ID: {bookingId}
      </h2>
      <div className="bg-white p-4 rounded shadow-lg">
        {concernChat ? (
          <div>
            {concernChat.chat.map((message, index) => (
              <div key={index} className="mb-4">
                <p>
                  <strong>
                    {message.senderType == "user" ? "User" : "Property Agent"}:
                  </strong>{" "}
                  {message.message}
                </p>
              </div>
            ))}
            <form onSubmit={handleSendMessage} className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <p>No chat details found.</p>
        )}
      </div>
    </div>
  );
};

export default ConcernChat;
