import { handler } from './Rag'

async function testRag() {
    const result = await handler({
        body: JSON.stringify({ question: 'What does GDPR stand for?'})
    } as any, {} as any)
    console.log(result)
}

testRag()