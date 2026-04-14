# Launch Checklist – Pages & Templates

A to-do list of pages and components needed before putting this project live.

---

## Pages

- [ ] **404 Not Found** – `src/app/not-found.tsx`
  Custom page shown when a user navigates to a URL that doesn't exist.

- [ ] **500 / Global Error** – `src/app/error.tsx`
  Client-side error boundary shown when an unhandled runtime error occurs.

- [ ] **About / How It Works** – `src/app/about/page.tsx`
  Explains what the calculator does, how FIFO rosters work, and how tax / super / HECS are calculated.

- [ ] **Privacy Policy** – `src/app/privacy/page.tsx`
  Details what data (if any) is collected, how it is used, and user rights.

- [ ] **Terms of Use** – `src/app/terms/page.tsx`
  Covers disclaimer of liability, acceptable use, and limitations of the calculator's accuracy.

---

## Layout / Shared Templates

- [ ] **Header / Navigation** – `src/components/ui/Header.tsx`
  Site-wide header with logo/site name and navigation links (Home, About, etc.).

- [ ] **Footer** – `src/components/ui/Footer.tsx`
  Site-wide footer with links to Privacy Policy, Terms of Use, and a brief disclaimer that results are estimates only.

- [ ] **Loading State** – `src/app/loading.tsx`
  Next.js loading template shown while a page or segment is suspending.

---

## Metadata & SEO

- [ ] Update `src/app/layout.tsx` metadata:
  - Replace placeholder `title` ("Create Next App") with the real site name.
  - Replace placeholder `description` with a meaningful description of the calculator.
  - Add Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`).
  - Add `twitter:card` meta tags.

- [ ] Add `src/app/sitemap.ts` to generate a sitemap for search engines.

- [ ] Add `src/app/robots.ts` to generate a `robots.txt` file.

---

## Accessibility & UX

- [ ] Replace native `<select>` in `FifoJobInput.tsx` with the shadcn/ui `<Select>` component for consistent styling and accessibility.
- [ ] Replace native `<input type="radio">` / `<input type="checkbox">` elements in `FifoJobInput.tsx` with the shadcn/ui `<RadioGroup>` and `<Checkbox>` components.
- [ ] Add a visible page `<h1>` heading to the home page so the purpose of the tool is immediately clear to screen readers and visitors.
