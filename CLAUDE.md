# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**the-magician** is a Next.js WebUI for "CODE OF JOKER" (コード・オブ・ジョーカー), a trading card game simulator. It connects to [the-fool](https://github.com/sweshelo/the-fool) WebSocket server for real-time gameplay.

## Development Commands

```bash
# Install dependencies (also initializes git submodules)
bun install

# Development server (port 3000)
bun dev

# Production build
bun run build

# Start production server
bun start
```

## Environment Setup

Copy `.env.sample` to `.env.local` and configure:

- `NEXT_PUBLIC_SERVER_HOST` - WebSocket server address (the-fool)
- `NEXT_PUBLIC_SECURE_CONNECTION` - Use WSS ("true"/"false")
- `NEXT_PUBLIC_IMAGE_SIZE` - Card image size ("thum" | "normal" | "full")

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages (builder, entrance, room/[id])
- `src/feature/` - Feature-level container components (Game, Field, Hand, MyArea, DeckBuilder)
- `src/component/interface/` - Reusable UI components (Button, Toggle, NumberInput)
- `src/component/ui/` - Game-specific UI elements (CardView, CardDetailWindow)
- `src/hooks/` - Custom hooks organized by concern
- `src/service/` - Business logic (WebSocketService, LocalStorageHelper)
- `src/helper/` - Utility functions (color, game, image)
- `src/submodule/suit/` - Git submodule with shared TypeScript types from [suit](https://github.com/sweshelo/suit)

### State Management

Uses **Zustand** with React Context pattern:

- Central store: `useGameStore` in `src/hooks/game/context.tsx`
- Game state structure: `{ players, game, rule }`
- Shallow subscription hooks (usePlayer, useField, useHand, useTurnPlayer) to prevent unnecessary re-renders

### Context Providers

Root layout wraps app with providers in this order (see `src/hooks/index.tsx`):

1. ErrorOverlayProvider
2. WebSocketProvider
3. SystemContextProvider
4. AttackAnimationProvider
5. SoundManagerV2Provider

### WebSocket Communication

`src/service/websocket.ts` provides event emitter-based WebSocket client with:

- Automatic reconnection handling
- Event-driven message processing
- Game state synchronization with the-fool server

### Theme System

Dynamic theming by turn order in `src/helper/color.ts`:

- `useSelfTheme()` / `useOpponentTheme()` hooks
- Theme objects contain UI colors, text colors, borders, backgrounds

### Drag-and-Drop

Uses dnd-kit with:

- Custom cursor-based collision detection
- Window edge restrictions via modifiers
- PointerSensor + TouchSensor for cross-device support

## Type Definitions

Shared types (ICard, IPlayer, Rule) come from the `suit` git submodule at `src/submodule/suit/types/`. Run `git submodule update --init --recursive` if types are missing (this runs automatically during `bun install`).

## Coding Conventions

### Prohibited Patterns

- **`as unknown as` is strictly prohibited.** Use proper type guards, generics, or fix the type definitions instead. This pattern bypasses TypeScript's type checking and can hide bugs.
