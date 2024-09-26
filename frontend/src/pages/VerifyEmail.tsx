import React, { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../utils/UserPool';
import axios from 'axios'; 
import { toast } from 'react-toastify'; 

export const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state && location.state.name; 
  const email = location.state && location.state.email; 

  const onSubmitVerification = (event: FormEvent) => {
    event.preventDefault();
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });
    user.confirmRegistration(verificationCode, true, async (err, data) => {
      if (err) {
        console.error("Verification failed:", err);
        return;
      }
      console.log("Verification successful:", data);
      toast.success("Verification successful!"); 
      try {
        const response = await axios.post('https://yrvee3xkzb.execute-api.us-east-1.amazonaws.com/dev/user/signup', {
          name: name,
          email: email
        });

        if (response.status === 200) {
          toast.success("User data stored successfully!");

          navigate('/ques', { state: { email } });
        } else {
          toast.error("Failed to store user data.");
        }
      } catch (error) {
        console.error('Error storing user data:', error);
        toast.error("Failed to store user data.");
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-full max-w-sm mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Email</h2>
        {/* Verification Form */}
        <form onSubmit={onSubmitVerification}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Verification Code:</label>
            <input 
              type="text" 
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};
