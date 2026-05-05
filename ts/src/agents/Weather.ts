import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

const modelId = 'amazon.nova-lite-v1:0'

// Define a tool
const tools = [
    {
        toolSpec: {
            name: 'get_weather',
            description: 'Get the current weather for a given city.',
            inputSchema: {
                json: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: 'The city name, e.g. Seattle',
                        },
                    },
                    required: ['city'],
                },
            },
        },
    },
]

// Simulate the tool executing
function get_weather(city: string): string {
    return `The weather in ${city} is 72°F and sunny.`
}

async function runWithTools() {
    const messages: any[] = [
        { role: 'user', content: [{ text: "What's the weather in Seattle?" }] },
    ]

    // First call — model decides to use a tool
    const response = await client.send(new ConverseCommand({
        modelId,
        messages,
        toolConfig: { tools },
    }))

    const output = response.output?.message!
    messages.push(output) // add assistant message to history

    // Check if the model wants to use a tool
    if (response.stopReason === 'tool_use') {
        const toolUseBlock = output.content?.find(b => b.toolUse)?.toolUse!
        const toolName = toolUseBlock.name!
        const toolInput = toolUseBlock.input as { city: string }

        console.log(`Model called tool: ${toolName}`, toolInput)

        // Execute the tool
        const toolResult = get_weather(toolInput.city)

        // Send the result back
        messages.push({
            role: 'user',
            content: [{
                toolResult: {
                    toolUseId: toolUseBlock.toolUseId,
                    content: [{ text: toolResult }],
                },
            }],
        })

        // Second call — model uses the result to respond
        const finalResponse = await client.send(new ConverseCommand({
            modelId,
            messages,
            toolConfig: { tools },
        }))

        const finalText = finalResponse.output?.message?.content?.[0]?.text
        console.log('Final response:', finalText)
    }
}

runWithTools()