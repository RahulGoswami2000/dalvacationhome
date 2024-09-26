import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export const handler = async (event) => {
    const body = JSON.parse(event.body);

    console.log("body");
    console.log(body);
    let eventType;
    let messageContent;

    console.log("POSTMAN event type");
    console.log(body.eventType);
    switch (body.eventType) {
        case 'login':
            messageContent = {
                eventType: 'UserLogin',
                userEmail: body.email,
                userName: body.name
            };
            break;
        case 'register':
            messageContent = {
                eventType: 'UserRegister',
                userEmail: body.email,
                userName: body.name
            };
            break;
        case 'roomBooked':
            messageContent = {
                eventType: 'RoomBooked',
                userEmail: body.email,
                userName: body.name,
                roomName: body.roomName,
                bookingDate: body.bookingDate
            };
            break;
        case 'roomBookingFailed':
            messageContent = {
                eventType: 'RoomBookingFailed',
                userEmail: body.email,
                userName: body.name,
                roomName: body.roomName,
                failureReason: body.failureReason
            };
            break;
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid event type.' })
            };
    }

    const params = {
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: JSON.stringify(messageContent)
    };

    console.log("Publishing message to SNS:", params);

    try {
        const data = await sns.publish(params).promise();
        console.log("Message published to SNS:", data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event published successfully.' })
        };
    } catch (err) {
        console.error("Error publishing to SNS:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to publish event.' })
        };
    }
};