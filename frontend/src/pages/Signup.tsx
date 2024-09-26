import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();


  const triggerLambda = async (eventType: string, email: string, name: string) => {
    const payload = {
      eventType: eventType,
      email: email,
      name: name,
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

  const triggerBigQueryLambda = async () => {
    try {
      const response = await axios.post('https://a3asiuvgm24tvgoed37y7ryozi0uieyl.lambda-url.us-east-1.on.aws/');
      console.log('Response:', response.data);
    } catch(error) {
      console.error('Error: ', error);
      
    }
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Basic form validation
    if (!name || !email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password validation: at least 8 characters
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    const response = await axios.post(
      "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/signup",
      {
        email: email,
        password: password,
        role: role,
        name: name,
      }
    );

    if (response.data.statusCode === 200) {
      console.log("Signup successful:", response.data);
      toast.success("Signup successful!");
      await triggerLambda("register", email,name);
      await triggerBigQueryLambda();
      navigate("/ques", { state: { email } });
    } else {
      console.error("Signup error:", response.data);
      toast.error("Signup failed. Please try again.");
      return;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Sign Up</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="email">
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
          <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="password">
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
        <div>
          <label className="block text-blue-700 text-sm font-semibold mb-2" htmlFor="role">
            User Type
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-white"
          >
            <option value="">Select user type...</option>
            <option value="property_agent">Property Agent</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Sign Up
        </button>
      </form>
    </div>
    <ToastContainer />
  </div>
  );
};
