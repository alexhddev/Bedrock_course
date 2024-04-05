import boto3
import json

AWS_REGION_BEDROCK = "us-west-2"

client = boto3.client(
    service_name="bedrock-agent-runtime", region_name=AWS_REGION_BEDROCK
)

def handler(event, context):
    body = json.loads(event["body"])
    question = body.get("question")
    if question:
        response = client.retrieve_and_generate(
            input={"text": question},
            retrieveAndGenerateConfiguration={
                "type": "KNOWLEDGE_BASE",
                "knowledgeBaseConfiguration": {
                    "knowledgeBaseId": "PSX4JIJMQN",
                    "modelArn": "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-v2",
                },
            },
        )
        answer = response.get("output").get("text")
        return {
            "statusCode": 200,
            "body": json.dumps({"answer": answer}),
        }
    return {
            "statusCode": 400,
            "body": json.dumps({"error": "question needed"}),
        }


