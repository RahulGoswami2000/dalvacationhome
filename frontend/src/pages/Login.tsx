import React, { FormEvent, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Accountcontext } from "../context/Account";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate()

  const context = useContext(Accountcontext);

  if (!context) {
    throw new Error("Accountcontext must be used within an AccountProvider");
  }

  const { authenticate } = context;

  const triggerLambda = async (eventType: string, email: string) => {
    const payload = {
      eventType: eventType,
      email: email,
      // Add any other relevant fields
    };

    try {
      const response = await axios.post('https://7so3o3llnvtguwrso6xe33pb4e0wxncn.lambda-url.us-east-1.on.aws/', payload, {
      });

      console.log('Lambda response:', response.data);
    } catch (error) {
      console.error('Error triggering Lambda function:', error);
    }
  };

  const addLoginDate = async (username: string) => {
    try {
      await axios.post(
        "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/login/date",
        {
          username: username,
        }
      );
    } catch (error) {
      console.error("Error adding last login date:", error);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await authenticate(email, password);
      await addLoginDate(email);
      console.log("User authenticated");
      await triggerLambda('login', email);
      navigate('/security', {state: {email}})
      // Navigate to home or another protected page
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Login</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-blue-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-blue-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-gray-600">Forgot your password? </span>
        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition duration-300">
          Reset Password
        </Link>
      </div>
    </div>
  </div>
  );
};
