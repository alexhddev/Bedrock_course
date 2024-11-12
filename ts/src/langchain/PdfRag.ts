import { BedrockEmbeddings } from "@langchain/aws";
import { Bedrock } from "@langchain/community/llms/bedrock";
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'


const AWS_REGION = 'us-west-2'

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION
})

const question = "What themes does Gone with the Wind explore?";

async function main() {
    // create the loader:
    const loader = new PDFLoader('assets/books.pdf', {
        splitPages: false
    });
    const docs = await loader.load();

    // split the docs:
    const splitter = new RecursiveCharacterTextSplitter({
        separators: [`. \n`]
    });

    const splittedDocs = await splitter.splitDocuments(docs);

    const vectorStore = new MemoryVectorStore(
        new BedrockEmbeddings({
            region: AWS_REGION
        })
    );
    await vectorStore.addDocuments(splittedDocs);

    const retriever = vectorStore.asRetriever({
        k: 2
    });

    const results = await retriever.getRelevantDocuments(question);
    const resultDocs = results.map(
        result => result.pageContent
    )

    //build template:
    const template = ChatPromptTemplate.fromMessages([
        ['system', 'Answer the users question based on the following context: {context}'],
        ['user', '{input}']
    ]);

    const chain = template.pipe(model);

    const response = await chain.invoke({
        input: question,
        context: resultDocs
    });

    console.log(response)
}

main();