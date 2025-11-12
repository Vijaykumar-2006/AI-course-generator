// server/generate-course.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';

const router = express.Router();

// initialise Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-course', async (req, res) => {
  const { topic, language, tone, difficulty } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Generate a course in **valid JSON only** with keys: title, description, outline.
Each outline item must have: module (number), title, description, topics (array of strings), estimated_time.
Topic: "${topic}".
Language: ${language}, Tone: ${tone}, Difficulty: ${difficulty}.
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // remove ```json fences if any
    text = text.replace(/```json|```/gi, '').trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = { title: 'Generated Course', description: text, outline: [] };
    }

    res.json(data); // send clean JSON
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

export default router;
