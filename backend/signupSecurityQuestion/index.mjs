import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const { email, question, answer, key } = event;

  const params = {
    TableName: "Users",
    Key: {
      email: { S: email },
    },
    UpdateExpression:
      "SET security_question = if_not_exists(security_question, :q), security_answer = if_not_exists(security_answer, :a), cipher_key = if_not_exists(cipher_key, :k)",
    ExpressionAttributeValues: {
      ":q": { S: question },
      ":a": { S: answer },
      ":k": { N: key }
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await dynamoClient.send(new UpdateItemCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Security question added successfully",
        updatedAttributes: data.Attributes,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
