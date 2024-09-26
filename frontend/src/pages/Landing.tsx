import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">
            Welcome to DalVacation Home
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Enjoy a luxurious stay at our vacation homes, equipped with all the
            amenities you need for a comfortable and memorable experience.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">Our Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Spacious rooms with beautiful views", "Modern amenities and facilities", "24/7 customer service"].map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-gray-800">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">View and Book Rooms</h2>
          <Link
            to="/rooms"
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Rooms
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Landing;