import React, { useState, useContext } from "react";
import { Accountcontext } from "../context/Account";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import UserPool from "../utils/UserPool";

const ChangePassword = () => {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const { getSession } = useContext(Accountcontext) as {
    getSession: () => Promise<CognitoUserSession>;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const session = await getSession();
      if (!session) {
        throw new Error("User session not available.");
      }

      const user = UserPool.getCurrentUser();
      if (!user) {
        throw new Error("User not found.");
      }

      user.getSession((err: any) => {
        if (err) {
          console.error("Error getting session:", err);
          return;
        }

        user.changePassword(password, newPassword, (err) => {
          if (err) {
            console.error("Change password error:", err);
            // Handle error (e.g., display error message)
          } else {
            console.log("Password changed successfully.");
            // Handle success (e.g., display success message)
          }
        });
      });
    } catch (error) {
      console.error("Error changing password:", error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white-100">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-full max-w-sm mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
