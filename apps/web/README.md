# EcoQuest AI — Web App

React + Vite + Tailwind greenfield frontend for the EcoQuest AI SDG learning platform.

## Milestone 4 (current)

- Mission catalog for all 17 SDGs (21 missions total)
- Full missions for SDG 6, 11, 13, 15 (8 missions with objectives, instructions, impact)
- Placeholder missions for remaining SDGs (locked until expanded)
- Mission states: locked, available, in_progress, submitted, approved, completed
- Mock submission flow (photo upload UI, notes, localStorage)
- Dashboard mission widgets (active missions, completion rate, streak, impact score)
- Routes: `/missions`, `/missions/:sdgId`, `/missions/:sdgId/:missionId`

## Milestone 3

- Quiz catalog for all 17 SDGs (one quiz per lesson)
- Full quizzes for SDG 6, 11, 13, 15 (8 quizzes, 4 question types)
- Quiz session tracking with localStorage
- Results with strengths, improvements, recommendations
- Dashboard quiz widgets

## Milestone 2

- Lessons catalog for all 17 SDGs
- SDG lesson paths with completion stats
- Full lesson reader (SDG 6, 11, 13, 15)
- Progress tracking via localStorage + React context
- Dashboard lesson widgets (continue, recommend, recent)

## Milestone 1

- Design system & theme tokens
- AppShell with sidebar + navbar
- Dashboard (mock data)
- SDG Explorer (mock data, 17 goals)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React

Legacy static HTML in the repository root is reference-only and not part of this app.
