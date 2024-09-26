import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
export const handler = async (event) => {
  const { email, answer } = event;

  const params = {
    TableName: "Users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const command = new ScanCommand(params);
    const { Items } = await dynamoDocClient.send(command);
    if (Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User not found",
        }),
      };
    }
    console.log(Items);
    if (Items[0].security_answer === answer) {
      return {
        statusCode: 200,
        body: {
          securityAnswer: answer,
        },
      };
    }
  } catch (error) {
    console.error("Error scanning DynamoDB table:", error);
    return {
      statusCode: 500,
      body: {
        message: "Error scanning DynamoDB table",
        error: error.message,
      },
    };
  }
};
