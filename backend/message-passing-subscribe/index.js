const functions = require("@google-cloud/functions-framework");
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore({
  projectId: "serverless-term-project-429516",
});
// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent("helloPubSub", async (cloudEvent) => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const base64data = cloudEvent.data.message.data;

  const messageData = Buffer.from(base64data, "base64").toString();
  const parsedData = JSON.parse(messageData);

  const { bookingId, message, customer, senderType, propertyAgent } =
    parsedData;
  console.log(parsedData);
  const chatMessage = {
    senderType,
    message,
  };

  const communicationRef = firestore
    .collection("communications")
    .doc(bookingId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(communicationRef);
      if (doc.exists) {
        // Update the document with the new chat message
        transaction.update(communicationRef, {
          chat: Firestore.FieldValue.arrayUnion(chatMessage),
        });
      } else {
        // Create a new document
        transaction.set(communicationRef, {
          bookingId,
          customer,
          propertyAgent,
          chat: [chatMessage],
        });
      }
    });
  } catch (error) {
    console.error(`Error logging communication: ${error.message}`);
  }
});
