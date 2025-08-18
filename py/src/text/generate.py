import boto3
import json
import pprint

client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")

titan_model_id = 'amazon.titan-text-express-v1'

titan_config = json.dumps({
            "inputText": "Tell me a story about a dragon",
            "textGenerationConfig": {
                "maxTokenCount": 4096,
                "stopSequences": [],
                "temperature": 0,
                "topP": 1
            }
        })

llama_model_id = "meta.llama3-70b-instruct-v1:0"
llama_config = json.dumps({
    "prompt": "Tell me a story about a dragon",
    "max_gen_len": 512,
    "temperature": 0,
    "top_p": 0.9,
})

response = client.invoke_model(
    body=llama_config,
    modelId=llama_model_id,
    accept="application/json",
    contentType="application/json"
)

response_body = json.loads(response.get('body').read())

pp = pprint.PrettyPrinter(depth=4)
# pp.pprint(response_body.get('results')) # titan config
pp.pprint(response_body["generation"]) # llama config