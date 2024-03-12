import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'eu-central-1' })

const prompt = `
    Alex: Hey, Emily! How's it going?
    Emily: Alex! I'm doing well, thanks. How about you?
    Alex: Can't complain, just enjoying the weekend vibes. Speaking of which, do you have any plans for this weekend?
    Emily: Not yet, I was actually hoping we could plan something fun. Any ideas?
    Alex: I was thinking the same thing! How about a picnic at Riverside Park? We could bring some snacks, play frisbee, and just relax.
    Emily: That sounds fantastic! I love the idea. Should we invite Jordan and Casey as well?
    Alex: Absolutely, the more, the merrier. I'll text them and see if they're free.
    Emily: Great! I can prepare some sandwiches and a salad. Oh, and I'll bake those chocolate chip cookies you love.
    Alex: You're the best, Em! Those cookies are irresistible. I'll bring drinks and some fruit. Do we want to meet around noon?
    Emily: Noon works perfectly for me. It gives us plenty of time to enjoy the day.
    Alex: Agreed. I'm really looking forward to this. It's been too long since we all hung out like this.
    Emily: Same here, Alex. It'll be like old times. Just relaxing and catching up with good friends.
    Alex: Couldn't have said it better myself. Alright, I'll coordinate with Jordan and Casey and let you know if anything changes.
    Emily: Sounds good! Thanks for organizing this, Alex. I'm already excited for the weekend.
    Alex: Anytime, Em. It's going to be a blast. I'll see you on Saturday!
    Emily: See you then! Bye, Alex.
    Alex: Bye, Emily!
    From the call transcript above, crate a summary of the conversation in maximum 30 words.
`

async function invokeModel() {

    const textGenerationConfig = {
        maxTokenCount: 4096,
        stopSequences: [],
        temperature: 0,
        topP: 1,
    };

    const payload = {
        inputText: prompt,
        textGenerationConfig,
    };

    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify(payload),

        modelId: 'amazon.titan-text-express-v1',
        contentType: 'application/json',
        accept: 'application/json',
    }))
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log(responseBody)
}
invokeModel()