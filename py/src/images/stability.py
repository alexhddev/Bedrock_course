import boto3
import json
import base64

client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")

stability_image_config = json.dumps({
    "prompt": "a photo of a dragon"
})

response = client.invoke_model(
    body=stability_image_config, 
    modelId="stability.stable-image-core-v1:1", 
    accept="application/json", 
    contentType="application/json")

response_body = json.loads(response.get("body").read())
base64_image = response_body.get("images")[0]

base_64_image = base64.b64decode(base64_image)

file_path = "dragon.png"
with open(file_path, "wb") as f:
    f.write(base_64_image)
