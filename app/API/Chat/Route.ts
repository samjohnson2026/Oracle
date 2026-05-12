import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

// Create the OpenRouter instance using your single key
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60; // 2026 models are powerful but can be slow

export async function POST(req: Request) {
  const { prompt, modelId } = await req.json();

  // Map your internal model names to OpenRouter IDs (2026 flagship versions)
  const modelMapping: Record<string, string> = {
    chatgpt: 'openai/gpt-5.5',
    claude: 'anthropic/claude-4-opus',
    gemini: 'google/gemini-3.1-ultra',
    grok: 'xai/grok-4.3',
    deepseek: 'deepseek/deepseek-v3.2-speciale',
    copilot: 'openai/gpt-5.5-preview', // Proxy for Copilot Pro
  };

  const result = await streamText({
    model: openrouter(modelMapping[modelId]),
    prompt: prompt,
    headers: {
      "HTTP-Referer": "https://your-site.vercel.app", // Optional for OpenRouter rankings
      "X-Title": "AI Comparison Hub",
    }
  });

  return result.toDataStreamResponse();
}
