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

Supported rosters: **8/6**, **2/1** (2 weeks on / 1 week off), and **2/2**.

---

## How it works

1. **Gross swing pay** — For hourly roles the app treats each on-site day as 12 paid hours (`hourly rate × 12 × days on`). Salary roles divide the annual figure by the number of swing cycles in the year.
2. **Annualisation** — The swing cycle length divides into a 365.25-day year to produce the number of cycles per year, which is used to calculate all annual, monthly, and per-swing figures.
3. **Income tax** — Australian resident tax brackets for 2024–25 are applied to the annualised gross, or the backpacker flat-rate schedule if that option is selected.
4. **Medicare levy** — A flat 2 % of gross income is added for resident taxpayers.
5. **HECS-HELP repayments** — If selected, the compulsory annual repayment rate for the income band is deducted from net pay.
6. **Superannuation** — Calculated separately as employer super on top of take-home pay. For hourly roles, super is applied to a configurable number of hours per day (default 8) at the chosen super rate percentage.

All calculations run entirely in the browser — no data is sent to a server.

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
| CI/CD | GitHub Actions |

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
