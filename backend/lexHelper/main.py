import json
import requests

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    
    # Extract the intent name
    intent_name = event['sessionState']['intent']['name']
    
    try:
        if intent_name == 'GetBookingDetails':
            # Extract booking reference ID from the event
            booking_reference = event['sessionState']['intent']['slots']['BookingReference']['value']['interpretedValue']
            # Define the URL for the booking details Lambda function
            url = "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/bookings/detail"
            request_body = {"bookingRef": int(booking_reference)}
        elif intent_name == 'GetRoomDetails':
            # Extract room ID from the event
            room_id = event['sessionState']['intent']['slots']['roomNo']['value']['interpretedValue']
            # Define the URL for the room details Lambda function
            url = "https://l1jsk1x5of.execute-api.us-east-1.amazonaws.com/dev-v1/rooms/detail"
            request_body = {"roomId": int(room_id)}
        elif intent_name == 'RaiseConcern':
            # Extract details from the event
            user_email = event['sessionState']['intent']['slots']['UserEmail']['value']['interpretedValue']
            booking_ref = event['sessionState']['intent']['slots']['BookingRef']['value']['interpretedValue']
            concern_body = event['sessionState']['intent']['slots']['ConcernBody']['value']['interpretedValue']
            # Define the URL for the concern publisher Cloud Function
            url = "https://us-central1-serverless-term-project-429516.cloudfunctions.net/concern-publisher"
            request_body = {
                "bookingId": booking_ref,
                "message": concern_body,
                "customer": user_email,
                "senderType": "user"
            }
        else:
            return {
                'sessionState': {
                    'dialogAction': {
                        'type': 'Close',
                        'fulfillmentState': 'Failed'
                    },
                    'intent': {
                        'name': intent_name,
                        'slots': event['sessionState']['intent']['slots'],
                        'state': 'Failed'
                    }
                },
                'messages': [
                    {
                        'contentType': 'PlainText',
                        'content': 'Error: Unsupported intent.'
                    }
                ]
            }
        
        # Make the POST request to the appropriate URL
        response = requests.post(url, json=request_body)
        response.raise_for_status()  # Raise an exception for HTTP errors
        details = response.json().get('data', {})
        print(details)
    except requests.RequestException as e:
        print(f"Request error: {e}")
        # return {
        #     'sessionState': {
        #         'dialogAction': {
        #             'type': 'Close',
        #             'fulfillmentState': 'Failed'
        #         },
        #         'intent': {
        #             'name': intent_name,
        #             'slots': event['sessionState']['intent']['slots'],
        #             'state': 'Failed'
        #         }
        #     },
        #     'messages': [
        #         {
        #             'contentType': 'PlainText',
        #             'contentType': 'PlainText',
        #             'content': 'Error: Unable to fetch details from the other service.'
        #         }
        #     ]
        # }
    
    # Handle response based on intent
    if intent_name == 'RaiseConcern':
        return {
            'sessionState': {
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': 'Fulfilled'
                },
                'intent': {
                    'name': intent_name,
                    'slots': event['sessionState']['intent']['slots'],
                    'state': 'Fulfilled'
                }
            },
            'messages': [
                {
                    'contentType': 'PlainText',
                    'content': 'Concern raised. Property Agent will contact you soon.'
                }
            ]
        }
    
    # Check if the details exist for booking and room details intents
    if not details:
        return {
            'sessionState': {
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': 'Failed'
                },
                'intent': {
                    'name': intent_name,
                    'slots': event['sessionState']['intent']['slots'],
                    'state': 'Failed'
                }
            },
            'messages': [
                {
                    'contentType': 'PlainText',
                    'content': 'Sorry, I could not find the details.'
                }
            ]
        }
    
    # Extract and format the details based on the intent
    if intent_name == 'GetBookingDetails':
        # Extract booking details
        room_number = details['roomId']
        start_date = details['startDate']
        end_date = details['endDate']
        content = f'Your room number is {room_number}. Start Date is {start_date}. End Date is {end_date}.'
    elif intent_name == 'GetRoomDetails':
        # Extract room details
        room_info = details[0]  # Since 'data' is a list, get the first element
        room_number = room_info['roomId']
        room_price = room_info['roomPrice']
        room_features = ', '.join(room_info['roomFeatures'])
        room_type = room_info['roomType']
        content = (f'Room number: {room_number}\n'
                   f'Price: ${room_price}\n'
                   f'Type: {room_type}\n'
                   f'Features: {room_features}')
    
    return {
        'sessionState': {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Fulfilled'
            },
            'intent': {
                'name': intent_name,
                'slots': event['sessionState']['intent']['slots'],
                'state': 'Fulfilled'
            }
        },
        'messages': [
            {
                'contentType': 'PlainText',
                'content': content
            }
        ]
    }
