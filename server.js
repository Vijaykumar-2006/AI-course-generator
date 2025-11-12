// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate-course', async (req, res) => {
  const { topic, language, tone, difficulty } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `
Generate a complete course in **valid JSON only** with these keys:

"title": string,
"description": string,
"chapters": array of objects, each with:
  "title": string,
  "content": several paragraphs of detailed explanation (book style),
  "quiz": array of 5 multiple-choice questions (each has "question", "options", "answer"),
  "questions_bank": array of 5 open-ended practice questions.

Topic: ${topic}.
Language: ${language}.
Tone: ${tone}.
Difficulty: ${difficulty}.

Return valid JSON only, no markdown fences.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // clean up fences
    let text = result.response.text().trim();
    text = text.replace(/```json|```/gi, '').trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { title: 'Generated Course', description: text, chapters: [] };
    }

    res.json(data);
  } catch (err) {
    console.error('Error generating course with Gemini:', err);
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
