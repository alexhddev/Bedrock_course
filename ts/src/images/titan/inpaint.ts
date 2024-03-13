import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { writeFileSync, readFileSync } from 'fs'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

function getConfig(inputImage: string){
    return {
        taskType: "INPAINTING",
        inPaintingParams: {
            text: "Make the cat black and blue",
            negativeText: "bad quality, low res",
            image: inputImage,
            maskPrompt: "cat"
        },
        imageGenerationConfig: {
            numberOfImages: 1,
            height: 512,
            width: 512,
            cfgScale: 8.0,
        }
    }
}

async function invokeModel() {
    const image = readImage('cat.png');
    const config = getConfig(image);
    const response = await client.send(new InvokeModelCommand({
        modelId: 'amazon.titan-image-generator-v1',
        body: JSON.stringify(config),
        accept: 'application/json',
        contentType: 'application/json'
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    saveImage(responseBody.images[0], 'catEdited.png');
}

function readImage(imagePath:string){
    const data = readFileSync(imagePath);
    return data.toString('base64');
}

function saveImage(base64Data: string, fileName: string) {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    writeFileSync(fileName, imageBuffer);
}

invokeModel();

