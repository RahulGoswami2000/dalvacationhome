import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDB)

export const handler = async (event) => {
  const { text, encodedText, email } = event;

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

    const key = Items[0].cipher_key;
    console.log(key)
    // Step 1: Verify Caesar cipher accuracy
    const encode = caesarCipherDecode(text, key);
    if (encode === encodedText) {
      return {
        statusCode: 200,
        body: {
          message: "Caesar cipher verified successfully",
        },
      };
    } else {
      return {
        statusCode: 400,
        body: {
          message: "Caesar cipher verification failed",
        },
      };
    }
  } catch (error) {
    console.error("Error verifying Caesar cipher:", error);
    return {
      statusCode: 500,
      body: {
        message: "Error verifying Caesar cipher",
        error: error.message,
      },
    };
  }
};

// Function to decode text using Caesar cipher
function caesarCipherDecode(message, shift) {
  let result = '';
  
  for (let i = 0; i < message.length; i++) {
    let char = message[i];
    
    if (char.match(/[a-z]/i)) {
      const code = message.charCodeAt(i);
      
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    }
    
    result += char;
  }
  
  return result;
}
