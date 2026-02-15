# HandInHand - ASL Learning Platform

An interactive American Sign Language learning app that uses AI-powered video evaluation to give real-time feedback on your signing. Built with React + FastAPI, featuring a gamified lesson path with XP, streaks, leveling, and adaptive mastery tracking.

## How It Works

1. **Watch** a reference video of the correct ASL sign
2. **Record** yourself performing the sign via webcam
3. **Get scored** by AI (Gemini 2.5 Flash) on a 0-4 scale with detailed feedback
4. **Progress** through lessons, earn XP, level up, and build your vocabulary

The backend extracts hand/body landmarks from your video using MediaPipe, compares them against reference landmarks, and sends both to Google's Gemini AI for evaluation.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - build tool & dev server
- **Tailwind CSS** - styling
- **Motion** (Framer Motion) - animations
- **Radix UI** - accessible headless components
- **Lucide React** - icons

### Backend
- **FastAPI** with Uvicorn
- **MediaPipe** - hand & face landmark extraction from video
- **OpenCV** - video processing
- **Google Gemini API** (gemini-2.5-flash) - AI sign evaluation
- **ffmpeg** - video format transcoding (WebM to MP4)
- **Pydantic** - request/response validation

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- ffmpeg installed (`brew install ffmpeg` on macOS)
- A [Google AI Studio](https://aistudio.google.com/apikey) API key (free)

### Backend Setup

```bash
# Create virtual environment
python3.11 -m venv env
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up your Gemini API key
echo 'GEMINI_API_KEY=your_key_here' > backend/.env

# Start the server
uvicorn backend.app.main:app --reload --port 8000
```

Verify it's running: `http://localhost:8000/health` should return `{"status": "healthy"}`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend at `localhost:8000`.

> **Important:** Word names must match exactly between frontend lesson definitions and backend reference landmark filenames (e.g., `hello.json`, `greeting.json`).

## Project Structure

```
Douling-for-ASL/
├── frontend/
│   ├── src/app/
│   │   ├── App.tsx                          # Root component
│   │   ├── components/
│   │   │   ├── lesson-path.tsx              # Main game hub (state, progression, XP)
│   │   │   ├── learning-path.tsx            # Visual SVG lesson path with pixel art
│   │   │   ├── lesson-node.tsx              # Individual lesson node (planet/checkpoint)
│   │   │   ├── sublesson-screen1.tsx        # SS1: Watch reference + record attempt
│   │   │   ├── sublesson-screen2.tsx        # SS2: Multiple choice recognition quiz
│   │   │   ├── sublesson-screen3.tsx        # SS3: Pure production (no reference shown)
│   │   │   ├── EvaluationModal.tsx          # AI feedback display (score, pros, cons)
│   │   │   ├── lesson-complete-modal.tsx    # End-of-lesson XP summary
│   │   │   ├── sidebar.tsx                  # Profile, stats, dictionary, settings
│   │   │   ├── avatar-builder.tsx           # Customizable avatar creator
│   │   │   ├── avatar-preview.tsx           # Avatar SVG renderer
│   │   │   ├── confetti.tsx                 # Celebration animation
│   │   │   └── pixel-character.tsx          # Pixel art mascot
│   │   └── lib/
│   │       └── lesson-algorithm.ts          # Slot generation, mastery, word selection
│   ├── public/videos/                       # Reference sign videos
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/app/
│   ├── main.py                              # FastAPI endpoints
│   ├── schemas/
│   │   └── evaluation.py                    # Pydantic response models
│   ├── services/
│   │   ├── video_convert.py                 # Video → MediaPipe landmarks
│   │   ├── landmark_extractor.py            # Reference video landmark extraction
│   │   ├── landmark_load.py                 # Load pre-extracted reference JSON
│   │   ├── reference_landmarks/             # Pre-extracted landmark JSONs
│   │   └── reference_videos/                # Source reference videos
│   └── gemini/
│       ├── getresponse.py                   # Gemini API integration & response parsing
│       └── context/
│           ├── prompt.json                  # Judging task, rules, and rubric
│           ├── rubric.json                  # 12 detailed evaluation criteria
│           └── format.json                  # Expected output format
└── requirements.txt
```

## Supported Signs

**21 words** across 4 units:

| Unit | Lessons | Words |
|------|---------|-------|
| **Greetings & Basics** | 1-3 | Hello, Goodbye, Please, Thank You, Nice To Meet You, Sorry |
| **Family** | 4-6 | Boy, Girl, Man, Woman, Father, Mother |
| **Daily Life** | 7-9 | Brother, Sister, Student, Teacher, Family, Friend |
| **Out & About** | 11-14 | Places & Locations, Travel, Shopping, Weather, Time & Dates |

Each unit ends with a checkpoint test covering all words from that unit.

## Game Mechanics

### Lesson Structure

Each lesson has **6 sub-lesson slots** (unit tests have 12):

| Slot | Type | What Happens |
|------|------|-------------|
| 0 | SS1 (Intro) | Watch reference video, record your attempt |
| 1 | SS2 (Quiz) | Multiple choice — identify the sign |
| 2 | SS1 (Intro) | Second word introduction |
| 3 | SS2 (Quiz) | Second word quiz |
| 4 | SS3 (Production) | Record the sign with no reference shown |
| 5 | SS2 (Review) | Final review quiz |

Slots adapt based on performance — if you get a quiz wrong, later slots adjust to remediate that word.

### Scoring (0-4 Scale)

| Score | Meaning |
|-------|---------|
| 4 | Clearly the same sign, minor differences |
| 3 | Recognizably the same sign **(pass threshold)** |
| 2 | Some resemblance, but intent unclear |
| 1 | Mostly different, slight resemblance |
| 0 | Does not resemble the sign |

### XP & Leveling

| Level | Cumulative XP Required |
|-------|----------------------|
| 1 | 0 |
| 2 | 20 |
| 3 | 50 |
| 4 | 95 |
| 5 | 160 |
| 6 | 250 |
| 7 | 375 |
| 8 | 550 |
| 9 | 790 |
| 10 | 1120 |

XP is only awarded if **all** video-evaluated slots (SS1 & SS3) score >= 3. Otherwise, 0 XP for the whole lesson.

### Mastery Tracking

Each word tracks recognition accuracy using Laplace-smoothed rates: `(correct + 1) / (attempts + 2)`. Weaker words appear more often in lessons and are prioritized for review.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/evaluate-sign?word={word}` | Submit a video for AI evaluation (accepts WebM, MP4) |
| `POST` | `/rating?word={word}` | Legacy evaluation endpoint (MP4 only) |
| `GET` | `/health` | Health check |

### Example API Call

```bash
curl -X POST "http://localhost:8000/api/evaluate-sign?word=hello" \
  -F "video=@your_recording.webm"
```

### Response Format

```json
{
  "word": "hello",
  "evaluation": {
    "overall_score_0_to_4": 3,
    "summary": "Your wave motion is recognizable as hello...",
    "pros": { "points": ["Clear hand movement", "Good positioning"] },
    "cons": { "points": ["Try to extend fingers more"] }
  }
}
```

## Evaluation Pipeline

```
User records video (WebM)
        ↓
Backend receives upload
        ↓
ffmpeg transcodes to MP4 (if needed)
        ↓
MediaPipe extracts landmarks:
  - 21 hand joints per hand (every frame)
  - 8 face key points (every 10th frame)
        ↓
Load pre-extracted reference landmarks
        ↓
Send both to Gemini 2.5 Flash with:
  - Judging task & rules
  - 12-criteria rubric
  - Lenient scoring bias
        ↓
Parse & validate JSON response
        ↓
Return score (0-4) + feedback to frontend
```

## Features

- **AI-Powered Evaluation** — Real-time feedback on sign accuracy using Gemini AI
- **Adaptive Lessons** — Slots adjust based on your mistakes
- **Mastery System** — Weaker words are practiced more often
- **Custom Avatar** — Build your own with skin, eyes, hair, and accessories
- **Dictionary** — Review completed signs with reference videos
- **Daily Goals** — Configurable XP targets with progress tracking
- **Streak Tracking** — Keep your daily practice streak going
- **Pixel Art Theme** — Space-themed visual path with planets and galaxies
