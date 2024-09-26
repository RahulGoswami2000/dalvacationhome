import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Bookings')

# Helper function to convert DynamoDB types to native Python types
def decimal_to_int_or_float(d):
    if isinstance(d, Decimal):
        if d % 1 == 0:
            return int(d)
        else:
            return float(d)
    raise TypeError("Type not serializable")

def lambda_handler(event, context):
    # Extract roomId from the query parameters
    room_id = event.get('queryStringParameters', {}).get('roomId')
    
    if not room_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'roomId is required'})
        }
    
    try:
        # Query the DynamoDB table using the GSI for bookings with the specified roomId
        response = table.query(
            IndexName='RoomIdIndex',
            KeyConditionExpression=Key('roomId').eq(int(room_id))
        )
        bookings = response.get('Items', [])
        
        # Convert Decimal types to int or float
        for booking in bookings:
            for key, value in booking.items():
                if isinstance(value, Decimal):
                    booking[key] = decimal_to_int_or_float(value)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'bookings': bookings})
        }
    
    except table.meta.client.exceptions.ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'ValidationException' and 'backfilling' in str(e):
            return {
                'statusCode': 503,
                'body': json.dumps({'error': 'The index is still being backfilled. Please try again later.'})
            }
        else:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': str(e)})
            }
