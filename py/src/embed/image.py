import boto3
import json
import base64

from similarity import cosineSimilarity

client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")

images = [
    'images/1.png',
    'images/2.png',
    'images/3.png',
]

def getImagesEmbedding(imagePath: str):
    with open(imagePath, "rb") as f:
        base_image = base64.b64encode(f.read()).decode("utf-8")

    response = client.invoke_model(
        body=json.dumps({
            "inputImage": base_image,
        }), 
        modelId='amazon.titan-embed-image-v1', 
        accept='application/json', 
        contentType='application/json')

    response_body = json.loads(response.get('body').read())
    return response_body.get('embedding')

imagesWithEmbeddings = []

for image in images:
    imagesWithEmbeddings.append({
        'path': image,
        'embedding': getImagesEmbedding(image)
    })

test_image = 'images/cat.png'

test_image_embedding = getImagesEmbedding(test_image)

similarities = []

for image in imagesWithEmbeddings:
    similarities.append({
        'path': image['path'],
        'similarity': cosineSimilarity(image['embedding'], test_image_embedding)
    })

similarities.sort(key=lambda x: x['similarity'], reverse=True)

print(f"Similarities of '{test_image}' with:")
for similarity in similarities:
    print(f"  '{similarity['path']}': {similarity['similarity']:.2f}")