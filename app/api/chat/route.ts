import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

const ids = Math.floor((Math.random() * 100) + 1);

export const runtime = "edge"

const configuration = new Configuration((() => {
    if (process.env.OPENAI_API_KEY) {
        return { apiKey: process.env.OPENAI_API_KEY };
    }
    return {};
})());


const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
    const json = await req.json()
    const { messages, previewToken } = json

    if (previewToken) {
        configuration.apiKey = previewToken
    }

    if (!Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: "'messages' must be a non-empty array." }), { status: 400 });
    }

    const res = await openai.createChatCompletion({
        model: "gpt-4",
        max_tokens: 4096,
        messages,
        temperature: 0.7,
        stream: true
    })

    const stream = OpenAIStream(res, {
        // This function is called when the API returns a response
        async onCompletion(completion) {
            const title = json.messages[0].content.substring(0, 100)
            const id = json.id ?? ids
            const createdAt = Date.now()
            const path = `/chat/${id}`
            const payload = {
                id,
                title,
                createdAt,
                path,
                messages: [
                    ...messages,
                    {
                        content: completion,
                        role: "assistant"
                    }
                ]
            }
        }
    })

    return new StreamingTextResponse(stream)
}