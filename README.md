# Study Gamifier

**A Gamified Study Platform with AI Anti-Cheating & Real Rewards.**
*Built for the students of Nelamangala.*

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Dashboard+Preview)

## 🚀 Features

### 🎮 Gamification
- **Points System**: Earn 2 XP per minute of focus.
- **Commute Mode**: Toggle "Travel Focus" to earn **1.5x points** while on the bus.
- **Streaks**: Daily tracking to build habits.
- **Stock Market**: Invest your XP in virtual stocks like HDFC and Reliance.

### 🛡️ Anti-Cheat (AI Powered)
- **Face Detection**: Pauses timer if you look away (TensorFlow.js).
- **Tab Monitoring**: Warns you if you switch tabs.

### 🏆 Rewards
- **Leaderboard**: Filter by "Global" or "Nelamangala" to compete locally.
- **Real Prizes**: Win Redmi Phones, Gaming Chairs, and Earphones.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **AI**: TensorFlow.js (BlazeFace)
- **Database**: Firebase (Firestore)
- **Deployment**: Docker / Vercel / Railway

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Docker (Optional)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/study-gamifier.git
   cd study-gamifier
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   Copy variables to `.env.local` (see `.env.example`).
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Docker Deployment (Railway/Render)

The project is optimized for Docker (Alpine Linux).

```bash
# Build
docker build -t study-gamifier .

# Run
docker run -p 3000:3000 study-gamifier
```

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

---
*Created with ❤️ by Koushik*
