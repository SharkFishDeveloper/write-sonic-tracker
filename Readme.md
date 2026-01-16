# AI Visibility Tracker

A simple tool to measure **brand visibility inside AI-generated answers** (e.g. ChatGPT), similar to SEO but for AI search.

---

## Problem

When users ask AI questions like  
**“What’s the best CRM for startups?”**,  
only a few brands get mentioned.

Brands need to know:
- Are we mentioned?
- How often?
- Who is mentioned instead of us?

---

## What This Does

- Takes a **category** and **list of brands**
- Queries an AI model with realistic prompts
- Tracks **brand mentions and context**
- Calculates **AI Visibility %**
- Shows:
  - Key metrics
  - Brand leaderboard
  - Prompt-level results
  - Top referenced sources (heuristic)
- Supports **Primary Brand selection** for competitor comparison

---

## Key Metrics

- **Brand Visibility %** = prompts where brand is mentioned ÷ total prompts  
- **Avg AI Visibility %** = average visibility across all brands  
- **Citation Share (Heuristic)** = inferred domains mentioned in AI responses

---

## Tech Stack

- **Backend:** Node.js, Express, OpenAI API  
- **Frontend:** React, Tailwind CSS  

---

## Run Locally

```bash
# Backend
cd backend
npm install
Create .env with Environment variable OPENAI_API_KEY=your_key
node index.js
```

``` bash
# Frontend
cd frontend
npm install
npm run dev
```