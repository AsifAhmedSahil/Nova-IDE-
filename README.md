# NovaIDE 🚀  hh
### An AI-Powered Online IDE with Real-Time Sync and Autonomous AI Agents

> **I built an AI-powered online IDE where an AI agent can design project structure, modify code using tool-calling, run it instantly in the browser, and keep everything real-time synced across users.**

NovaIDE is a modern, web-based code editor inspired by tools like Cursor and Replit.  
It combines a powerful in-browser IDE, real-time collaboration, and AI agents that can safely generate, edit, and execute code using structured tool-calling.

---

## ✨ Key Highlights

- 🤖 Tool-based AI agent that reads, writes, and modifies code safely  
- 👻 Ghost text AI suggestions for non-destructive code completion  
- ⚡ Instant in-browser execution with live preview  
- 🔄 Real-time project sync using reactive state  
- 🐙 Full GitHub integration (import & export repositories)  
- 🔐 SaaS-ready authentication and billing  
- ⏳ Background job processing for long-running AI tasks  

---

## 🤖 AI Features

- AI-powered code suggestions with ghost text
- AI quick edit using diff-based file updates
- Autonomous AI agent with multi-tool reasoning:
  - Read files
  - Search codebase
  - Create / update files
- Prompt-based project structure generation
- Live documentation grounding via Firecrawl
- AI-assisted PR reviews (CodeRabbit integration)
- LLM error tracking & observability

---

## ✏️ Code Editor

- CodeMirror 6 editor
- Syntax highlighting & code folding
- Minimap support
- File explorer with virtual file system
- Persistent editor state synced in real time

---

## ▶️ In-Browser Execution

- Node.js runtime powered by **WebContainers**
- Secure, sandboxed execution inside the browser
- Instant feedback with live preview
- No backend code execution required

---

## 🔄 Real-Time Sync & Collaboration

- Real-time state management with Convex
- Reactive queries for instant updates
- Multi-project workspace support
- Conflict-safe file updates

---

## 🐙 GitHub Integration

- GitHub OAuth authentication
- Import existing repositories into the IDE
- Normalize GitHub file trees into a virtual file system
- Export changes back to GitHub repositories

---

## 🔐 SaaS Infrastructure

- Authentication & user management with Clerk
- GitHub OAuth login
- Subscription & billing support
- Multi-tenant architecture

---

## ⏳ Background Jobs & Reliability

- Background AI workflows handled with Inngest
- Retries and failure handling for long-running tasks
- Non-blocking UI during AI operations

---

## 🐛 Monitoring & Observability

- Runtime error tracking with Sentry
- AI-specific monitoring (LLM failures, retries)
- Improved visibility into AI-driven workflows

---

## 🧠 Architecture Overview

- **Frontend:** Next.js + CodeMirror-based IDE  
- **State Layer:** Convex as the real-time source of truth  
- **AI Layer:** Claude with structured tool-calling  
- **Execution:** WebContainers for in-browser Node.js runtime  
- **Jobs:** Inngest for background AI tasks  
- **Auth & Billing:** Clerk  
- **Monitoring:** Sentry  

> The AI agent never edits files directly — all changes go through explicit, auditable file manipulation tools.

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16
- TypeScript
- CodeMirror 6
- Tailwind CSS

### Backend / Infrastructure
- Convex (real-time database & sync)
- Inngest (background jobs)
- WebContainers (in-browser execution)

### AI & Tooling
- Claude (LLM)
- Tool-based AI agents
- Firecrawl (live documentation scraping)
- CodeRabbit (AI PR reviews)

### Auth & Monitoring
- Clerk (authentication & billing)
- GitHub OAuth
- Sentry (error & AI monitoring)

---

## 🎯 Why NovaIDE?

NovaIDE explores what modern developer tools look like when AI becomes a first-class citizen —  
not just as a chatbot, but as an **agent that understands, edits, and executes real code safely**.

This project focuses on:
- Developer Experience (DX)
- Safe AI-driven code modifications
- Real-time systems
- Production-inspired SaaS architecture

---

## 📌 Disclaimer

This project is **production-inspired** and built for learning, experimentation, and showcasing modern engineering patterns in AI-powered developer tooling.

---

## 👤 Author

**Asif Ahmed Sahil**  
Software Engineer | Full-Stack | AI-Powered Developer Tools
