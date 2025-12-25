# Project Roadmap: "Perfect" Full Stack Resume Project
> [!IMPORTANT]
> This roadmap is designed to elevate MediAssist from a "College Project" to a "Production-Grade Microservice Architecture" capable of passing screening at top-tier product companies (Google, Uber, Amazon, etc.).

## Phase 1: The "Wow" Factor (High Visibility User Features)
*Focus: These features catch the recruiter's eye immediately in a portfolio video/demo.*

### 1. 🧠 AI Medical Assistant (RAG Chatbot)
**Why:** Shows you can integrate Generative AI, not just static ML models.
*   **Feature:** A slide-out chat interface on the Result Page.
*   **Functionality:** "Based on your high Glucose (140 mg/dL), what foods should I avoid?"
*   **Tech Stack:** Vercel AI SDK, OpenAI/Gemini API, System Prompt context injection.

### 2. 📊 Interactive Health Trends Dashboard
**Why:** Shows data visualization skills and handling of complex datasets over time.
*   **Feature:** A "My Health" dashboard for logged-in users.
*   **Functionality:** Line charts tracking specific metrics (e.g., Blood Pressure, BMI) across multiple screenings.
*   **Tech Stack:** `recharts` or `chart.js`.

### 3. 📄 Professional Medical Reports (PDF)
**Why:** Shows attention to real-world use cases (giving data to doctors).
*   **Feature:** "Download Full Report" button.
*   **Functionality:** Generates a branded PDF with patient details, prediction results, and risk visualization.
*   **Tech Stack:** `@react-pdf/renderer`.

---

## Phase 2: "Senior Engineer" Reliability (System Design)
*Focus: Things usually discussed in the System Design Interview.*

### 4. 🐳 Containerization & Orchestration
**Why:** Proves you understand how to deploy complex microservices.
*   **Task:** Create `Dockerfile` for Client (Next.js) and Server (FastAPI).
*   **Task:** Create `docker-compose.yml` to spin up Frontend + Backend + MongoDB (Replica Set) + Redis (optional) with one command.

### 5. 🛡️ Robust Security & Ops
**Why:** Shows maturity beyond "making it work".
*   **Task:** **Rate Limiting:** Prevent API abuse using Upstash/Redis.
*   **Task:** **Input Validation:** Ensure strict Pydantic (Python) and Zod (Typescript) schema matching.
*   **Task:** **Strict TypeScript:** Eliminate `any` types to show type safety discipline.

---

## Phase 3: The "Quality Assurance" Seal
*Focus: The reason most junior projects get rejected.*

### 6. 🧪 Automated Testing
**Why:** The difference between a hobbyist and a professional.
*   **Task:** **E2E Testing:** Playwright script that logs in, fills a form, and verifies the result appears.
*   **Task:** **Unit Testing:** Pytest for the ML API to ensure models load and predict correctly.

### 7. 🚀 CI/CD Pipeline
**Why:** Shows you know modern DevOps.
*   **Task:** GitHub Action that runs `npm install`, `build`, and `test` on every push.

---

# Current Status & Immediate Next Steps

**Current Architecture:**
- **Frontend/BFF:** Next.js 14 (App Router) + NextAuth + Mongoose.
- **Compute Service:** Python FastAPI (ML Inference).
- **Database:** MongoDB.

**Recommendation:**
We should start with **Phase 1 (The Wow Factor)** because that's what you asked for: "Perfect features".

**Shall we start building the AI Medical Assistant (Chatbot)?**
