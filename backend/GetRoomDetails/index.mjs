import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB);

const TABLE_NAME = "RoomsTable";
export const handler = async (event) => {
  const { roomId } = event;

  try {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "roomId = :roomId",
      ExpressionAttributeValues: {
        ":roomId": roomId,
      },
    };

    const command = new ScanCommand(params);
    const { Items } = await dynamoDocClient.send(command);

    return {
      statusCode: 200,
      data: Items,
    };
  } catch (error) {
    console.error("Error fetching room details", error);
    return {
      statusCode: 500,
      body: {
        message: "Error fetching room detailsr",
        error: error.message,
      },
    };
  }
};
