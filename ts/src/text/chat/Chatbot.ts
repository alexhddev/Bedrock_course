import {
    BedrockRuntimeClient,
    ConverseCommand,
    Message,
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })
const MODEL_ID = 'us.amazon.nova-2-lite-v1:0'

async function main() {
    const history: Message[] = []

    console.log('Chatbot is ready. Type a message to start the conversation.')

    process.stdin.addListener('data', async (input) => {
        const userInput = input.toString().trim();

        history.push({ role: 'user', content: [{ text: userInput }] })

        const response = await client.send(new ConverseCommand({
            modelId: MODEL_ID,
            system: [{ text: 'You are a helpful AI assistant that gives very short and to the point answers' }],
            messages: history,
        }))

        const assistantMessage = response.output?.message!
        history.push(assistantMessage)

        console.log(`Assistant: ${assistantMessage.content?.[0]?.text}\n`)
    })
}

main()