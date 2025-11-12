🧠 AI Course Creator

The AI Course Creator is a web-based platform powered by Google Gemini API that automatically generates complete, structured courses based on user input.
Users provide a topic, select language, tone, and difficulty level — and the system generates chapters, explanations, quizzes, and practice questions in real time.

🚀 Features

AI Course Generation – Generates detailed courses using Gemini API.

Structured Output – Each chapter includes explanations, quizzes, and practice questions.

Custom Options – Choose language, tone, and difficulty.

Authentication – Supabase-powered user login system.

Export Options – Allows exporting generated courses as PDF or PPT (coming soon).

Responsive UI – Built with React + Tailwind for smooth UX.

🏗️ Architecture
AICODE-MAIN/
├── server.js              # Node.js backend for Gemini API
├── .env                   # Environment variables
│
├── src/
│   ├── pages/
│   │   ├── CourseCreator.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Analytics.tsx
│   │   └── Settings.tsx
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ui/Toaster.tsx
│   │
│   ├── contexts/AuthContext.tsx
│   ├── lib/supabase.ts
│   ├── App.tsx
│   └── App.css
│
└── README.md

⚙️ Tech Stack

Frontend:

React + TypeScript

Tailwind CSS

Supabase Auth

React Router

Backend:

Node.js

Express.js

Google Generative AI SDK (@google/generative-ai)

dotenv, cors, body-parser

🔑 Environment Setup

Create a .env file in the project root with:

GEMINI_API_KEY=your_google_ai_studio_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

🧩 Installation

1️⃣ Clone the repo:

git clone https://github.com/your-username/ai-course-creator.git
cd ai-course-creator


2️⃣ Install dependencies:

npm install


3️⃣ Run the backend:

node server.js


4️⃣ Run the frontend:

npm run dev


Then open http://localhost:5173.

🧠 How It Works

User enters a topic, selects tone, language, and difficulty.

Backend sends the prompt to Gemini API.

Gemini returns a JSON with course title, chapters, content, and quizzes.

The frontend renders the full course interactively.

(Future) Users can export to PDF or PowerPoint.

🧪 Example Input

Topic: Cloud Computing
Language: English
Tone: Academic
Difficulty: Advanced

Output:

Multiple chapters with 10+ line explanations

10 quiz questions per module

10 open-ended practice questions

💡 Future Enhancements

PDF and PPT export

Save course progress to Supabase

Collaborative editing

Text-to-Speech narration

AI topic suggestion engine

🛠️ Troubleshooting

❌ 404 Error (Model not found)
✅ Ensure model name is valid, e.g. "gemini-1.5-flash-8b" or "gemini-2.0-flash" in server.js.

❌ API Key not working
✅ Verify your key in Google AI Studio
. Make sure it’s active and unrestricted.
