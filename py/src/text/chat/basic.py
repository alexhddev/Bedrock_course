import boto3

client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")
MODEL_ID = 'us.amazon.nova-2-lite-v1:0'


def multi_turn_converse():
    history = []

    turns = [
        'What is the capital of France?',
        'What is it famous for?',
    ]

    for user_text in turns:
        history.append({'role': 'user', 'content': [{'text': user_text}]})

        response = client.converse(
            modelId=MODEL_ID,
            messages=history,
        )

        assistant_message = response['output']['message']
        history.append(assistant_message)

        print(f"User: {user_text}")
        print(f"Assistant: {assistant_message['content'][0]['text']}\n")


multi_turn_converse()
