import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SecurityAnswersComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [randomText, setRandomText] = useState('');
  const [additionalInput, setAdditionalInput] = useState('');

  const location = useLocation();
  const email = location.state && location.state.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecurityQuestion = async () => {
      if (!email) {
        setError("Email not provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching security question for:", email);
        const response = await axios.post(
          `https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/login/fetch-question`,
          {
            email: email,
          }
        );

        if (response.status === 200 && response.data.body.question) {
          setQuestion(response.data.body.question);
        } else {
          setError("Question not found for the specified email");
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching security question");
        setLoading(false);
        console.error("Error fetching security question:", error);
      }
    };

    fetchSecurityQuestion();
  }, [email]);

  useEffect(() => {
    // Generate random text when component mounts
    const generateRandomText = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let result = "";
      const length = 5;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      setRandomText(result);
    };

    generateRandomText();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const responseAnswer = await axios.post(
        `https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/login/security-answer`,
        {
          email: email,
          answer: answer,
        }
      );

      const response = await axios.post(
        `https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/login/cipher`,
        {
          email: email,
          text: randomText,
          encodedText: additionalInput,
        }
      );
      console.log(response);

      if (
        response.data.statusCode === 200 &&
        responseAnswer.data.statusCode === 200
      ) {
        setMessage("Login successful");
        // Redirect to landing page
        navigate("/"); // Update this to your actual landing page route
      } else if (response.data.statusCode === 401) {
        setError("Incorrect answer");
      } else {
        setError("Error verifying answer");
      }
    } catch (error) {
      setError("Error verifying answer");
      console.error("Error verifying answer:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div className="max-w-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <p className="mb-4 text-gray-700">Security Question: {question}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <p className="mb-4 text-gray-700">Cipher: {randomText}</p>
        <input
          type="text"
          placeholder="Enter additional input"
          value={additionalInput}
          onChange={(e) => setAdditionalInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  </div>
  
  );
};

export default SecurityAnswersComponent;
