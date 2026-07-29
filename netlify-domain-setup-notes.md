# Joe's Nithilam — Hosting & Domain Setup Notes

## Background

- Domain `joesnithilam.com` was registered on **BigRock** (login: Jude Sunil).
  Under Orders you also have `joesnithilam.info` and an unused Titan email
  trial — no separate hosting plan exists on BigRock, just domains.
- Originally the domain's nameservers pointed at Netlify's own DNS
  (`dns1-4.p08.nsone.net`), tied to an **old Netlify account** with no
  recoverable login. Netlify support would be needed to release it
  (via a `verified-for-netlify` TXT record + support ticket) — this path
  was abandoned in favor of a simpler host.
- **Final decision: moved off Netlify entirely, now hosted on GitHub Pages.**

## Current hosting: GitHub Pages

- Repo: `https://github.com/majalajamessnkmdr-web/joesnithilam`
- Branch: `main`, folder: `/ (root)`
- Free GitHub Pages URL: `https://majalajamessnkmdr-web.github.io/joesnithilam/`
- Custom domain configured in repo Settings → Pages: `joesnithilam.com`

## How to update the site going forward

The project folder on this machine (`d:\Projects\Nithilam\joe's`) is a git
repo with `origin` set to the GitHub repo above. To publish changes:

```
git add -A
git commit -m "describe the change"
git push
```

GitHub Pages redeploys automatically within a minute or two of any push to
`main`. (In practice: just ask Claude to make the change and push — no
manual steps needed.)

## DNS records at BigRock (final, working config)

Nameservers: BigRock defaults — `dns1.bigrock.in` … `dns4.bigrock.in`
(switched away from Netlify's `nsone.net` ones early on; no need to touch
again).

At `myorders.bigrock.in/orders/manage/joesnithilam.com/domain` → **DNS Records**:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `majalajamessnkmdr-web.github.io` |

These 4 A records + 1 CNAME are GitHub Pages' standard required records for
a custom apex domain — they won't need to change unless GitHub Pages is
ever swapped out for a different host.

DNS record changes take **4–6 hours** to fully propagate per BigRock; a
full nameserver change can take **24–72 hours** (already done and settled
by this point).

Check propagation anytime at:
`https://www.whatsmydns.net/#A/joesnithilam.com`

## HTTPS

GitHub automatically provisions a free SSL certificate (via Let's Encrypt)
for the custom domain once DNS resolves correctly. In repo **Settings →
Pages**, check the **"Enforce HTTPS"** checkbox once it becomes available
(it's grayed out until the cert is issued).

## Abandoned path (for reference only)

A separate Netlify project (`elegant-cranachan-db6244`, under Netlify team
`majalajames-snkmdr`) was deployed via drag-and-drop while troubleshooting
the domain issue. It's no longer in use for `joesnithilam.com` — safe to
ignore or delete from Netlify if desired.
