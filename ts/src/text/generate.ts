import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

const llamaConfig = {
    prompt: 'Tell me a story about a dragon.',
    max_gen_len: 512,
    temperature: 0,
    top_p: 0.9,
}
const llamaModelId = "meta.llama3-70b-instruct-v1:0"


async function invokeModel(){

    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify(llamaConfig),
        modelId: llamaModelId,
        contentType: "application/json",
        accept: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    // console.log(responseBody) // titan
    console.log(responseBody.generation) // llama
}

invokeModel()