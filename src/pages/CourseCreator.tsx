import React, { useState } from 'react';

interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

interface Chapter {
  title: string;
  content: string;
  quiz?: QuizItem[];
  questions_bank?: string[];
}

interface CourseData {
  title?: string;
  description?: string;
  chapters?: Chapter[];
}

const CourseCreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Professional');
  const [difficulty, setDifficulty] = useState('Intermediate');

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateCourse = async () => {
    setLoading(true);
    setCourseData(null);

    try {
      const response = await fetch('http://localhost:5000/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language, tone, difficulty }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      let data = await response.json();

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          data = { description: data };
        }
      }

      setCourseData(data);
    } catch (error) {
      console.error('Error generating course:', error);
      setCourseData({
        title: 'Error',
        description: 'There was an error generating the course.',
        chapters: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Course Creator</h1>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Enter your topic"
          className="border p-2 rounded w-full"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Chinese">Chinese</option>
        </select>

        <select
          className="border p-2 rounded w-full"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="Professional">Professional</option>
          <option value="Casual">Casual</option>
          <option value="Friendly">Friendly</option>
          <option value="Academic">Academic</option>
        </select>

        <select
          className="border p-2 rounded w-full"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button
          onClick={handleGenerateCourse}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
      </div>

      {courseData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">{courseData.title}</h2>
          <p className="mb-4 whitespace-pre-line">{courseData.description}</p>

          {courseData.chapters && (
            <div>
              {courseData.chapters.map((ch, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="font-bold text-lg">{ch.title}</h3>
                  <p className="mb-2 whitespace-pre-line">{ch.content}</p>

                  {ch.quiz && (
                    <>
                      <h4 className="font-semibold">Quiz:</h4>
                      <ul className="list-disc pl-5">
                        {ch.quiz.map((q, i) => (
                          <li key={i}>
                            <strong>{q.question}</strong>
                            <ul className="list-circle pl-5">
                              {q.options.map((opt, j) => (
                                <li key={j}>{opt}</li>
                              ))}
                            </ul>
                            <em>Answer: {q.answer}</em>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {ch.questions_bank && (
                    <>
                      <h4 className="font-semibold mt-3">Practice Questions:</h4>
                      <ul className="list-disc pl-5">
                        {ch.questions_bank.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCreator;
