import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB);

export const handler = async (event) => {
  const { email } = event;

  try {
    const params = {
      TableName: "Users",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const command = new ScanCommand(params);
    const { Items } = await dynamoDocClient.send(command);

    console.log(Items)
    const question = Items[0]?.security_question;

    if (question) {
      return {
        statusCode: 200,
        body: {
          question: question
        },
      };
    } else {
      return {
        statusCode: 400,
        body: {
          message: "Failed to fetch security question",
        },
      };
    }
  } catch (error) {
    console.error("Error fetching security question", error);
    return {
      statusCode: 500,
      body: {
        message: "Error fetching security questionr",
        error: error.message,
      },
    };
  }
};