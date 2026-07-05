# Deploy

## Vercel (production)

This site is deployed on Vercel:

- **Production URL**: https://xbt.llc (custom domain)
- **GitHub repo**: https://github.com/mdelias/xbt.llc
- **Production branch**: `main`
- Auto-deploys on every push to `main`; PRs get preview deployments.

### Local development

```bash
npm run dev     # development server
npm run build   # production build
npm start       # serve production build locally
```

### Environment variables (set in Vercel dashboard)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Plausible analytics domain (set to `xbt.llc` to enable)

## CI/CD

- `.github/workflows/ci.yml` runs `npm run lint && npm run build` on every push/PR.
- Vercel auto-detects `main` as the production branch.

## Verification

- **Build**: `npm run build` (all pages static except `/api/contact`)
- **Local server**: `npm start -- --port 3456` then visit http://localhost:3456
- **Live URL**: https://xbt.llc
- **Site status**: Run `curl -sI https://xbt.llc/ | head -5` to verify HTTP 200