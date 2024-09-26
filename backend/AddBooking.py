import json
import boto3
from boto3.dynamodb.conditions import Attr
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
bookings_table = dynamodb.Table('Bookings')
rooms_table = dynamodb.Table('RoomsTable')

def lambda_handler(event, context):
    user_id = event['userId']
    room_id = int(event['roomId'])
    start_date = event['startDate']
    end_date = event['endDate']
    
    # Convert dates to datetime objects
    start_date_dt = datetime.strptime(start_date, '%d-%m-%Y')
    end_date_dt = datetime.strptime(end_date, '%d-%m-%Y')
    
    # Scan for bookings that overlap with the requested date range
    response = bookings_table.scan(
        FilterExpression=Attr('roomId').eq(room_id) &
                         Attr('startDate').lt(end_date) &
                         Attr('endDate').gt(start_date)
    )
    
    print(response)
    
    if response['Items']:
        # Room is already booked for the given date range
        return {
            'statusCode': 400,
            'body': json.dumps('Room is already booked for the specified date range.')
        }
    
    # Generate a new booking reference (for simplicity, use the current timestamp)
    booking_reference = int(datetime.now().timestamp())
    
    # Create the new booking
    new_booking = {
        'bookingRef': booking_reference,
        'userId': user_id,
        'roomId': room_id,
        'startDate': start_date,
        'endDate': end_date
    }
    
    bookings_table.put_item(Item=new_booking)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Booking created successfully.')
    }
