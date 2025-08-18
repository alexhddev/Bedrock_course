from langchain_aws import BedrockLLM as Bedrock
from langchain_core.prompts import PromptTemplate
import boto3

AWS_REGION = "us-west-2"

bedrock = boto3.client(service_name="bedrock-runtime", region_name=AWS_REGION)

model = Bedrock(model_id="amazon.titan-text-express-v1", client=bedrock)


def invoke_model():
    response = model.invoke("What is the highest mountain in the world?")
    print(response)


def first_chain():
    # Use a plain PromptTemplate with a text LLM (Titan Text Express)
    prompt = PromptTemplate.from_template(
        "Write a short, compelling product description for: {product_name}"
    )
    chain = prompt | model

    response = chain.invoke({"product_name": "bicycle"})
    print(response)


first_chain()
