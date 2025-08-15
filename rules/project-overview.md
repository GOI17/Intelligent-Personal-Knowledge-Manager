🚀 Intelligent Personal Knowledge Manager

A full‑stack, TypeScript‑only, test‑driven PKM that uses AI to summarise, tag, and suggest connections.

TL;DR
Build a Next.js + RTK‑Toolkit + Supabase app that lets you write notes, auto‑tag & summarise them with GPT‑4o‑mini, visualise the knowledge graph, work offline, and optionally run a local summariser in the browser. The repo ships with CI/CD, tests, an Electron wrapper, and a Vercel‑deploy button.

1. Project Overview

Core Value‑Proposition

Feature	Human‑Centered Benefit	AI Contribution
Write & edit	Rich markdown, code blocks	–
Auto‑tags	Faster organization	GPT‑4 “What tags fit this note?”
Summary sidebar	Quick review	GPT‑4 “Summarise this note in 3 bullets.”
Graph view	Visual link map	GPT‑4 “Which other notes could be linked to this?”
Q&A chat	Ask “What did I learn about X?”	GPT‑4 or local model
Offline mode	Work without internet	Local transformer (e.g. t5-small) runs in‑browser
2. Architecture Diagram

(Add your own diagram – e.g. with Lucidchart or draw.io)

┌───────────────────── CLIENT (React/TS) ──────────────────────┐
│ ┌─ UI (Tailwind + Radix) ──────┐ ┌─ State (RTK Toolkit) ────────┐ │
│ ├─ API (RTK Query / React‑Query) ─────┤ ├─ Offline Store (IndexedDB)│ │
│ └───────────────────────────────────────┘ └───────────────────────┘ │
│                       ▲                      ▲                       │
│                       │                      │                       │
│           ┌───────────┴───────┐   ┌───────────────┴───────┐            │
│           │  NEXT.JS API    │   │  OpenAI Edge / Local   │            │
│           │ (Node + TS)     │   │  Transformer (WASM)    │            │
│           └──────▲──────────┘   └──────────────▲───────────┘            │
│                  │                      │                                  │
└──────────────────┴──────────────────────┴───────────────────────────────┘
               ▲                        ▲
               │                        │
           ┌───┴─────┐                ┌─┴───────┐
           │ Supabase│                │ Supabase│
           │  (DB)   │                │  Edge   │
           └─────────┘                └─────────┘
Next.js provides SSR/ISR and serverless API routes.
RTK‑Toolkit for global state + RTK‑Query for CRUD & AI calls.
IndexedDB for local copy & offline editing.
OpenAI called from a protected server‑side endpoint.
@xenova/transformers gives you a tiny summariser that can run entirely in‑browser.
3. Feature Roadmap (≈ 20 days)

Phase	Deliverable	Time	Notes
0	Skeleton (Next.js + TS + Tailwind + Radix)	1 day	Keep bundle small.
1	Note CRUD + Rich‑text editor	2 days	Persist in Supabase.
2	Search & Tag UI	1 day	Use Fuse.js for fuzzy search.
3	AI Summary Panel	2 days	OpenAI endpoint + cache.
4	AI Tag Suggestion	1 day	Prompt “What tags fit this note?”
5	Graph View	3 days	react‑force‑graph + link UI.
6	Q&A Chat	2 days	Simple chat UI + streaming.
7	Offline Mode	3 days	IndexedDB + local summariser.
8	Electron Wrapper	2 days	electron-forge or electron-builder.
9	Tests	3 days	Jest + Cypress + axe-core.
10	CI/CD & Docs	1 day	GitHub Actions + Vercel button.
4. Data Modelling (Supabase)

Table	Columns	Notes
notes	id uuid, user_id uuid, title text, content text, summary text, created_at, updated_at	summary is cached AI output
tags	id uuid, user_id uuid, name text	Many‑to‑many with notes
note_tags	note_id uuid, tag_id uuid	Bridge table
links	id uuid, source_id uuid, target_id uuid, user_id uuid	For graph
ai_cache	id uuid, note_id uuid, prompt text, response json, created_at	Stores raw AI outputs
Supabase offers real‑time subscriptions – perfect for keeping UI in sync across devices.

5. AI Integration

5.1 OpenAI (Server‑Side)

// pages/api/ai/summarise.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body;
  const prompt = `Summarise the following note in 3 concise bullet points:\n\n${content}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  res.json({ summary: response.choices[0].message.content });
}
Key handling – the API route is protected; only the server sees the key.
Token cost: use response.usage.total_tokens for analytics.
5.2 Local Transformer (WASM)

// utils/transformer.ts
import { pipeline } from '@xenova/transformers';

const summariser = await pipeline('summarization', 'sshleifer/t5-small');

export async function summariseLocal(content: string) {
  const result = await summariser(content, { max_length: 150, min_length: 80 });
  return result[0].summary_text;
}
Lightweight (~ 1 MB) – runs in Chrome/Edge/Firefox.
Works entirely offline – great for privacy.
5.3 Hybrid Strategy

// store/aiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api/ai' }),
  endpoints: (builder) => ({
    summarise: builder.mutation({
      query: ({ content }) => ({
        url: '/summarise',
        method: 'POST',
        body: { content },
      }),
      transformResponse: (r) => r.summary,
    }),
    tagSuggest: builder.mutation({
      query: ({ content }) => ({
        url: '/tag-suggest',
        method: 'POST',
        body: { content },
      }),
      transformResponse: (r) => r.suggested_tags,
    }),
  }),
});

export const { useSummariseMutation, useTagSuggestMutation } = aiApi;
Usage

const [summarise, { isLoading }] = useSummariseMutation();
await summarise({ content: note.content });
Toggle to local AI

<button onClick={() => setUseLocalAI(!useLocalAI)}>Local AI: {useLocalAI ? 'ON' : 'OFF'}</button>
6. Global State (RTK)

// store/notesSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export const notesSlice = createSlice({
  name: 'notes',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addNote: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { addNote } = notesSlice.actions;
export default notesSlice.reducer;
RTK‑Query Endpoints

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/ai' }),
  endpoints: (builder) => ({
    summarise: builder.mutation({
      query: ({ content }) => ({
        url: '/summarise',
        method: 'POST',
        body: { content },
      }),
      transformResponse: (res) => res.summary,
    }),
    tagSuggest: builder.mutation({
      query: ({ content }) => ({
        url: '/tag-suggest',
        method: 'POST',
        body: { content },
      }),
      transformResponse: (res) => res.suggested_tags,
    }),
  }),
});

export const { useSummariseMutation, useTagSuggestMutation } = aiApi;
7. UI Skeleton

7.1 Note List + Editor

// components/NoteEditor.tsx
import { Textarea } from '@radix-ui/react-textarea';
import { useState } from 'react';

export default function NoteEditor({ note, onSave }) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.content ?? '');

  const handleSave = () => {
    onSave({ title, content: body });
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        data-test="note-title"
        className="border p-2 rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        data-test="note-body"
        className="border p-2 rounded h-64"
        placeholder="Write your note…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        data-test="note-save"
        className="btn-primary w-full"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
7.2 AI Panel (React)

// components/AIPanel.tsx
import { useState } from 'react';
import { useSummariseMutation, useTagSuggestMutation } from '../store/aiSlice';

export default function AIPanel({ note }) {
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [summarise, { isLoading: sumLoading }] = useSummariseMutation();
  const [tagSuggest, { isLoading: tagLoading }] = useTagSuggestMutation();

  const handleSummarise = async () => {
    const res = await summarise({ content: note.content });
    setSummary(res);
  };

  const handleTagSuggest = async () => {
    const res = await tagSuggest({ content: note.content });
    setTags(res);
  };

  return (
    <aside className="w-96 p-4 border-l">
      <button onClick={handleSummarise} className="btn-primary w-full mb-2" disabled={sumLoading}>
        Summarise
      </button>
      <button onClick={handleTagSuggest} className="btn-secondary w-full mb-4" disabled={tagLoading}>
        Suggest Tags
      </button>

      {summary && (
        <div className="bg-gray-50 p-2 rounded">
          <h4 className="font-semibold mb-1">Summary</h4>
          <ul>{summary.split('\n').map((b, i) => <li key={i}>• {b}</li>)}</ul>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Suggested Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="bg-blue-100 rounded px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
7.3 Graph View

// components/GraphView.tsx
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphView({ links }) {
  return (
    <ForceGraph2D
      graphData={links}
      nodeAutoColorBy="group"
      linkDirectionalArrowLength={3}
      linkDirectionalArrowRelPos={1}
      width={600}
      height={400}
    />
  );
}
8. Offline & Local AI

8.1 IndexedDB

// utils/indexedDb.ts
import { openDB } from 'idb';

const dbPromise = openDB('pkm', 1, {
  upgrade(db) {
    db.createObjectStore('notes', { keyPath: 'id' });
  },
});

export async function storeNote(note) {
  const db = await dbPromise;
  await db.put('notes', note);
}

export async function getNotes() {
  const db = await dbPromise;
  return await db.getAll('notes');
}
Sync – after a successful server‑side mutation, also push the payload to IndexedDB.
Conflict resolution – last‑write‑wins using updated_at.

8.2 Local Transformer (Optional Toggle)

// utils/localSummariser.ts
import { pipeline } from '@xenova/transformers';

let summariser: any;

export async function initLocalSummariser() {
  if (!summariser) {
    summariser = await pipeline('summarization', 'sshleifer/t5-small-10k');
  }
}

export async function summariseLocal(content: string) {
  const result = await summariser(content, { max_length: 150, min_length: 80 });
  return result[0].summary_text;
}
You can expose a checkbox “Use local AI” that toggles between the server‑side and this local pipeline.

9. Testing Strategy

Layer	Tools	What to test
Unit	Jest + ts‑jest + RTL	Reducers, selectors, components in isolation.
API	MSW (Mock Service Worker)	Test /api/ai/* without hitting OpenAI.
E2E	Cypress	Flow: Create note → AI summary → Graph link → Offline → Local AI.
Accessibility	axe-core + jest‑axe	Verify Radix components pass.
Example unit test (note slice)

import notesReducer, { addNote } from '../store/notesSlice';

test('addNote inserts new note', () => {
  const initial = { list: [], status: 'idle', error: null };
  const action = addNote({ id: '1', title: 'Test', content: 'Hello' });
  const state = notesReducer(initial, action);
  expect(state.list).toHaveLength(1);
  expect(state.list[0].title).toBe('Test');
});
Cypress spec (summarisation flow)

describe('AI Summarisation', () => {
  it('summarises note', () => {
    cy.visit('/');
    cy.get('[data-test="note-create"]').click();
    cy.get('[data-test="note-title"]').type('Quantum Computing');
    cy.get('[data-test="note-body"]').type('Entanglement, qubits, superposition.');
    cy.get('[data-test="note-save"]').click();
    cy.wait('@summariseNote');
    cy.get('[data-test="ai-summary"]').should('contain', '•');
  });
});
10. CI/CD & Documentation

10.1 GitHub Actions

# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request: {}

jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next
10.2 Deploy

Add a Vercel button to the README:

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GIT_URL)
Vercel automatically builds the Next.js app and exposes your serverless API routes – no separate backend needed.

10.3 Electron

Add a separate workflow for Electron:

# .github/workflows/electron.yml
name: Electron Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build:electron
11. Documentation

Doc	Content
README	Architecture diagram, feature list, AI toggle, OpenAI key setup, screenshots.
Architecture Diagrams	PNG or SVG of the diagram above.
AI Flow	Prompt → server → OpenAI → response → cache → UI.
Privacy	Explain local inference keeps data local.
Token‑usage monitor	Small component that shows month‑to‑month token spend.
Tip – Include a “Blog Post” link: How I built an AI‑powered PKM (great for portfolio).

12. Quick Starter Checklist (1‑Page)

☑️ Create Next.js project with TS
☑️ Install Tailwind, Radix, RTK Toolkit, RTK Query
☑️ Spin up Supabase → notes, tags, links tables
☑️ Write API routes for CRUD + AI
☑️ Build Note list + editor + RTK Query
☑️ Add AI Summary panel (server‑side)
☑️ Add AI Tag Suggestion panel
☑️ Build Graph view
☑️ Implement Offline mode (IndexedDB)
☑️ Add optional local transformer toggle
☑️ Write unit & e2e tests
☑️ Configure CI/CD pipeline
☑️ Deploy to Vercel
13. FAQ (What‑If)

Question	Answer
Can I replace Supabase with Firestore?	Yes – swap the client in the API routes & adjust schemas.
What if I need GPT‑4 instead of GPT‑4o‑mini?	Change model: 'gpt-4o-mini' → gpt-4. Token cost will rise.
Is the local model stable?	@xenova/transformers works on Chrome/Edge/Firefox; Safari still a bit slow.
How to handle > 5 k tokens?	Chunk the content, summarise each chunk, concat results, show progress.
Do I need a dedicated server?	Vercel’s serverless API routes run on edge nodes; no VM needed.
14. Final Deliverables

Deliverable	Description
GitHub repo	All source, tests, CI scripts.
README	Project description, tech stack, how‑to‑run locally, deploy instructions, screenshots.
Architecture diagram	PNG/SVG embedded.
Token‑usage monitor	UI component that shows current month token spend.
Electron build	npm run build:electron → .exe / .dmg / .AppImage.
Demo video	2‑minute screencast: Create → AI summary → Graph suggestion → Offline AI.
Blog post	(Optional) How I built an AI‑powered PKM – great for portfolio.
15. Summary

You’ll end up with a production‑ready, AI‑augmented PKM that demonstrates:

Full TypeScript stack (SSR, serverless APIs, global state, caching).
Secure OpenAI usage & optional local inference for privacy.
Offline editing via IndexedDB.
Visual knowledge graph with AI‑generated links.
Unit & e2e tests, CI/CD, and a desktop Electron build.
Easy Vercel deployment with a one‑click button.
That’s exactly the hybrid‑tech skill set recruiters are hunting for right now. Happy hacking!
