import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import axios from "axios";

// Initialize the DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(client);

const bookingsTable = "Bookings";
const roomsTable = "RoomsTable";

export const handler = async (event) => {
  const userId = event.userId;
  const roomId = parseInt(event.roomId, 10);
  const startDate = event.startDate;
  const endDate = event.endDate;

  // Scan for bookings that overlap with the requested date range
  const params = {
    TableName: bookingsTable,
    FilterExpression:
      "#roomId = :roomId AND #startDate < :endDate AND #endDate > :startDate",
    ExpressionAttributeNames: {
      "#roomId": "roomId",
      "#startDate": "startDate",
      "#endDate": "endDate",
    },
    ExpressionAttributeValues: {
      ":roomId": roomId,
      ":startDate": startDate,
      ":endDate": endDate,
    },
  };

  try {
    const response = await dynamoDocClient.send(new ScanCommand(params));

    if (response.Items.length > 0) {
      // Room is already booked for the given date range
      return {
        statusCode: 400,
        body: JSON.stringify(
          "Room is already booked for the specified date range."
        ),
      };
    }

    // Generate a new booking reference (for simplicity, use the current timestamp)
    const bookingReference = Date.now();

    // Create the new booking
    const newBooking = {
      bookingRef: bookingReference,
      userId: userId,
      roomId: roomId,
      startDate: startDate,
      endDate: endDate,
    };

    await dynamoDocClient.send(
      new PutCommand({
        TableName: bookingsTable,
        Item: newBooking,
      })
    );

    // Prepare payload for API call
    const payload = {
      eventType: "roomBooked",
      email: userId,
      roomName: roomId,
      bookingDate: `${startDate} - ${endDate}`,
    };

    // Call the external API
    const apiResponse = await axios.post(
      "https://7so3o3llnvtguwrso6xe33pb4e0wxncn.lambda-url.us-east-1.on.aws/",
      payload
    );
    console.log("API response:", apiResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify("Booking created successfully."),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Failed to create booking."),
    };
  }
};
