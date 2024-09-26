import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface QuesAnsProps {
  email: string;
}
const QuesAns: React.FC<QuesAnsProps> = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [cipher, setCipher] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state && location.state.email;
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/signup/security",
        {
          email: email,
          question: question,
          answer: answer,
          key: cipher,
        }
      );

      if (response.status === 200) {
        setMessage("Security question and answer stored successfully");
        navigate("/login");
      } else {
        setMessage("Failed to store security question and answer");
      }
    } catch (error) {
      console.error("Error storing security question and answer:", error);
      setMessage("Failed to store security question and answer");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
  <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
      Select Security Question
    </h2>
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Select a question:
        </label>
        <select
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <option value="">Select...</option>
          <option value="What is your mother's name?">What is your mother's name?</option>
          <option value="What city were you born in?">What city were you born in?</option>
          <option value="What is your favorite book?">What is your favorite book?</option>
          <option value="What is your pet's name?">What is your pet's name?</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Your Answer:
        </label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Cipher Key
        </label>
        <input
          type="number"
          value={cipher}
          onChange={(e) => setCipher(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      >
        Submit
      </button>
      {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
    </form>
  </div>
</div>

  );
};

export default QuesAns;
