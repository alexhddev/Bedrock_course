import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { readFileSync } from 'fs'
import { cosineSimilarity } from './similarity';

const images = [
    'images/1.png',
    'images/2.png',
    'images/3.png',
]

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

async function getImageEmbedding(imagePath: string): Promise<number[]> {
    const base64Image = readFileSync(imagePath).toString('base64');

    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify({
            "inputImage": base64Image
        }),        
        modelId: 'amazon.titan-embed-image-v1',
        accept: 'application/json',
        contentType: 'application/json',
    }))
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding
}

type ImageWithEmbedding = {
    path: string
    embedding: number[]
}

async function main(){
    const imagesWithEmbeddings: ImageWithEmbedding[] = []
    for (const imagePath of images) {
        const embedding = await getImageEmbedding(imagePath)
        imagesWithEmbeddings.push({path: imagePath, embedding})
    }

    const testImage = 'images/cat.png'

    const testImageEmbedding = await getImageEmbedding(testImage)

    const similarities: {
        path: string,
        similarity: number
    }[] = [];

    for (const imageWithEmbedding of imagesWithEmbeddings) {
        const similarity = cosineSimilarity(imageWithEmbedding.embedding, testImageEmbedding)
        similarities.push({path: imageWithEmbedding.path, similarity})
    }

    console.log(`Similarity of ${testImage} with:`)
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach(similarity => {
        console.log(`${similarity.path}: ${similarity.similarity.toPrecision(2)}`);
    })
}

main();