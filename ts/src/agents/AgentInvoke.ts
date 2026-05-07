import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
    InvokeAgentCommandOutput,
} from "@aws-sdk/client-bedrock-agent-runtime";

async function main() {

    const client = new BedrockAgentRuntimeClient({
        region: 'us-east-1',
    })

    const command = new InvokeAgentCommand({
        agentId: 'GU3NYK7MNM', // replace with the Agent ID
        agentAliasId: 'TSTALIASID',
        sessionId: '123',
        inputText: 'What are the key definitions?'
    })

    try {
        const response = await client.send(command)
        const decodedResponse = await decodeResponse(response);
        console.log(decodedResponse)
    } catch (error) {
        console.error(error)
    }
}

async function decodeResponse(response: InvokeAgentCommandOutput) {
    let completion = "";
    if (response.completion) {
        for await (const chunkEvent of response.completion) {
            const chunk = chunkEvent.chunk;
            console.log(chunk);
            if (chunk) {
                const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                completion += decodedResponse;
            }
        }
    }
    return completion
}

main()
