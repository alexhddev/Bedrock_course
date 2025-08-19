import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { writeFileSync } from 'fs'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

const stabilityImageConfig = {
    prompt: 'a photo of a dragon'
}

async function invokeModel() {
    const response = await client.send(new InvokeModelCommand({
        modelId: 'stability.stable-image-core-v1:1',
        body: JSON.stringify(stabilityImageConfig),
        accept: 'application/json',
        contentType: 'application/json'
    }));
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    saveImage(responseBody.images[0], 'dragonDiffusion.png');
}

function saveImage(base64Data: string, fileName: string) {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    writeFileSync(fileName, imageBuffer);
}

invokeModel();
