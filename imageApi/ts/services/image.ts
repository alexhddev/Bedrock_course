import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const AWS_REGION_BEDROCK = "us-west-2";
const S3_BUCKET = "images-bucket-111"

const client = new BedrockRuntimeClient({ region: AWS_REGION_BEDROCK });
const s3Client = new S3Client();

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let response: APIGatewayProxyResult = {} as any;

    if (event.body) {
        const parsedBody = JSON.parse(event.body);
        if (parsedBody.description) {
            const description = parsedBody.description;
            const titanConfig = getTitanConfig(description);

            const response = await client.send(new InvokeModelCommand({
                modelId: 'amazon.titan-image-generator-v1',
                body: JSON.stringify(titanConfig),
                accept: 'application/json',
                contentType: 'application/json'
            }));
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            if (responseBody.images) {
                const image = responseBody.images[0];
                const signedUrl = await saveImageToS3(image);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ url: signedUrl })
                }
            }
        }
    }
    response.statusCode = 400;
    response.body = JSON.stringify({ message: "Invalid request" });

    return response;
}

async function saveImageToS3(image: string) {

    const imageFile = Buffer.from(image, 'base64');

    const now = Date.now();

    const imageName = `${now}.jpg`

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: imageName,
        Body: imageFile
    });
    await s3Client.send(command);

    const getObjectCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: imageName
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn: 3600,
    });
    return signedUrl;
}




function getTitanConfig(description: string) {
    return {
        taskType: "TEXT_IMAGE",
        textToImageParams: {
            text: description,
        },
        imageGenerationConfig: {
            numberOfImages: 1,
            height: 512,
            width: 512,
            cfgScale: 8.0,
        }
    }
}