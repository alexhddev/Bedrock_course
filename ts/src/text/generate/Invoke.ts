import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

const config = {
    prompt: 'Tell me a short story about a dragon.'
}

const modelId = 'meta.llama3-70b-instruct-v1:0'

async function invokeModel() {
    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify(config),
        modelId: modelId,
        contentType: "application/json",
        accept: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    console.log(responseBody.generation)    
}

invokeModel()