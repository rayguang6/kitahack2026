# AI Economic Sandbox – Clean GDD (MVP V2 – Refined Loop & Onboarding)

## 1. Game Overview

AI Economic Sandbox is a quarterly life simulation game where players explore possible income directions by allocating their limited free time.

The game models a structured life cycle:

* Work provides stability and small passive growth
* Free Time builds future opportunities
* Simulation visualizes effort
* Sleep generates AI-driven insight and direction

There is no win or lose condition. The experience focuses on experimentation, pattern discovery, and strategic reflection.

---

## 2. Core Game Structure

Each cycle represents 1 Quarter.

Each Quarter follows a fixed order:

Work → Free Time → Simulation → Sleep (AI Insight)

This creates a more natural life rhythm:
Act → Experience → Reflect → Adjust.

---

## 3. Starting Screen (Onboarding – Refined)

The starting screen should remain simple but meaningful.

Required Inputs:

* Name
* Age
* Gender (Select)
* Occupation (Input)

If Occupation = Student:

* Ask: Field of Study / Specialization

Initial Interests & Skills:

Instead of forcing typing only, use a hybrid approach:

1. Show selectable general tags:

   * Coding
   * Editing
   * Cooking
   * Sports
   * Gaming
   * Music
   * Trading
   * Writing
   * Design
   * Fitness
   * Business

2. Allow custom tag input

This keeps onboarding smooth while still flexible.

Optional (Keep Simple for MVP):

* Short bio (1–2 sentences)
* MBTI (Optional input, free text or select if known)
* Social Preference (Select):

  * More Introverted
  * Balanced
  * More Extroverted

These personality inputs are optional context only.
They are not used as strict mechanics.
They help AI generate more relevant suggestions and narrative tone.

Example usage:

* Introverted users may receive more solo-based skill suggestions.
* Extroverted users may receive more networking-based opportunities.

No personality scoring or testing is required in MVP.

---

## 4. Detailed Quarter Flow

### Phase 1: Work (Fixed 9–5)

* Work time is fixed (not adjustable in MVP).
* Represents stability and baseline income.
* At the start of each quarter, player receives a small work-related update.

Example updates:

* "You improved basic communication skills."
* "You learned basic spreadsheet organization."
* "You assisted in building a simple webpage layout."

These updates may add light skill tags.
Work remains secondary to Free Time.

---

### Phase 2: Free Time (Main Control Layer)

Player receives 8 Free Time Units per Quarter.

#### Step 1: Activity Selection

Player can:

* Choose AI-suggested activities
* Create custom activities

Each activity has a category:

* Skill
* Hobby
* Social

Examples:

* Learn web design (Skill)
* Join trading course (Skill)
* Basketball (Hobby)
* Networking dinner (Social)
* Start weekend food test (Skill)

Rules for MVP:

* Must allocate all 8 units
* Must include at least:

  * 1 Hobby activity
  * 1 Social activity

#### Step 2: Time Allocation

Player distributes 8 units using +/- controls.

Example:

* Learn Web Design: 3
* Trading Course: 2
* Basketball: 2
* Networking Dinner: 1

After confirming allocation → proceed to Simulation phase.

---

### Phase 3: Simulation (Visual Representation Phase)

This phase represents action happening.

For MVP:

* Simple animation or transition
* Show activity bubbles/icons appearing
* Text: "You spend the quarter focusing on your chosen activities…"

Future vision:

* 2D character goes to computer
* Goes outside house
* Activity icons appear above character

MVP only needs light visual feedback.

After simulation completes → automatically move to Sleep.

---

### Phase 4: Sleep (AI Insight & Direction Phase)

Sleep represents reflection and processing.

System sends to AI:

* Player profile (occupation, field, skills)
* Current skill tags
* Free time allocation breakdown
* Friends (if any)
* Previous quarter summary

AI returns (Medium-Length Structured Output):

1. Narrative summary of the quarter (short paragraph, 4–6 sentences)
2. Skill growth insight (1–2 sentences)
3. Pattern analysis (1–2 sentences about focus tendency)
4. Small suggested next-step direction (clear actionable idea)
5. (Optional) Unlock 1 opportunity activity for next quarter

AI output should feel immersive but controlled.
Avoid overly long storytelling.
Keep it structured and readable.

Example:
"Your consistent effort in web design helped you build a simple portfolio. Your friend Jason, who owns a café, mentioned he needs help updating his website."

No money is calculated.
Outcomes are directional and opportunity-based.

After AI insight → proceed to next Quarter.

---

## 5. Core Loop (Prototype Version)

Each Quarter runs as:

1. Work update shown
2. Free Time activities selected
3. 8 units allocated
4. Simulation phase (simple animation)
5. Sleep phase (AI insight + suggestion)
6. Next Quarter begins

MVP Length: 3 Quarters

This ensures a complete demo within 5 minutes.

---

## 6. Skill Tag System

Players have a visible Skill Tag Board.

Skill tags come from:

* Onboarding
* Work updates
* Free Time activities
* AI inference

Players can:

* Add tags
* Remove tags
* Edit tags

No numeric levels are tracked.
AI interprets growth qualitatively.

---

## 7. Simple Friend System (Lightweight – MVP+)

Players can:

* Add Friend
* Input Friend Name
* Input Friend Job / Industry
* Optional short description

Friends act only as contextual input for AI.

No stats, no relationship levels.

---

## 8. Tech Stack (MVP)

Build with:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Client-side state only
* Mock AI initially, replace with Gemini later

Deploy on Vercel first.

---

## 9. MVP Feature Scope

Included:

* Refined onboarding
* Work phase
* Free Time allocation
* Simulation transition
* Sleep AI insight phase
* 3-quarter loop
* Skill Tag Board
* Simple Friend input

Not Included:

* Money tracking
* Stress tracking
* Win/Lose system
* Career switching
* Complex economy simulation

---

## 10. Experience Goal

Players should feel:

* Control over their time
* Curiosity about outcomes
* Awareness of trade-offs
* Realistic but hopeful direction

The priority for Version 1 is a smooth loop and strong AI reasoning.

---

## 11. Design Inspiration & Visual Direction (Future Vision)

Inspired by:

* The Pixellia (life modelling)
* AI Dungeon (dynamic narrative output)
* Pokémon / Stardew Valley (2D cozy style)

Future visual goal:

* 2D flat life simulation
* Character-based transitions
* Light animation per quarter

MVP focuses on logic first, visuals later.

---

END OF GDD (MVP V2 – Refined Loop & Onboarding)
