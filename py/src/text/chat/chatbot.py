import boto3

client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")
MODEL_ID = 'us.amazon.nova-2-lite-v1:0'

history = []

print('Chatbot is ready. Type a message to start the conversation.')

while True:
    user_input = input('User: ').strip()
    if not user_input:
        continue

    history.append({'role': 'user', 'content': [{'text': user_input}]})

    response = client.converse(
        modelId=MODEL_ID,
        system=[{'text': 'You are a helpful AI assistant that gives very short and to the point answers'}],
        messages=history,
    )

    assistant_message = response['output']['message']
    history.append(assistant_message)

    print(f"Assistant: {assistant_message['content'][0]['text']}\n")