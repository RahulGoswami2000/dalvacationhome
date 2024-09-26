import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB);

export const handler = async (event) => {
  const { id } = event;
  console.log(id, event);
  try {
    const params = {
      TableName: "Users",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };

    const command = new ScanCommand(params);
    const { Items } = await dynamoDocClient.send(command);

    console.log(Items);
    const userDetails = Items[0];

    if (userDetails) {
      return {
        statusCode: 200,
        data: userDetails,
      };
    } else {
      return {
        statusCode: 400,
        body: {
          message: "Failed to fetch user details",
        },
      };
    }
  } catch (error) {
    console.error("Error fetching user details", error);
    return {
      statusCode: 500,
      body: {
        message: "Error fetching user detailsr",
        error: error.message,
      },
    };
  }
};
