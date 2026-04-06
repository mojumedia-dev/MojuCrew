# MojuCrew QA Checklist

Follow the Build → QA → Fix → Deploy process for all releases.

---

## 1. BUILD
- [ ] Code written mobile-first (320px base, scale up)
- [ ] Commits are frequent with clear messages
- [ ] Basic self-test: app runs, no console errors, core flow works

---

## 2. QA

### Functional
- [ ] Sign up / sign in works
- [ ] Dashboard loads all 11 bot pages
- [ ] Bot setup wizard completes and saves config
- [ ] Reconfigure and Deactivate work on each bot
- [ ] API routes return correct responses (bot-config GET/POST/DELETE)

### Responsive (test at 320px, 375px, 768px, 1024px, 1440px)
- [ ] Landing page nav doesn't overflow on mobile
- [ ] Hero text readable at 320px
- [ ] Pricing cards stack correctly on mobile
- [ ] Dashboard sidebar collapses/adapts on mobile
- [ ] Bot setup wizard is usable on mobile

### Cross-browser
- [ ] Chrome
- [ ] Safari (mobile + desktop)
- [ ] Firefox

### Security
- [ ] All API routes check auth (`currentUser()` or equivalent)
- [ ] No env vars exposed client-side (no `NEXT_PUBLIC_` on secrets)
- [ ] Input fields don't allow script injection
- [ ] OAuth tokens stored server-side only (Supabase, not localStorage)
- [ ] Cron endpoints validate `CRON_SECRET`

### Performance
- [ ] No unnecessary re-renders or console warnings
- [ ] Pages load without visible layout shift

---

## 3. FIX

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| | | | |

Severity: **Critical** (blocks usage) / **High** (major UX break) / **Medium** (noticeable but workaround exists) / **Low** (minor polish)

All Critical and High issues must be resolved before deploy.

---

## 4. DEPLOY
- [ ] All Critical/High issues resolved
- [ ] Final responsive check on production URL
- [ ] Verify env vars are set in Vercel
- [ ] Deploy hook triggered, build passes
- [ ] Smoke test on production: sign in → dashboard → key flow

---

## Key Rules
- Never skip security review
- Never skip responsive testing (320px → desktop)
- Document all issues found — even if deferred
- Fix Critical/High before shipping; Medium/Low can be deferred if noted above
