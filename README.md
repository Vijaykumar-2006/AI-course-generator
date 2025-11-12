# 🧠 AI Course Creator

The **AI Course Creator** is a web-based platform powered by **Google Gemini API** that automatically generates complete, structured courses from user input.  
Users can specify a **topic**, select **language**, **tone**, and **difficulty level** — and the system dynamically produces chapters, explanations, quizzes, and practice questions in real time.

---

## 🚀 Features

- **AI Course Generation** – Automatically builds comprehensive course content using the Gemini API.  
- **Structured Output** – Each course includes detailed explanations, quizzes, and practice problems.  
- **Custom Options** – Choose the tone, difficulty, and preferred language for generation.  
- **Authentication** – Secure user login system powered by **Supabase**.  
- **Export Options** – Planned features include PDF and PowerPoint exports.  
- **Responsive UI** – Developed with **React + Tailwind CSS** for a smooth user experience.

---

## 🏗️ Project Architecture

'''

AICODE-MAIN/

├── server.js # Node.js backend for Gemini API    
├── .env # Environment variables   
│   
├── src/ 
│ ├── pages/ 
│ │ ├── CourseCreator.tsx 
│ │ ├── Dashboard.tsx
│ │ ├── Login.tsx
│ │ ├── Analytics.tsx
│ │ └── Settings.tsx
│ │
│ ├── components/
│ │ ├── Layout.tsx
│ │ └── ui/Toaster.tsx
│ │
│ ├── contexts/AuthContext.tsx
│ ├── lib/supabase.ts
│ ├── App.tsx
│ └── App.css
│
└── README.md

'''

---

## ⚙️ Tech Stack

### **Frontend**
- React + TypeScript  
- Tailwind CSS  
- Supabase Auth  
- React Router  

### **Backend**
- Node.js  
- Express.js  
- Google Generative AI SDK (`@google/generative-ai`)  
- dotenv, cors, body-parser  

---

## 🔑 Environment Setup

Create a `.env` file in the project root and add your keys:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key


🧩 Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/ai-course-creator.git
cd ai-course-creator

2️⃣ Install Dependencies
npm install

3️⃣ Run the Backend
node server.js

4️⃣ Run the Frontend
npm run dev


Then open your browser at http://localhost:5173
.

🧠 How It Works

User enters a topic, selects tone, language, and difficulty.

Backend sends the structured prompt to Google Gemini API.

Gemini generates a JSON response containing titles, chapters, and quizzes.

Frontend dynamically renders the complete course interactively.

(Upcoming) Users can export the generated course as PDF or PPT.

🧪 Example Input

Input

Topic: Cloud Computing
Language: English
Tone: Academic
Difficulty: Advanced


Output

Multiple chapters with detailed explanations (~10 lines each)

10 quiz questions per chapter

10 open-ended practice questions

💡 Future Enhancements

📘 Export to PDF and PPT

💾 Save and load course progress via Supabase

🤝 Collaborative course creation

🔊 Text-to-Speech narration

🧭 AI-driven topic suggestion engine

🛠️ Troubleshooting

❌ Model Not Found Error
✅ Check that the model name in server.js is correct, e.g.
gemini-1.5-flash-8b or gemini-2.0-flash.

❌ API Key Not Working
✅ Verify your key in Google AI Studio and ensure it’s active and unrestricted.

'''
