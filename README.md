# 🩺 aidAR — AI-Powered First-Aid Assistant

> An interactive, Awwwards-style medical platform featuring a 3D anatomy viewer, AI-powered diagnostic chatbot, and real-time AR narration — built with Next.js 15, React Three Fiber, Framer Motion, and GSAP.

---

## ✨ Features

### 🫀 3D Interactive Atlas (`/viewer`)
- Load and interact with high-fidelity `.fbx` anatomy models (CPR Training & Bleeding Control)
- Built with **React Three Fiber** + **@react-three/drei**
- Smooth orbit controls with auto-rotate and dynamic lighting
- Switch between models with a sleek, glassmorphism control panel

### 💬 AI Doctor (`/doctor`)
- Real-time medical symptom assessment powered by **Ollama** (MedLlama2)
- Server-side API proxy to avoid CORS issues
- Animated chat UI with Framer Motion (message stagger, typing indicators)
- Quick-reply symptom buttons and red-flag emergency detection

### 🎙️ AR Narrator
- Contextual text-to-speech narration synced to 3D model animations
- Camera orientation detection (Front / Back / Left / Right views)
- Zoom-level awareness (Close / Medium / Far)
- Queued speech system — each narration completes before the next begins
- Mute/unmute toggle button

### 🖥️ Premium Landing Page (`/`)
- Cinematic preloader animation with Framer Motion
- Mouse-reactive 3D hero background (distorted sphere tracks cursor)
- GSAP ScrollTrigger text reveal animations
- Lenis smooth scrolling
- **VengeanceUI-style floating dock** navigation with physics-based hover scaling

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D Engine | React Three Fiber + Three.js |
| 3D Utilities | @react-three/drei, three-stdlib |
| Animations | Framer Motion, GSAP + ScrollTrigger |
| Smooth Scroll | @studio-freight/react-lenis |
| AI Backend | Ollama (MedLlama2 model) |
| Speech | Web Speech API (SpeechSynthesis) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **Ollama** installed and running ([ollama.com](https://ollama.com))
- **MedLlama2** model pulled: `ollama pull medllama2`

### Installation

```bash
# Clone the repository
git clone https://github.com/uchiha-sasuke-03/DoctorAI_VibeCoders.git
cd DoctorAI_VibeCoders

# Install dependencies for the Next.js app
cd landing-next
npm install

# Start the development server
npm run dev
```

### Running Ollama (for AI Doctor)

In a separate terminal:
```bash
ollama run medllama2
```

Then open **http://localhost:3000** in your browser.

---

## 📁 Project Structure

```
DoctorAI_VibeCoders/
├── landing-next/                  # Next.js 15 Application
│   ├── public/
│   │   └── models/                # FBX 3D models (cpr1.fbx, bleeding.fbx)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page with 3D hero + GSAP
│   │   │   ├── doctor/page.tsx    # AI Doctor chat interface
│   │   │   ├── viewer/page.tsx    # 3D Atlas viewer + AR Narrator
│   │   │   └── api/chat/route.ts  # Ollama proxy API route
│   │   ├── components/
│   │   │   ├── 3d/                # HeroScene, ModelViewer, ClientModelScene
│   │   │   ├── animations/        # WelcomeScreen preloader
│   │   │   ├── navigation/        # VengeanceDock (floating nav)
│   │   │   └── providers/         # SmoothScrollProvider (Lenis)
│   │   └── lib/
│   │       ├── diagnostic-engine.ts  # Ollama chat hook
│   │       └── narration-data.ts     # CPR/Bleeding narration texts
│   └── ...
├── src/                           # Original Vite application (legacy)
├── index.html                     # Legacy landing page
├── doctor.html                    # Legacy AI Doctor page
└── viewer.html                    # Legacy 3D viewer page
```

---

## 🎯 Routes

| Route | Description |
|-------|-------------|
| `/` | Cinematic landing page with 3D hero, GSAP scroll animations, and VengeanceUI dock |
| `/doctor` | AI-powered medical chatbot (requires Ollama running locally) |
| `/viewer` | Interactive 3D anatomy viewer with AR narration and text-to-speech |

---

## ⚠️ Disclaimer

> **aidAR is for educational and informational purposes only.** It does not provide real medical diagnoses. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.

---

## 👥 Team

**VibeCoders** — Built with ❤️ for emergencies.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
