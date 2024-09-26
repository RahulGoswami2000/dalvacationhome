import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const TABLE_NAME = "Users";

export const handler = async (event) => {
  const { email, password, role, name } = event;

  try {
    // Sign up user in Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "custom:role", Value: role },
      ],
    });

    const signUpResponse = await cognitoClient.send(signUpCommand);
    const userId = signUpResponse.UserSub; // Get the Cognito User ID

    const adminConfirmSignUpInput = new AdminConfirmSignUpCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
    });

    await cognitoClient.send(adminConfirmSignUpInput)
    console.log("User signed up:", signUpResponse);

    // Store user details in DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: userId },
        email: { S: email },
        role: { S: role },
        name: { S: name },
      },
    };

    await dynamoClient.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      body: {
        message: "User signed up and stored successfully",
        data: signUpResponse,
      },
    };
  } catch (error) {
    console.error("Error signing up user:", error);
    return {
      statusCode: 500,
      body: {
        message: "Error signing up user",
        error: error.message,
      },
    };
  }
};
