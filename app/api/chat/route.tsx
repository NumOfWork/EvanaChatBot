import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider";
const aiChat = async (req: Request): Promise<Response | undefined> => {
  const { messages } = await req.json();

  const ollama = createOllama({});
  const result = streamText({
    model: ollama("llama3:8b"),
    messages,
  });

  return result.toDataStreamResponse();
};

export const POST = aiChat;
