import { useContext, useEffect, useState } from "react";
import { Accountcontext } from "../context/Account";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import Changepassword from "./Changepassword";

const Settings = () => {
  const { getSession } = useContext(Accountcontext) as {
    getSession: () => Promise<CognitoUserSession>;
  };

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getSession()
      .then(() => {
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
        setLoggedIn(false); // Ensure logged in state is correctly managed on error
      });
  }, [getSession]);

  return (
    <div>
      {loggedIn && (
        <>
          <h2>Settings</h2>
          <Changepassword />
        </>
      )}
    </div>
  );
};

export default Settings;
