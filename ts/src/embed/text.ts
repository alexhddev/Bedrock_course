import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { cosineSimilarity } from './similarity';

const facts = [
    'The first computer was invented in the 1940s.',
    'John F. Kennedy was the 35th President of the United States.',
    'The first moon landing was in 1969.',
    'The capital of France is Paris.',
    'Earth is the third planet from the sun.',
]

const newFact = 'Who is the president of USA?'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

async function getEmbedding(input: string): Promise<number[]> {
    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify({inputText: input}),
        
        modelId: 'amazon.titan-embed-text-v1',
        contentType: 'application/json',
        accept: 'application/json',
    }))
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding
}

type FactWithEmbedding = {
    fact: string
    embedding: number[]
}

async function main() {
    const factsWithEmbeddings: FactWithEmbedding[] = []

    for (const fact of facts) {
        const embedding = await getEmbedding(fact)
        factsWithEmbeddings.push({fact, embedding})
    }

    const newFactEmbedding = await getEmbedding(newFact)

    const similarities: {
        input: string,
        similarity: number
    }[] = [];

    for (const factWithEmbedding of factsWithEmbeddings) {
        const similarity = cosineSimilarity(factWithEmbedding.embedding, newFactEmbedding)
        similarities.push({input: factWithEmbedding.fact, similarity})
    }

    console.log(`Similarity of ${newFact} with:`)
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity.toPrecision(2)}`);
    })    
}

main();



