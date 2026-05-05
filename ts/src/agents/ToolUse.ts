import { BedrockRuntimeClient, ConverseCommand, ToolConfiguration } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({
    region: 'us-east-1'
})

const modelId = 'amazon.nova-lite-v1:0'

const toolConfig: ToolConfiguration = {
    tools: [{
        toolSpec: {
            name: 'get_weather',
            description: 'Get the current weather for a given city.',
            inputSchema: {
                json: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: 'The city name, e.g. London',
                        },
                    },
                    required: ['city'],
                }
            }
        }
    }]
}

async function invokeModel() {
    const messages: any[] = [
        {
            role: 'user',
            content: [{
                text: 'What is the weather in London?'
            }]
        }
    ]

    const response = await client.send(new ConverseCommand({
        modelId,
        messages,
        toolConfig: toolConfig
    }))
    const output = response.output?.message
    messages.push(output)

    if (response.stopReason === 'tool_use') {
        const toolUseBlock = output!.content?.find(b => b.toolUse)?.toolUse!
        const toolName = toolUseBlock.name!
        if (toolName === 'get_weather') {
            const toolInput = toolUseBlock.input as { city: string }
            // Execute the tool
            const toolResult = getWeather(toolInput.city)

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
                toolConfig: toolConfig,
            }))
            const finalText = finalResponse.output?.message?.content?.[0]?.text
            console.log('Final response:', finalText)
        }


    }









}

function getWeather(city: string): string {
    return `The weather in ${city} is 72°F and sunny.`
}

invokeModel()