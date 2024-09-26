import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB);

const TABLE_NAME = "Bookings";
export const handler = async (event) => {
  const { bookingRef } = event;

  try {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "bookingRef = :bookingRef",
      ExpressionAttributeValues: {
        ":bookingRef": bookingRef,
      },
    };

    const command = new ScanCommand(params);
    const { Items } = await dynamoDocClient.send(command);

    return {
      statusCode: 200,
      data: Items[0],
    };
  } catch (error) {
    console.error("Error fetching booking details", error);
    return {
      statusCode: 500,
      body: {
        message: "Error fetching booking details",
        error: error.message,
      },
    };
  }
};
