from langchain_community.llms import Bedrock
from langchain_core.prompts import ChatPromptTemplate
import boto3

AWS_REGION = "us-west-2"

bedrock = boto3.client(service_name="bedrock-runtime", region_name=AWS_REGION)

model = Bedrock(model_id="amazon.titan-text-express-v1", client=bedrock)


def invoke_model():
    response = model.invoke("What is the highest mountain in the world?")
    print(response)


def fist_chain():
    template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Write a short description for the product provided by the user",
            ),
            ("human", "{product_name}"),
        ]
    )
    chain = template.pipe(model)

    response = chain.invoke({"product_name": "bicycle"})
    print(response)


fist_chain()
