import json
import boto3
from boto3.dynamodb.conditions import Attr
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
bookings_table = dynamodb.Table('Bookings')

def lambda_handler(event, context):
    for record in event['Records']:
        message = json.loads(record['body'])
        user_id = message['userId']
        room_id = int(message['roomId'])
        start_date = message['startDate']
        end_date = message['endDate']
        
        # Convert dates to datetime objects
        start_date_dt = datetime.strptime(start_date, '%d-%m-%Y')
        end_date_dt = datetime.strptime(end_date, '%d-%m-%Y')
        
        # Scan for bookings that overlap with the requested date range
        response = bookings_table.scan(
            FilterExpression=Attr('roomId').eq(room_id) &
                             Attr('startDate').lt(end_date) &
                             Attr('endDate').gt(start_date)
        )
        
        if response['Items']:
            print(f"Room {room_id} is already booked for the specified date range.")
            continue  # Skip to the next message
        
        # Generate a new booking reference (for simplicity, use the current timestamp)
        booking_reference = int(datetime.now().timestamp())
        
        # Create the new booking
        new_booking = {
            'BookingId': str(booking_reference),  # Use the correct primary key name
            'userId': user_id,
            'roomId': room_id,
            'startDate': start_date,
            'endDate': end_date
        }
        
        bookings_table.put_item(Item=new_booking)
        
        print(f"Booking created successfully for Room {room_id} from {start_date} to {end_date}.")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Bookings processed successfully.')
    }
