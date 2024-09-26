import { Firestore } from "@google-cloud/firestore";

const firestore = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID,
});

export const handler = async (event) => {
  const { propertyAgent } = event.queryStringParameters;

  try {
    const communicationsRef = firestore.collection("communications");
    const snapshot = await communicationsRef
      .where("propertyAgent", "==", propertyAgent)
      .get();

    if (snapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No communications found for the specified property agent",
        }),
      };
    }

    const communications = [];
    snapshot.forEach((doc) => {
      communications.push(doc.data());
    });

    return {
      statusCode: 200,
      body: communications,
    };
  } catch (error) {
    console.error("Error retrieving communications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
