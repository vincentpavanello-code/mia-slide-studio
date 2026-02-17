// app/api/generate/route.ts

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/ai-prompt';

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { prompt, slideType, existingData } = await req.json();

    if (!prompt || !slideType) {
      return Response.json(
        { error: 'prompt and slideType are required' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Type de slide : ${slideType}
${existingData ? `Données existantes à améliorer : ${JSON.stringify(existingData)}` : ''}
Demande : ${prompt}`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const data = JSON.parse(text);

    return Response.json(data);
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
