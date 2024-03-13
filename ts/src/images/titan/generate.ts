// takes a lot of experimentation to get the right image

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { writeFileSync } from 'fs'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

const titanImageConfig = {
    taskType: "TEXT_IMAGE",
    textToImageParams: {
        text: "cat on a mat on a country hillside",      
    },
    imageGenerationConfig: {
        numberOfImages: 1,
        height: 512,
        width: 512,
        cfgScale: 8.0,
    }
}

async function invokeModel() {
    const response = await client.send(new InvokeModelCommand({
        modelId: 'amazon.titan-image-generator-v1',
        body: JSON.stringify(titanImageConfig),
        accept: 'application/json',
        contentType: 'application/json'
    }));
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    saveImage(responseBody.images[0], 'cat.png');
}

function saveImage(base64Data: string, fileName: string) {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    writeFileSync(fileName, imageBuffer);
}

invokeModel();