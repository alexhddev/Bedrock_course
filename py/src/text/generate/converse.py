import boto3

MODEL_ID = 'us.amazon.nova-2-lite-v1:0'

bedrock = boto3.client('bedrock-runtime', region_name='us-west-2')

def get_text(response):
    content_list = response["output"]["message"]["content"]
    return next((item["text"] for item in content_list if "text" in item), None)

# 1. Basic request structure
def basic_request():
    response = bedrock.converse(
        modelId=MODEL_ID,
        messages=[
            {
                'role': 'user',
                'content': [{'text': 'Tell me a story about a dragon'}]
            }
        ]
    )

    text = get_text(response)
    if text is not None:
        print(text)

# 2. Using system prompts
def system_prompt():
    response = bedrock.converse(
        modelId=MODEL_ID,
        system=[
            {'text': 'You are a helpful AI assistant that talks like a bro'}
        ],
        messages=[
            {
                'role': 'user',
                'content': [{'text': 'Tell me a story about a dragon'}]
            }
        ]
    )

    text = get_text(response)
    if text is not None:
        print(text)

if __name__ == '__main__':
    system_prompt()
