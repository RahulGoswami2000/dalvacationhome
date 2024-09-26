import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB);

export const handler = async (event) => {
  const params = {
    TableName: "Users",
    FilterExpression: "#user_type = :role",
    ExpressionAttributeValues: {
      ":role": "property_agent",
    },
    ExpressionAttributeNames: {
      "#user_type": "role",
    },
  };

  const { Items } = await dynamoDocClient.send(new ScanCommand(params));
  console.log(Items);
  if (Items.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "No property agents found" }),
    };
  }

  const randomItem = Items[Math.floor(Math.random() * Items.length)];
  console.log(randomItem);
  const propertyAgent = randomItem.email;

  return {
    statusCode: 200,
    body: propertyAgent,
  };
};
