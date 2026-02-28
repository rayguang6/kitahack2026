# Freedom Path AI

> **An AI-Powered Economic Simulation Platform**
> Built for KitaHack 2026 | Aligned with SDG 8 (Decent Work and Economic Growth)

---

## 1. Project Overview

### Problem Statement
Economic mobility is often hindered by systemic barriers, lack of exposure to opportunities, and poor resource allocation (time and capital). Individuals frequently lack a safe environment to understand how micro-decisions regarding their time compound over months and years.

### SDG 8 Alignment (Why This Matters)
This project aligns directly with **UN Sustainable Development Goal 8**, which promotes sustained, inclusive, and sustainable economic growth, full and productive employment, and decent work for all. By simulating economic environments, the platform serves as an educational tool to help individuals visualize and practice sustainable skill acquisition and career planning.

### The Solution
Freedom Path AI is a temporal economic simulation platform. Users allocate specific hours to various activities (skills, hobbies, and networking) across simulated financial quarters. Google Gemini evaluates these allocations dynamically, acting as a highly realistic economic engine to simulate progression and unlock contextually relevant career and life opportunities based on the user's accumulated state.

---

## 2. System Architecture

The application utilizes a purely stateless, client-heavy architecture backed by serverless API routes.

```text
[ User Interface (Next.js/React) ]
     |                       |
(State Mgmt)            (API Calls)
     |                       |
[ Simulation Engine ]        |
     |                       V
     |         [ Next.js Serverless API ]
     |           (/api/evaluate-action,
     |            /api/generate-actions)
     |                       |
     +-----------------------+
                             |
                   [ Google Gemini AI ]
                   (Generative AI SDK)
```

- **Frontend Responsibilities:** Manages the entire simulation state (`SimulationContext`), renders the UI with Framer Motion, handles biological and temporal constraints (168 hours/week), and drives the tick-based simulation engine.
- **Backend Responsibilities:** Next.js serverless API routes act as a secure proxy and mediation layer to the LLM. They aggregate state and enforce systematic prompts and JSON schemas.
- **Gemini AI Role:** Acts as the dynamic game master and economic consequence engine. It evaluates the quarter's time allocation to generate qualitative outcomes, assess skill growth, and determine new opportunities.
- **Data Flow:** User allocates time → Quarter advances → Frontend dispatches state history → API formats context for Gemini → Gemini returns structured JSON → Frontend updates global state with new opportunities and accrued skills.

---

## 3. Technical Stack

- **Core Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend Model:** Serverless API Routes
- **Artificial Intelligence:** Google Gemini (Google Generative AI SDK)
- **Deployment:** Vercel (Ready for GCP / Firebase)

---

## 4. AI Integration Details

Freedom Path AI leverages the Google Gemini model not as a chatbot, but as an embedded logic engine.

- **API Topologies:**
  - `/api/generate-actions`: Suggests initial or contextual actions a user can take based on their current profile.
  - `/api/evaluate-action`: The core evaluation engine that processes a quarter's worth of time allocation and current state to determine outcomes.
- **Structured Prompting:** Prompts provide the AI with the user's current persona, history of decisions, and strictly defined evaluation constraints.
- **JSON Schema Enforcement:** Gemini is constrained to output adhering to a strict JSON schema, ensuring deterministic, error-free parsing on the client side without relying on fragile regex.
- **State Mutation:** The JSON payload determines realistic outcomes. The AI infers distinct, cumulative skills based on context (e.g., 20 hours of coding → `React Basics` tag).
- **Tag Integration:** `skillTags` and `knowledgeTags` are systematically appended to the application state to influence future AI prompt contexts.

---

## 5. Core Gameplay Flow

1. **Work Phase:** Fixed allocation of time towards maintaining baseline survival (e.g., a standard 9-to-5 job constraint).
2. **Free Time Allocation Phase:** The strategic core. Players distribute their remaining weekly hours critically across skills, hobbies, and social networking.
3. **AI Reflection Phase:** The transition period where Gemini analyzes the submitted allocation against the user's historical state.
4. **Opportunity Snowball Mechanism:** As users accumulate specific `skillTags` and social connections, the AI unlocks higher-tier, compounded opportunities (e.g., `Basic Coding` + `Networking` = `Freelance Gig`).

---

## 6. Implementation Details

- **SimulationContext:** A centralized React Context managing resources (time, money, skills, social connections) and routing the current simulation phase.
- **Simulation Engine:** A `setInterval`-based logical loop processes the passage of time over the quarter, visually simulating the execution of the scheduled timeline.
- **Allocation Constraints:** A strict weekly budget logic enforces realistic limits on biological needs, professional obligations, and discretionary time.
- **Dynamic Queueing:** Opportunity injection appends paths generated by the AI directly to the state, expanding the player's decision tree dynamically.
- **Stateless Design:** The core game logic runs entirely in-memory on the client and via stateless API calls, optimizing performance and latency.

---

## 7. Challenges Faced

- **Enforcing Output:** Initial iterations of the AI model generated malformed JSON or included markdown wrappers. This was resolved using strict system instructions and the Gemini SDK's structured output features.
- **Pacing Progression:** Tuning the AI to reject unrealistic leaps (e.g., becoming a CEO after one week of study) required explicit chronological and physical constraints in the system prompt.
- **Simulation Synchronization:** Managing race conditions and ensuring the `setInterval` loop stayed synchronized with React state updates required careful dependency management and ref-based state tracking.
- **Session Volatility:** Operating without a persistence layer for the MVP meant page reloads reset progress, requiring robust local error handling to prevent accidental crashes.
- **Rate Limit Handling:** Implementing UI loading states and basic fallback mechanisms to handle intermittent latency or rate limiting from the LLM endpoint smoothly.

---

## 8. Future Roadmap

- **Persistence Layer:** Integration with Firebase Firestore to allow users to save and resume multi-session simulations.
- **Analytics Dashboard:** Visualizing how microscopic time allocation patterns correlate to macroeconomic outcomes over extended periods.
- **Confidence Scoring:** Refining AI confidence logic to allow the system to ask clarifying questions for ambiguous actions.
- **Multi-Year Simulation Mode:** Expanding the timeline from quarters to decades to model long-term retirement and generational wealth mechanics.
- **Institutional Deployment:** Tailoring the platform as an educational tool for career counseling in universities and workforce reskilling programs.

---

## 9. Scalability Considerations

- **Stateless API Design:** The Next.js API routes contain no local state, allowing them to be horizontally scaled infinitely as Vercel Edge Functions or Serverless Functions.
- **Client-Heavy Computation:** The actual deterministic simulation loop runs on the client device browser, reducing server compute load substantially.
- **Integration Readiness:** The architecture heavily decouples the game engine from storage, making future database attachments (GCP/Firebase) trivial.
- **Horizontal Scaling:** Deployment via Vercel inherently supports burst traffic, critical during hackathon evaluations and public launches.

---

## 10. Ethical Considerations

- **No Guarantees of Success:** The system is designed to simulate probability, not certainty. Efforts improve odds but do not guarantee specific outcomes, accurately mirroring reality.
- **Effort-Based Progression:** The core loop rewards intentional time management and skill acquisition over random luck or arbitrary choices.
- **Avoiding Unrealistic Wealth Narratives:** Prompt engineering strictly inhibits "get rich quick" outcomes, focusing heavily on sustainable growth and realistic friction.
- **Promoting Sustainable Growth:** Aligned tightly with SDG 8, the simulation emphasizes that true mobility comes from acquiring adaptable skills and fostering meaningful networks over time.
