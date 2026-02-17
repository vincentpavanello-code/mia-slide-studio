// app/api/generate/route.ts
// Génère du HTML/CSS complet pour un slide (mode artefact)

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/ai-prompt';

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const html =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract title from generated HTML (look for first h1 content)
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Slide généré';

    return Response.json({ html, title });
  } catch (error) {
    console.error('AI generation error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: `Erreur lors de la génération : ${errorMessage}` },
      { status: 500 }
    );
  }
}
