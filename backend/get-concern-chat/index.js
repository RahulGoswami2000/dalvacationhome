const functions = require("@google-cloud/functions-framework");
const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
  projectId: "serverless-term-project-429516",
});

functions.http("helloHttp", async (req, res) => {
  const { bookingId } = req.query;

  try {
    const communicationsRef = firestore.collection("communications");
    const snapshot = await communicationsRef
      .where("bookingId", "==", bookingId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: "No communications found for the specified booking ID",
      });
    }

    const communications = [];
    snapshot.forEach((doc) => {
      communications.push(doc.data());
    });

    return res.status(200).json(communications);
  } catch (error) {
    console.error("Error retrieving communications:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
