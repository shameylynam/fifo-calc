# FIFO Pay Calculator

A free, browser-based tool that estimates take-home pay, income tax, superannuation, and HECS-HELP repayments for Fly-In Fly-Out (FIFO) workers in Australia.

**Live site:** https://fifocalculator.net

---

## What it does

FIFO workers are paid on rotating rosters rather than standard weekly hours, which makes it hard to compare job offers or work out a realistic monthly budget. This calculator takes an hourly rate or annual salary, a roster type, and a handful of tax settings, then returns:

- Gross and net pay per swing, per month, and per year
- Income tax and Medicare levy breakdown
- Employer superannuation (configurable rate and hours per day)
- HECS-HELP repayment estimates
- **AI Overview** — an AI-generated plain-English summary of your results, powered by [Anthropic Claude](https://www.anthropic.com). When comparing two jobs, the AI highlights key financial differences and states which offer comes out ahead.

Supported rosters: **8/6**, **2/1**, **2/2** or a custom roster.

---

## How it works

1. **Gross swing pay** — For hourly roles the app treats each on-site day as 12 paid hours (`hourly rate × 12 × days on`). Salary roles divide the annual figure by the number of swing cycles in the year.
2. **Annualisation** — The swing cycle length divides into a 365.25-day year to produce the number of cycles per year, which is used to calculate all annual, monthly, and per-swing figures.
3. **Income tax** — Australian resident tax brackets for 2024–25 are applied to the annualised gross, or the backpacker flat-rate schedule if that option is selected.
4. **Medicare levy** — A flat 2 % of gross income is added for resident taxpayers.
5. **HECS-HELP repayments** — If selected, the compulsory annual repayment rate for the income band is deducted from net pay.
6. **Superannuation** — Calculated separately as employer super on top of take-home pay. For hourly roles, super is applied to a configurable number of hours per day (default 8) at the chosen super rate percentage.

Tax and pay calculations run entirely in the browser. After you submit the form, the calculated results (pay figures, tax, super, and roster data — **not** your raw inputs) are sent to an Anthropic API endpoint to generate the AI Overview. No data is stored by the application.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, static export) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI components | [shadcn/ui](https://ui.shadcn.com) |
| Charts | [Recharts](https://recharts.org) |
| Forms & validation | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Icons | [HugeIcons](https://hugeicons.com) + [Lucide React](https://lucide.dev) |
| Hosting | [AWS Amplify](https://aws.amazon.com/amplify/) |

---

## Roadmap

Features planned for future releases:

- [ ] **Overtime compensation** — Support for overtime rates (e.g. time-and-a-half, double time) applied to hours worked beyond a standard shift.
- [ ] **Public holiday rates** — Apply configurable public holiday pay multipliers to relevant days within a swing.

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
npm run build   # production build
npm run lint    # ESLint
```

---

## Backend boilerplate (Amplify + Next.js)

This project now includes a starter backend layer for Next.js App Router routes:

- `GET /api/health` - service health check
- `GET /api/todos` - list `Todo` records from Amplify Data
- `POST /api/todos` - create a `Todo` record in Amplify Data

Amplify server client helper:

- `src/lib/server/amplify-server.ts`

### 1. Install dependencies

```bash
npm install
```

### 2. Generate backend outputs locally

Run Amplify sandbox from project root:

```bash
npx ampx sandbox
```

This generates `amplify_outputs.json` with your backend environment values.

### 3. Run Next.js

```bash
npm run dev
```

### 4. Test backend routes

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/todos
curl -X POST http://localhost:3000/api/todos -H "content-type: application/json" -d '{"content":"First todo"}'
```

### Notes for AWS Amplify hosting

- In Amplify Hosting builds, ensure backend deployment is connected so `amplify_outputs.json` is available during build/runtime.
- The current data model allows guest access and uses identity pool auth mode (`amplify/data/resource.ts`).
