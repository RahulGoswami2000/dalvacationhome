import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const { username } = event;
  const Lastlogindate = new Date().toISOString();
  const updateParams = {
    TableName: "Users",
    Key: {
      email: { S: username },
    },
    UpdateExpression: "SET Lastlogindate = :Lastlogindate",
    ExpressionAttributeValues: {
      ":Lastlogindate": { S: Lastlogindate },
    },
  };

  const updateCommand = new UpdateItemCommand(updateParams);
  await dynamoClient.send(updateCommand);
};
