const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { LanguageServiceClient } = require("@google-cloud/language");
const { v4: uuidv4 } = require("uuid");
const googleCredentials = require("./serverless-term-project-429516-20d1c4801755.json");

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const feedbacksTable = "UserFeedbacks";

// Initialize Google Cloud Natural Language API client with credentials
const gcpClient = new LanguageServiceClient({
  credentials: googleCredentials,
});

const analyzeSentiment = async (textContent) => {
  const document = {
    content: textContent,
    type: "PLAIN_TEXT",
  };

  const [result] = await gcpClient.analyzeSentiment({ document });
  const sentiment = result.documentSentiment;
  const attitude = getAttitude(sentiment.score);

  return {
    score: sentiment.score,
    magnitude: sentiment.magnitude,
    attitude: attitude,
  };
};

const getAttitude = (score) => {
  if (score > 0.2) {
    return "positive";
  } else if (score < -0.2) {
    return "negative";
  } else {
    return "neutral";
  }
};

exports.handler = async (event) => {
  const { userId, roomId, feedback } = event;

  // Generate a new feedback ID (using UUID for uniqueness)
  const feedbackId = uuidv4();

  const feedbackSentiment = await analyzeSentiment(feedback);
  // Create the new feedback
  const newFeedback = {
    fbId: { S: feedbackId },
    userId: { S: userId },
    roomId: { S: roomId },
    fb: { S: feedback },
    attitude: { S: feedbackSentiment.attitude },
  };

  const params = {
    TableName: feedbacksTable,
    Item: newFeedback,
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDB.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify("Feedback added successfully!"),
    };
  } catch (error) {
    console.error("Error adding feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Failed to add feedback"),
    };
  }
};
