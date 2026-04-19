# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS (dark theme, neon cyan)
- **State**: Zustand (cart), TanStack Query (API)
- **Routing**: Wouter
- **Animations**: Framer Motion

## Applications

### FiveM Script Store (`artifacts/fivem-store`)
A premium FiveM script marketplace with FiveM Asset Escrow integration.

**Pages:**
- `/` — Homepage: hero, featured scripts, categories, stats, trust section
- `/scripts` — Catalog with search, category filter, sort
- `/scripts/:id` — Script detail with reviews and add-to-cart
- `/cart` — Cart with checkout form → creates order
- `/orders/:id` — Order confirmation with escrow keys
- `/admin` — Admin dashboard (stats, recent orders)
- `/admin/scripts` — Manage scripts (CRUD)
- `/admin/orders` — View all orders
- `/admin/categories` — Manage categories

**Schema:** categories, scripts, orders, reviews tables

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/fivem-store run dev` — run frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
