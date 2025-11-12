// pages/api/generate-course.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // set this in Vercel env

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { topic, language, tone, difficulty, duration, audience } = req.body;

  if (!topic) {
    res.status(400).json({ error: 'Missing topic' });
    return;
  }

  try {
    // pick a working Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Generate a course in JSON with keys: title, description, outline.
Topic: "${topic}".
Language: ${language}, Tone: ${tone}, Difficulty: ${difficulty}, Duration: ${duration} minutes, Audience: ${audience}.
Return valid JSON only.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // fallback if model returns text not wrapped in JSON
      data = { title: 'Generated Course', description: text, outline: [] };
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to generate course' });
  }
}
