import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB);

const TABLE_NAME = "Bookings";
export const handler = async (event) => {
  const { userId } = event;

  try {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "user_id = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const command = new ScanCommand(params);
    const { Items } = await dynamoDocClient.send(command);

    return {
      statusCode: 200,
      data: Items,
    };
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
