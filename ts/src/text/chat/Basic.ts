import {
    BedrockRuntimeClient,
    ConverseCommand,
    Message,
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })
const MODEL_ID = 'us.amazon.nova-2-lite-v1:0'


async function multiTurnConverse() {
    const history: Message[] = []

    const turns: Array<string> = [
        'What is the capital of France?',
        'What is it famous for?',
    ]

    for (const userText of turns) {
        history.push({ role: 'user', content: [{ text: userText }] })

        const response = await client.send(new ConverseCommand({
            modelId: MODEL_ID,
            messages: history,
        }))

        const assistantMessage = response.output?.message!
        history.push(assistantMessage)

        console.log(`User: ${userText}`)
        console.log(`Assistant: ${assistantMessage.content?.[0]?.text}\n`)
    }
}

multiTurnConverse()