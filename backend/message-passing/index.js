const functions = require("@google-cloud/functions-framework");
const { PubSub } = require("@google-cloud/pubsub");
const axios = require("axios");

const pubsub = new PubSub({
  projectId: "serverless-term-project-429516",
});
const topicName = "customers-concerns-topic";
functions.http("helloHttp", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type, Accept");

    // cache preflight response for 3600 sec
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  const { bookingId, message, customer, senderType } = req.body;
  // Call the AWS Lambda URL to get the property agent
  const lambdaResponse = await axios.get(
    "https://czhkxhdk6ktuf3gxwtimtb4ueq0molep.lambda-url.us-east-1.on.aws/"
  );
  console.log(lambdaResponse.data);
  if (lambdaResponse.status !== 200) {
    throw new Error("Failed to get property agent from Lambda");
  }

  const propertyAgent = lambdaResponse.data;
  const data = {
    bookingId,
    message,
    customer,
    senderType,
    propertyAgent,
  };

  console.log(data);
  // Send a message to the topic
  const messageId = await pubsub
    .topic(topicName)
    .publishMessage({ data: Buffer.from(JSON.stringify(data)) });
  res.send(`Message ID:${messageId} is published`);
});
