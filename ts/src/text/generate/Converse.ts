import {
    BedrockRuntimeClient,
    ConverseCommand,
    Message,
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })
const MODEL_ID = 'us.amazon.nova-2-lite-v1:0'

// --- 1. Basic request ---
async function basicConverse() {
    const response = await client.send(new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
            { role: 'user', content: [{ text: 'Tell me a story about a dragon' }] },
        ],
    }))

    console.log(response.output?.message?.content?.[0]?.text)
}

// --- 2. System prompt ---
async function converseWithSystemPrompt() {
    const response = await client.send(new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: 'You are a helpful AI assistant that talks like a bro' }],
        messages: [
            { role: 'user', content: [{ text: 'Tell me a story about a dragon' }] },
        ],
    }))

    console.log(response.output?.message?.content?.[0]?.text)
}

// --- 3. Inference parameters ---
async function converseWithInferenceParams() {
    const response = await client.send(new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
            { role: 'user', content: [{ text: 'Tell me a story about a dragon' }] },
        ],
        inferenceConfig: {
            maxTokens: 512,
            temperature: 0.7,
            topP: 0.9,
            stopSequences: ['END'],
        },
    }))

    console.log(response.output?.message?.content?.[0]?.text)
}

// --- 4. Multi-turn conversation ---
async function multiTurnConverse() {
    const history: Message[] = []

    const turns = [
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

// --- 5. Reasoning (extended thinking) ---
async function converseWithReasoning() {
    const response = await client.send(new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: 'You are a highly capable personal assistant.' }],
        messages: [
            { role: 'user', content: [{ text: 'Provide a meal plan for a gluten-free family of 4.' }] },
        ],
        inferenceConfig: { maxTokens: 10000 },
        additionalModelRequestFields: {
            reasoningConfig: { type: 'enabled', maxReasoningEffort: 'low' },
        },
    }))

    for (const block of response.output?.message?.content ?? []) {
        if (block.text) console.log('Answer:', block.text)
        // reasoning text is [REDACTED] in Nova 2 but the field is still present
        if ((block as any).reasoningContent) console.log('Reasoning:', (block as any).reasoningContent)
    }
}

multiTurnConverse()