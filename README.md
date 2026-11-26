# Nuance — a countertechnology prototype

A LinkedIn-inspired professional network built for the University of Cambridge R175 Countertechnologies
project. It shows a redesign in which a "connection" is no longer one undifferentiated thing. All people,
organisations and posts are fictional. There is no real API: data is local mock data persisted in `localStorage`.

## Run locally

Requires [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (check with `node -v`).

```bash
git clone <this-repo-url>
cd nuance-countertech
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173). Stop it with Ctrl + C.

## Demo walkthrough

1. **Mode toggle** (top right): switch between *Standard mode* (one-click connections, "1st" badges,
   "500+ connections") and the *Nuance redesign*. Both modes show the same network.
2. **Connect** on a suggested person: with the *reflection buffer* on (My Network → Reflection settings),
   they go onto your **Met list** for a 7-day reflection period — nothing is sent. Confirm (→ describe the
   relationship and send the invitation), dismiss, or leave it pending; unconfirmed encounters lapse.
   With the buffer off, Connect goes straight to the invitation step: choose a relationship type and say
   what it rests on. If you pick a brief encounter, Nuance suggests following instead.
3. **My Network → Invitations**: see how the sender describes the relationship. You can *Agree & accept*,
   *describe it differently* (both descriptions are kept), *Follow instead*, or *Ignore*.
4. **Due for reflection**: connections come back for review over time (brief: 6 months, shared
   workplace/study: 12, close: 18; undescribed ones right away). Confirm, redescribe, downgrade to
   follow, or remove. Reminders can be switched off and never change anything on their own; **Edit**
   (on any connection row or profile) changes a description at any time.
5. **Profiles** show "How you know each other" (both sides' descriptions, including disagreements) and a
   relationship spectrum in place of a connection count.
6. **Feed** can be filtered by relationship depth.
7. **Me → Reset demo data** restores the original state.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/types.ts` | Data model (Person, Connection, Invitation, …) |
| `src/lib/relationships.ts` | Relationship types, tiers, colours, review intervals. Edit this to change the vocabulary |
| `src/data/mockData.ts` | Fictional people, connections, invitations, posts, messages |
| `src/store/AppContext.tsx` | App state, actions, and localStorage persistence |
| `src/components/` | Navbar, post cards, relationship form, connect/reflect modals, Met list, … |
| `src/pages/` | Home, Network, Profile, Messaging, Notifications, About |
