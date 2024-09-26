import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

const sqs = new AWS.SQS();

export const handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        const { eventType, userEmail, userName, roomName, bookingDate, failureReason } = message;

        switch (eventType) {
            case 'UserLogin':
                await sendLoginEmail(userEmail);
                break;
            case 'UserRegister':
                await sendRegisterEmail(userEmail, userName);
                break;
            case 'RoomBooked':
                await sendRoomBookedEmail(userEmail, userName, roomName, bookingDate);
                break;
            case 'RoomBookingFailed':
                await sendRoomBookingFailedEmail(userEmail, userName, roomName, failureReason);
                break;
            default:
                console.error('Unsupported event type:', eventType);
                break;
        }

        // Delete the message from SQS queue after successful processing
        await deleteMessageFromQueue(record.receiptHandle);
    }
};

const sendLoginEmail = async (userEmail) => {
    // Create a nodemailer transporter for Mailtrap or your email service
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    const mailOptions = {
        from: 'From serverless Team 27',
        to: userEmail,
        subject: 'Login Successful',
        text: `Hello,\n\nYou have successfully logged in.`
    };

    await transporter.sendMail(mailOptions);
};

const sendRegisterEmail = async (userEmail, userName) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    const mailOptions = {
        from: 'From serverless Team 27',
        to: userEmail,
        subject: 'Registration Successful',
        text: `Hello ${userName},\n\nThank you for registering with us.`
    };

    await transporter.sendMail(mailOptions);
};

const sendRoomBookedEmail = async (userEmail, userName, roomName, bookingDate) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    const mailOptions = {
        from: 'From serverless Team 27',
        to: userEmail,
        subject: 'Room Booking Confirmation',
        text: `Hello ${userName},\n\nYour booking for ${roomName} on ${bookingDate} is confirmed.`
    };

    await transporter.sendMail(mailOptions);
};

const sendRoomBookingFailedEmail = async (userEmail, userName, roomName, failureReason) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    const mailOptions = {
        from: 'From serverless Team 27',
        to: userEmail,
        subject: 'Room Booking Failed',
        text: `Hello ${userName},\n\nYour booking for ${roomName} has failed due to: ${failureReason}.`
    };

    await transporter.sendMail(mailOptions);
};

const deleteMessageFromQueue = async (receiptHandle) => {
    const params = {
        QueueUrl: process.env.SQS_QUEUE_URL,
        ReceiptHandle: receiptHandle
    };
    await sqs.deleteMessage(params).promise();
};