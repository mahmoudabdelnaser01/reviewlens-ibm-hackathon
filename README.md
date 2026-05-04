# 🔍 ReviewLens
### *"Your reviews are talking. We translate."*

> **IBM Bob Dev Day Hackathon 2026 Submission**
> Built with IBM watsonx.ai as the core AI engine.

---

## 📌 Project Overview

**ReviewLens** is an AI-powered web application that transforms raw, unstructured customer reviews into a structured, actionable business intelligence dashboard — in seconds.

Business owners and product managers waste hours manually reading hundreds of reviews to find patterns. ReviewLens eliminates that friction entirely. The user pastes raw text from anywhere (WhatsApp, social media, product pages) and instantly receives a structured analysis with pain points, praises, and a concrete action plan.

---

## 🎯 The Problem

E-commerce businesses generate massive amounts of unstructured customer feedback daily. For business owners and product managers:

- Manually reading 500+ reviews to find patterns takes **hours per week**
- Critical signals (recurring defects, shipping delays, sizing issues) are **buried in noise**
- Most businesses cannot afford a dedicated data analyst
- Existing tools require **CSV exports, API integrations, or technical setup**

This "data friction" delays critical business decisions and negatively impacts product development and customer satisfaction.

**Target User:** A solo e-commerce seller on Shopify or Amazon with 100+ reviews and no data analyst on their team.

---

## 💡 The Solution

ReviewLens ingests raw, copy-pasted customer reviews and uses **IBM watsonx.ai** as an intelligent analyst to:

1. Understand context and sentiment without predefined schemas
2. Extract recurring themes and classify them automatically
3. Generate a prioritized action plan in plain business language

No CSV. No setup. No technical knowledge required.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│                                                      │
│  ┌──────────────┐          ┌──────────────────────┐  │
│  │  Quick Paste │          │   Results Dashboard  │  │
│  │  Text Area   │          │  - Pain Points       │  │
│  │              │          │  - Top Praises       │  │
│  │  [Analyze]   │          │  - AI Action Plan    │  │
│  └──────┬───────┘          └──────────────────────┘  │
└─────────┼───────────────────────────────────────────┘
          │ HTTP POST (raw review text)
          ▼
┌─────────────────────────────────────────────────────┐
│                  BACKEND (Node.js / Express)         │
│                                                      │
│  1. Receive raw text                                 │
│  2. Build structured prompt                          │
│  3. Call IBM watsonx.ai API                          │
│  4. Parse JSON response                              │
│  5. Return structured data to frontend               │
└─────────┬───────────────────────────────────────────┘
          │ IBM watsonx.ai API Call
          ▼
┌─────────────────────────────────────────────────────┐
│              IBM WATSONX.AI                          │
│                                                      │
│  - Sentiment Analysis (Granite 3 8B Instruct)        │
│  - Theme Extraction                                  │
│  - Priority Ranking                                  │
│  - Action Plan Generation                            │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React + Tailwind CSS | Fast to build, clean UI |
| **Backend** | Node.js + Express | Lightweight API server |
| **AI Engine** | IBM watsonx.ai | Core intelligence — IBM Granite 3 8B Instruct model |
| **Charts** | Recharts | Visualize sentiment distribution |
| **Hosting** | IBM Cloud (Code Engine) | Stays within IBM ecosystem |
| **Version Control** | GitHub | Required for submission |

---

## 🤖 How IBM watsonx.ai Is Used

IBM watsonx.ai is the **sole AI engine** of this application. It is not used as a chatbot — it is used as a **structured data analyst** via carefully engineered prompts.

We use the **IBM Granite 3 8B Instruct** model, which is specifically designed for instruction-following tasks.

### The Core Prompt Strategy

The AI model receives the following structured prompt:

```
You are a senior e-commerce business analyst.
You will receive a block of raw, unstructured customer reviews.

Your job is to analyze them and return a JSON object with EXACTLY this structure:
{
  "summary": "2-sentence overview of overall sentiment",
  "sentiment_score": <number from 1-10>,
  "total_reviews_detected": <number>,
  "pain_points": [
    {
      "issue": "Short title of the problem",
      "frequency": "e.g. 40% of reviews",
      "severity": "High | Medium | Low",
      "example_quote": "Direct quote from a review"
    }
  ],
  "top_praises": [
    {
      "strength": "Short title of the praise",
      "frequency": "e.g. 60% of reviews",
      "example_quote": "Direct quote from a review"
    }
  ],
  "action_plan": [
    {
      "priority": 1,
      "action": "Specific, concrete action to take",
      "expected_impact": "What will improve if this is done"
    }
  ]
}

Return ONLY the JSON. No explanation. No markdown. No preamble.

REVIEWS TO ANALYZE:
[USER_INPUT_HERE]
```

### Why This Is Powerful

- IBM watsonx.ai **understands context** — it can parse sarcasm, mixed-language reviews, and informal text
- The **schema-enforced JSON output** makes the response directly usable by the frontend
- No traditional NLP pipeline or ML model training is required
- The AI handles **any language or format** the user pastes

---

## 📂 Project Structure

```
reviewlens/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── components/
│   │   │   ├── PasteInput.jsx       # Review input area
│   │   │   ├── Dashboard.jsx        # Results dashboard
│   │   │   ├── PainPoints.jsx       # Pain points list
│   │   │   ├── Praises.jsx          # Top praises list
│   │   │   ├── ActionPlan.jsx       # AI action plan
│   │   │   └── SentimentGauge.jsx   # Sentiment score visual
│   │   └── index.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── server.js                    # Express server
│   ├── routes/
│   │   └── analyze.js               # POST /api/analyze
│   ├── services/
│   │   └── bobService.js            # IBM watsonx.ai API integration
│   ├── prompts/
│   │   └── reviewAnalyst.js         # Core prompt template
│   └── package.json
│
├── .env.example                     # IBM watsonx.ai credentials template
├── README.md
└── ibm-bob-report/                  # Hackathon submission materials
    └── sessions-export.pdf
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- IBM watsonx.ai API access (IBM Cloud account)
- IBM Cloud account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/reviewlens.git
cd reviewlens

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in `/backend`:

```env
IBM_WATSONX_API_KEY=your_ibm_watsonx_api_key
IBM_WATSONX_API_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/generation
IBM_WATSONX_PROJECT_ID=your_project_id
PORT=3001
```

### Running Locally

```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📊 User Flow

```
1. User opens ReviewLens
        │
        ▼
2. User pastes raw reviews into the text area
   (copied from WhatsApp, Amazon, social media — any format)
        │
        ▼
3. User clicks "Analyze Reviews"
        │
        ▼
4. Backend builds the structured prompt and calls IBM watsonx.ai
        │
        ▼
5. IBM watsonx.ai returns structured JSON analysis
        │
        ▼
6. Frontend renders the Results Dashboard:
   ├── 📊 Sentiment Score (1-10 gauge)
   ├── 🔴 Top Pain Points (with frequency + severity)
   ├── 🟢 Top Praises (with frequency)
   └── 📋 AI Action Plan (prioritized, concrete steps)
```

---

## 🎯 Judging Criteria Alignment

| Criterion | How ReviewLens Addresses It |
|---|---|
| **Completeness & Feasibility** | Fully working MVP with clear, deployable architecture. No external scraping or complex dependencies. |
| **Creativity & Innovation** | Uses IBM watsonx.ai as a structured data analyst, not a chatbot. Schema-enforced JSON output is a novel prompt engineering approach. |
| **Design & Usability** | Zero technical knowledge required. Paste text → get insights. Designed for non-technical business owners. |
| **Effectiveness & Efficiency** | Reduces hours of manual review analysis to seconds. Measurable impact: time saved per week per business owner. |

---

## 🗺️ Roadmap (Post-Hackathon)

- **v2.0** — Competitor comparison: analyze your reviews vs. competitor reviews side by side
- **v2.1** — Trend detection: track how sentiment changes over time
- **v3.0** — Direct Shopify/WooCommerce integration via official APIs
- **v3.1** — Auto-generate marketing copy from top praises

---

## 👤 Team

| Name | Role |
|---|---|
| [Your Name] | Solo Developer — Full Stack + Prompt Engineering |

---

## 📜 License

This project was built during the IBM Bob Dev Day Hackathon 2026.
All rights reserved per the Official Rules of the contest.

---

## 🔗 Links

- [IBM Bob Dev Day Hackathon](https://compete.052601.watsonx-challenge.ibm.com/competitions/bobdevday)
- [IBM watsonx.ai Documentation](https://www.ibm.com/products/watsonx-ai)
- **Video Demo** — Submitted via hackathon portal
- **Hackathon Materials** — Submitted via hackathon portal
