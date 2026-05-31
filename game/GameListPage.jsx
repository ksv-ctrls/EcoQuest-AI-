import React, { useState } from "react";

const GAMES = [
  {
    id: 1,
    title: "Eco Family Budget Challenge",
    type: "Strategy",
    difficulty: "Easy",
    xp: 150,
    time: "10–15 min",
    badge: "💰 Smart Planner",
    description:
      "Allocate limited money across food, transport and energy while keeping your family eco-friendly.",
    tags: ["SDG 1", "SDG 12", "Real-life choices"],
    link: "/games/family-budget.html",
  },
  {
    id: 2,
    title: "Carbon Footprint Dash",
    type: "Arcade",
    difficulty: "Medium",
    xp: 200,
    time: "8–10 min",
    badge: "🌍 Carbon Cutter",
    description:
      "Tap to choose low-carbon options faster than the timer. Every wrong choice increases your footprint!",
    tags: ["Climate", "Speed", "Reaction"],
    link: "/games/carbon-dash.html",
  },
  {
    id: 3,
    title: "Zero-Waste Sorting Lab",
    type: "Puzzle",
    difficulty: "Medium",
    xp: 220,
    time: "12–15 min",
    badge: "♻️ Waste Warrior",
    description:
      "Drag and drop items into the correct bins: recycle, compost, e-waste, reuse or landfill.",
    tags: ["SDG 12", "Waste", "Drag & Drop"],
    link: "/games/waste-sorting.html",
  },
  {
    id: 4,
    title: "City of Tomorrow Simulator",
    type: "Simulation",
    difficulty: "Hard",
    xp: 300,
    time: "15–20 min",
    badge: "🏙️ Green Architect",
    description:
      "Design a future city balancing green spaces, transport and clean energy without breaking the CO₂ limit.",
    tags: ["SDG 11", "Systems thinking", "Simulation"],
    link: "/games/city-sim.html",
  },
  {
    id: 5,
    title: "Biodiversity Rescue Quest",
    type: "Adventure",
    difficulty: "Easy",
    xp: 160,
    time: "10–12 min",
    badge: "🦋 Eco Explorer",
    description:
      "Explore different habitats, identify threats and choose actions to protect key species.",
    tags: ["SDG 15", "Habitats", "Story-based"],
    link: "/games/biodiversity-quest.html",
  },
];

const FILTERS = ["All", "Easy", "Medium", "Hard"];

export default function GameListPage() {
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredGames = GAMES.filter((game) => {
    const matchesDifficulty =
      difficultyFilter === "All" || game.difficulty === difficultyFilter;
    const matchesSearch =
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.description.toLowerCase().includes(search.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center relative">
      {/* subtle grid overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_1px,_transparent_0)] [background-size:60px_60px]" />

      <div className="w-full max-w-6xl relative z-10">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-text-secondary">
              EcoGamifiedEdu · Mini Games
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 bg-gradient-to-b from-white to-text-secondary bg-clip-text text-transparent">
              Explore Environmental Mini-Games
            </h1>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-2xl">
              Earn eco-points, unlock badges and practice real-world SDG
              decisions in short, replayable games.
            </p>
          </div>

          {/* XP summary pill */}
          <div className="rounded-2xl bg-card-primary/60 border border-white/10 px-4 py-3 shadow-neon backdrop-blur">
            <p className="text-xs text-text-secondary">Total Eco-Points</p>
            <p className="font-semibold text-lg">1,250 XP</p>
            <p className="text-xs text-text-secondary">Current level: 8</p>
          </div>
        </header>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Difficulty filter pills */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f === difficultyFilter;
              return (
                <button
                  key={f}
                  onClick={() => setDifficultyFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${
                      active
                        ? "border-transparent bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-neon-soft"
                        : "border-white/15 bg-card-secondary/60 text-text-secondary hover:border-accent-purple/70 hover:text-white"
                    }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Search field */}
          <div className="ml-auto flex-1 min-w-[200px] max-w-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full bg-card-secondary/70 border border-white/10 px-9 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/60 shadow-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Games grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <article
              key={game.id}
              className="group relative overflow-hidden rounded-2xl bg-card-primary/80 border border-white/10 shadow-neon backdrop-blur-sm p-4 flex flex-col"
            >
              {/* glow gradient in corner */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-accent-purple/40 to-accent-pink/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-base font-semibold leading-snug">
                  {game.title}
                </h2>
                <span className="text-xs px-2 py-1 rounded-full bg-card-secondary/90 border border-white/10 text-text-secondary whitespace-nowrap">
                  {game.type}
                </span>
              </div>

              <p className="text-xs text-text-secondary mb-3 min-h-[44px]">
                {game.description}
              </p>

              {/* meta row */}
              <div className="flex items-center justify-between text-[11px] text-text-secondary mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      "px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide " +
                      (game.difficulty === "Easy"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : game.difficulty === "Medium"
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-rose-500/15 text-rose-300")
                    }
                  >
                    {game.difficulty}
                  </span>
                  <span>⏱ {game.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{game.xp} XP</span>
                </div>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-card-secondary/80 border border-white/10 text-text-secondary group-hover:border-accent-purple/60 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* bottom row */}
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-accent-pink/90">
                  {game.badge}
                </span>
                <a
                  href={game.link}
                  className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink px-3 py-1.5 text-xs font-semibold text-white shadow-neon-soft transition-transform group-hover:-translate-y-[1px]"
                >
                  Play now
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    ▷
                  </span>
                </a>
              </div>
            </article>
          ))}

          {filteredGames.length === 0 && (
            <div className="col-span-full text-center text-text-secondary py-10 text-sm">
              No games match your filters yet. Try changing difficulty or
              search term.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
