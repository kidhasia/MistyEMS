import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeDescription(description) {
  try {
    const prompt = `Please summarize the following task description into clear and concise bullet points:\n\n"${description}"\n\nSummary in bullet points:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes long descriptions into bullet points.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const summary = response.choices[0].message.content.trim();
    return summary;
  } catch (err) {
    console.error('❌ AI Summarization failed:', err.message);
    if (err.response?.data) {
      console.error('🛠️ OpenAI Error Response:', JSON.stringify(err.response.data, null, 2));
    }
    return 'Summarization failed.';
  }
}

export default summarizeDescription;