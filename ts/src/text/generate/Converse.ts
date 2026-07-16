import {
    BedrockRuntimeClient,
    ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

const MODEL_ID = 'us.amazon.nova-2-lite-v1:0'

async function basicConverse() {
    const response = await client.send(new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
            { role: 'user', content: [{ text: 'Tell me a story about a dragon' }] },
        ],
    }))

    console.log(response.output?.message?.content?.[0]?.text)
}

async function converseWithSystemPrompt() {
    const response = await client.send(new ConverseCommand({
        modelId: MODEL_ID,
        system:[{
            text: 'You are a helpful AI assistant that talks like a bro'
        }],
        messages: [
            { role: 'user', content: [{ text: 'Tell me a story about a dragon' }] },
        ],
    }))

    console.log(response.output?.message?.content?.[0]?.text)
}

converseWithSystemPrompt()