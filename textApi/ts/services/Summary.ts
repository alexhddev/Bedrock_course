import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const AWS_REGION_BEDROCK = "eu-central-1";

const client = new BedrockRuntimeClient({ region: AWS_REGION_BEDROCK });

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    if (event.body) {
        const parsedBody = JSON.parse(event.body);
        const numberOfPoints = event.queryStringParameters?.points

        if (parsedBody.text && numberOfPoints) {
            const text = parsedBody.text;
            const titanConfig = getTitanConfig(text, numberOfPoints);

            const response = await client.send(new InvokeModelCommand({
                modelId: 'amazon.titan-text-express-v1',
                body: JSON.stringify(titanConfig),
                accept: 'application/json',
                contentType: 'application/json'
            }));
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            const firstResult = responseBody.results[0];
            if(firstResult && firstResult.outputText) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ summary: firstResult.outputText })                
                }
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" })
    }

}


function getTitanConfig(text: string, points: string) {

    const prompt = `Text: ${text}\\n
        From the text above, summarize the story in ${points} points.\\n
    `;

    return {
        inputText: prompt,
        textGenerationConfig: {
            maxTokenCount: 4096,
            stopSequences: [],
            temperature: 0,
            topP: 1,
        },
    };
}

