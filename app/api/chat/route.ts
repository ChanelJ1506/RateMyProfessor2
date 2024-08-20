

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
    const data = await request.json();
    const messages = data.messages;
    if (!messages) return Response.json({ error: "No messages provided" });

    const iterator = messagesIterator(messages);
    const stream = iteratorToStream(iterator);

    return new Response(stream);
}

async function* messagesIterator(messages: any) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
                For every user question, the top 3 professors that match the user question are returned.
                Use them to answer the question if needed. Make sure to keep the text concise and paragraphed.`,
            },
            ...messages,
        ],
        model: "mixtral-8x7b-32768",
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        stream: true,
        stop: null,
    });

    for await (const chunk of chatCompletion) {
        yield chunk.choices[0]?.delta?.content || "";
    }
}

function iteratorToStream(iterator: AsyncIterator<string>) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        async start(controller) {
            async function push() {
                const { done, value } = await iterator.next();
                if (done) {
                    controller.close();
                    return;
                }
                controller.enqueue(encoder.encode(value));
                push();
            }
            push();
        },
    });
}


//Junk Code: Saved Just in Case
// import { NextResponse } from 'next/server'
// import { Pinecone } from '@pinecone-database/pinecone'
// import OpenAI from 'openai'

// const systemPrompt = `
// You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
// For every user question, the top 3 professors that match the user question are returned.
// Use them to answer the question if needed.
// `
// export async function POST(req) {
//   const data = await req.json()

//   const pc = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY,
//   })
//   const index = pc.index('rag').namespace('ns1')
//   const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
//     })

//   const text = data[data.length - 1].content
//   const embedding = await openai.embeddings.create({
//     model: 'text-embedding-3-small',
//     input: text,
//     encoding_format: 'float',
//   })
//   const results = await index.query({
//     topK: 5,
//     includeMetadata: true,
//     vector: embedding.data[0].embedding,
//   })
//   let resultString = ''
//   results.matches.forEach((match) => {
//     resultString += `
//     Returned Results:
//     Professor: ${match.id}
//     Review: ${match.metadata.stars}
//     Subject: ${match.metadata.subject}
//     Stars: ${match.metadata.stars}
//     \n\n`
//   })
//   const lastMessage = data[data.length - 1]
//   const lastMessageContent = lastMessage.content + resultString
//   const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

//   const completion = await openai.chat.completions.create({
//     messages: [
//       {role: 'system', content: systemPrompt},
//       ...lastDataWithoutLastMessage,
//       {role: 'user', content: lastMessageContent},
//     ],
//     model: 'meta-llama/llama-3.1-8b-instruct:free',
//     stream: true,
//   })

//   const stream = new ReadableStream({
//     async start(controller) {
//       const encoder = new TextEncoder()
//       try {
//         for await (const chunk of completion) {
//           const content = chunk.choices[0]?.delta?.content
//           if (content) {
//             const text = encoder.encode(content)
//             controller.enqueue(text)
//           }
//         }
//       } catch (err) {
//         controller.error(err)
//       } finally {
//         controller.close()
//       }
//     },
//   })
//   return new NextResponse(stream)
// }