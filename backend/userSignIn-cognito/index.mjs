import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Create an instance of the CognitoIdentityProviderClient
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

// Function to handle user sign-in
export const handler = async (event) => {
  const { email, password } = event;
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.CLIENT_ID, // Replace with your App Client ID
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const data = await client.send(command);
    console.log("User signed in successfully:", data);
    return {
      id: data.AuthenticationResult.IdToken,
      email: email,
    }; // Return the ID token for further use
  } catch (error) {
    console.error("Error signing in user:", error);
    throw error;
  }
};
