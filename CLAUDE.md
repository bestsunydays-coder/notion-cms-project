# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📌 Quick Start Commands

**Development & Building:**
- `npm run dev` — Start dev server at http://localhost:3000
- `npm run build` — Create production build
- `npm start` — Run production server
- `npm run lint` — Run ESLint checks

**Environment Setup:**
- Create `.env.local` with `NOTION_API_KEY` and `NOTION_DATABASE_ID`
- See README.md for Notion API setup instructions

---

## 🏗️ Architecture Overview

### Project Purpose
A Notion-based CMS for a travel blog. Content is managed entirely in Notion; the Next.js app fetches and displays it.

### Tech Stack
- **Framework**: Next.js 15 (App Router) — **See AGENTS.md for breaking changes**
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **CMS**: Notion API
- **Theme**: next-themes for dark mode support
- **Path Alias**: `@/*` maps to `./src/*`

### Data Flow
1. **Notion Database** (source of truth)
   - Fields: Title, Category, Tags, Published (date), Status (draft/published), Content
   - See docs/PRD.md for complete database schema

2. **API Layer** (`src/lib/notion.ts` — **to be implemented**)
   - Queries Notion API for posts, categories, tags
   - Implements caching/ISR strategy per Phase 2 roadmap
   - Type definitions in `src/lib/types.ts`

3. **Pages** (`src/app/`)
   - `/` — Home page (recent posts list)
   - `/posts/[slug]` — Individual post with Notion block rendering
   - `/categories/[category]` — Category-filtered posts
   - `/search` — Client-side search

4. **Components** (`src/components/`)
   - UI components from shadcn/ui (installed via `npx shadcn add`)
   - Theme provider wrapping app with next-themes
   - Post cards, pagination, search bar (to be built)

### Important Implementation Notes

**Notion Block Rendering:**
- Complex Notion blocks need careful handling (text, images, lists, code, etc.)
- Plan to use `react-notion-x` or similar library per Phase 2 roadmap
- Ensure safe HTML rendering (XSS prevention)

**Performance & Caching:**
- Use Next.js ISR (Incremental Static Regeneration) for Notion content
- Notion API rate limiting requires strategic caching
- Image optimization via Next.js Image component

**TypeScript:**
- Strict mode enabled; avoid `any` types
- Define types for Notion API responses in `src/lib/types.ts`

**Shadcn/ui Components:**
- Add new components with: `npx shadcn@latest add [component-name]`
- Installed components live in `src/components/ui/`

---

## 📚 Documentation References

- **PRD & Requirements**: `docs/PRD.md` — Full product specification with database schema
- **Development Roadmap**: `docs/ROADMAP.md` — Phased development plan (Phase 1-5)
- **Next.js Breaking Changes**: See AGENTS.md comment block and check `node_modules/next/dist/docs/` before implementing

---

## 🌍 Language & Conventions

All per user's global CLAUDE.md:
- **Response language**: Korean
- **Code comments**: Korean
- **Commit messages**: Korean
- **Documentation**: Korean
- **Code identifiers** (variables, functions): English (standard convention)

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with ThemeProvider wrapper |
| `src/app/page.tsx` | Home page (initial implementation) |
| `src/lib/utils.ts` | Tailwind className helper (`cn()`) |
| `src/lib/supabase.ts` | *Currently unused; may be removed or used for auth later* |
| `tsconfig.json` | Path alias `@/*` → `./src/*` already configured |
| `next.config.ts` | Currently minimal; may need Notion-specific config |

---

## ⚙️ Development Workflow

1. **Before making changes to Next.js APIs**: Check `node_modules/next/dist/docs/` — Next 15 has breaking changes from training data
2. **Adding UI components**: Use shadcn/ui (`npx shadcn@latest add`), not custom components
3. **Styling**: Use Tailwind utilities; avoid inline styles
4. **Type safety**: Ensure all Notion API types are properly defined
5. **Testing changes**: Run `npm run dev` and test locally before committing
6. **Linting**: Run `npm run lint` before committing
