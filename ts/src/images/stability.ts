import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { writeFileSync } from 'fs'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

const stabilityImageConfig = {
    text_prompts: [
        {
            text: 'a photo of a dragon',
        }
    ],
    height: 512,
    width: 512,
    cfg_scale: 10,
    style_preset: '3d-model',
}

async function invokeModel() {
    const response = await client.send(new InvokeModelCommand({
        modelId: 'stability.stable-diffusion-xl-v1',
        body: JSON.stringify(stabilityImageConfig),
        accept: 'application/json',
        contentType: 'application/json'
    }));
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    saveImage(responseBody.artifacts[0].base64, 'dragonDiffusion.png');
}

function saveImage(base64Data: string, fileName: string) {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    writeFileSync(fileName, imageBuffer);
}

invokeModel();