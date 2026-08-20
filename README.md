# Arena Steel Bid

Guided 9-step wizard for structural steel detailing estimation.

## Stack

- Next.js App Router
- Tailwind CSS
- Zustand (`useProjectStore`)
- Lucide React
- `xlsx`, `jspdf`, `jspdf-autotable`

## Workflow

1. **UPLOAD** — project / client info and drawing set
2. **ANALYZE** — parse sheets and member groups
3. **REVIEW** — confirm scope and exclusions
4. **GENERATE MTO** — material takeoff
5. **REVIEW MTO** — edit quantities and approve
6. **CONNECTIONS** — shear, moment, brace, base plates
7. **HOURS** — modeling through PM
8. **PRICING** — rates, contingency, markup
9. **BID DOCUMENTS** — export PDF and Excel

Project state lives in `src/store/useProjectStore.js` and persists across steps (and browser refreshes).

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
