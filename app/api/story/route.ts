import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { theme, characters, readingLevel, description } = await req.json();

    const storyPrompt = `Create a short story for children at reading level ${readingLevel}. 
    Theme: ${theme}
    Characters: ${characters}
    Additional details: ${description}
    
    The story should be educational, engaging, and divided into 3-4 clear paragraphs. 
    For each paragraph, create 2 multiple-choice comprehension questions that test understanding of that specific paragraph's content. The questions must exist within the paragraph, YOU MUST FOLLOW THIS RULE.
    Format the response as a JSON object with this structure:
    {
      "title": "Story title",
      "story": ["paragraph1", "paragraph2", "paragraph3"],
      "questions": [
        {
          "paragraph": 0,
          "questions": [
            {
              "question": "Question about paragraph 1",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 0
            },
            {
              "question": "Another question about paragraph 1",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 1
            }
          ]
        },
        {
          "paragraph": 1,
          "questions": [
            {
              "question": "Question about paragraph 2",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 2
            },
            {
              "question": "Another question about paragraph 2",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 1
            }
          ]
        },
        {
          "paragraph": 2,
          "questions": [
            {
              "question": "Question about paragraph 3",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 3
            },
            {
              "question": "Another question about paragraph 3",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 0
            }
          ]
        }
      ]
    }`;

    console.log(storyPrompt);

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [{ role: 'user', content: storyPrompt }],
    });

    const storyContent = JSON.parse(response.content[0].text);
    return NextResponse.json(storyContent);
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}
