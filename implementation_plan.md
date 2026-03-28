# AI First-Aid Assistant — Implementation Plan

A premium, medical-blue themed web dashboard featuring a 3D anatomy model viewer with triggered first-aid animations, a diagnostic AI chatbot with symptom-first logic, and an AR contextual narrator that explains 3D scene actions in real time.

## Proposed Changes

### Project Setup

#### [NEW] [package.json](file:///d:/codes/medhelp/package.json)
- Vite vanilla JS project
- Dependencies: `three` (3D rendering), `tailwindcss` v4 (styling)

#### [NEW] [vite.config.js](file:///d:/codes/medhelp/vite.config.js)
- Vite dev server config

#### [NEW] [tailwind.config.js](file:///d:/codes/medhelp/tailwind.config.js)
- Tailwind preset with custom Medical-Blue color palette

---

### Core Application

#### [NEW] [index.html](file:///d:/codes/medhelp/index.html)
- Main HTML shell with SEO meta tags
- Layout: 3D viewer (center/left ~65%), side panel (right ~35%)
- Side panel contains two tabs: "AI Doctor" chatbot and "AR Narrator"
- Animation trigger buttons overlay on the 3D viewer
- Google Fonts (Inter)

#### [NEW] [src/style.css](file:///d:/codes/medhelp/src/style.css)
- Tailwind imports + custom CSS for glassmorphism panels, gradient backgrounds, smooth animations, medical-blue theme tokens

#### [NEW] [src/main.js](file:///d:/codes/medhelp/src/main.js)
- App entry point — initializes all modules

---

### 3D Model Viewer (Feature 1)

#### [NEW] [src/viewer/scene.js](file:///d:/codes/medhelp/src/viewer/scene.js)
- Three.js scene setup: renderer, camera, lights (ambient + directional), OrbitControls for 360° rotation/zoom
- Resize handling
- Animation loop

#### [NEW] [src/viewer/model.js](file:///d:/codes/medhelp/src/viewer/model.js)
- **Procedural anatomy model** built from Three.js primitives (capsule torso, sphere head, cylinder limbs) — acts as a functional placeholder
- Model path is a single constant `MODEL_PATH` for easy swap to custom `.glb`
- GLTFLoader integration for when user provides their model
- Functions: `loadModel()`, `getModelParts()` (returns named body parts for animation targeting)

#### [NEW] [src/viewer/animations.js](file:///d:/codes/medhelp/src/viewer/animations.js)
- **CPR Animation**: Rhythmic chest compressions (sinusoidal Y translation on chest), head-tilt/chin-lift (rotation on head/neck)
- **Severe Bleeding Animation**: Pressure point highlighting (color pulse on limb), limb elevation (rotation on arm/leg), tourniquet indicator
- Each animation is a class with `start()`, `stop()`, `update(delta)` methods
- Emits events (`animation:start`, `animation:step`, `animation:end`) for the AR narrator

---

### Diagnostic AI Chatbot (Feature 2)

#### [NEW] [src/chatbot/chatbot-ui.js](file:///d:/codes/medhelp/src/chatbot/chatbot-ui.js)
- Chat message rendering (user bubbles, bot bubbles)
- Input field with send button
- Typing indicator animation
- Collapsible panel behavior

#### [NEW] [src/chatbot/diagnostic-engine.js](file:///d:/codes/medhelp/src/chatbot/diagnostic-engine.js)
- **Symptom-first logic flow** — state machine with stages:
  1. `GREETING` → asks initial symptom
  2. `CLARIFYING` → asks 3-4 follow-up questions based on symptom category
  3. `ANALYZING` → processes answers
  4. `RECOMMENDATION` → provides OTC medicine suggestions, home-care, or red-flag alert
- Symptom categories: Fever, Pain, Breathing, Injury, Digestive, Skin
- Red-flag detection: chest pain + shortness of breath, high fever + stiff neck, severe bleeding, loss of consciousness, etc.
- Medical disclaimer on every recommendation

#### [NEW] [src/chatbot/symptom-data.js](file:///d:/codes/medhelp/src/chatbot/symptom-data.js)
- Knowledge base of symptom → question → recommendation mappings
- Structured data for each symptom category

---

### AR Contextual Assistant (Feature 3)

#### [NEW] [src/narrator/narrator.js](file:///d:/codes/medhelp/src/narrator/narrator.js)
- Listens to animation events from `animations.js`
- Listens to OrbitControls change events (rotation, zoom)
- Displays contextual narration messages in the AR Narrator panel
- Pre-scripted narration for each animation step (e.g., "Note the depth: compressions should be 2 inches deep")
- Rotation narration (e.g., "You are now viewing the posterior side")

#### [NEW] [src/narrator/narration-data.js](file:///d:/codes/medhelp/src/narrator/narration-data.js)
- All narration text organized by animation type and step

---

## Verification Plan

### Browser Testing
1. Run `npm run dev` in `d:\codes\medhelp`
2. Open the local URL in Chrome
3. Verify:
   - 3D anatomy model renders and rotates/zooms with mouse
   - CPR button triggers chest compression + head tilt animation
   - Bleeding button triggers pressure point + elevation animation
   - Diagnostic chatbot asks clarifying questions before giving recommendations
   - Red-flag symptoms trigger "Seek Immediate Medical Attention" alert
   - AR Narrator updates text when animations play
   - Medical-blue theme renders correctly
   - Side panels are collapsible
   - Layout is responsive

> [!NOTE]
> Since this is a new project with no existing tests, verification will be done visually via the browser. I'll load the page and test each feature interactively.
