# Joe's Nithilam — Netlify + Domain Setup Notes

## Background

- Domain `joesnithilam.com` was registered on **BigRock** (login: Jude Sunil).
- The domain's nameservers were originally pointed at Netlify's own DNS
  (`dns1-4.p08.nsone.net`), which tied it to an **old Netlify account** we no
  longer have login access to (login email unknown — several recovery
  attempts didn't find it).
- Solution: stop using Netlify-managed DNS, and instead manage DNS records
  directly at BigRock, pointing to a **new** Netlify project deployed under
  the current, working Netlify account (`majalajames-snkmdr`).

## Current working Netlify project

- Project name: **elegant-cranachan-db6244**
- Default URL: `https://elegant-cranachan-db6244.netlify.app`
- Dashboard: `https://app.netlify.com/projects/elegant-cranachan-db6244`
- Deployed via **drag-and-drop** (Netlify Drop) — not connected to Git.

## Step 1 — Deploy / update the site

1. Go to the project's **Deploys** page:
   `https://app.netlify.com/projects/elegant-cranachan-db6244/deploys`
2. Drag and drop the whole project folder (must include `index.html`,
   `images/`, `css/` — not just the HTML file) into the
   "Drag and drop your project folder here to deploy new changes" box.
3. Netlify publishes automatically to the same URL. That's the entire
   update process going forward — repeat this step any time the site
   changes locally.

## Step 2 — Fix the domain's DNS (one-time)

### 2a. Revert nameservers at BigRock

1. Go to `myorders.bigrock.in/orders/manage/joesnithilam.com/domain`
2. Click **Name Servers**
3. Change from the old `dns1-4.p08.nsone.net` (Netlify-managed) to BigRock's
   own defaults:
   - `dns1.bigrock.in`
   - `dns2.bigrock.in`
   - `dns3.bigrock.in`
   - `dns4.bigrock.in`
4. Save. (BigRock warns this can take **24–72 hours** to propagate.)

### 2b. Add DNS records at BigRock

Still on the domain management page, click **DNS Records**, then:

- **A record**
  - Host: `@`
  - Value: `75.2.60.5`
- **CNAME record**
  - Host: `www`
  - Value: `elegant-cranachan-db6244.netlify.app`

(BigRock notes these can take **4–6 hours** to come into effect, on top of
the nameserver propagation above.)

### 2c. Check propagation status

Use `https://www.whatsmydns.net/#NS/joesnithilam.com` to check when most/all
global DNS resolvers show the new `dns1-4.bigrock.in` nameservers (green
checkmarks) instead of the old `nsone.net` ones.

## Step 3 — Connect the domain in Netlify

1. Go to the project's **Domain management** page:
   `https://app.netlify.com/projects/elegant-cranachan-db6244/domain-management`
2. Click **Add a domain** → **Add a domain you already own**
3. Enter `joesnithilam.com` and confirm.
   - ⚠️ If DNS hasn't finished propagating yet, this will fail with:
     *"joesnithilam.com or one of its subdomains is already managed by
     Netlify DNS on another team."*
   - This is expected until propagation finishes — just wait and retry
     later (check whatsmydns.net first).
4. Once accepted, Netlify will also prompt to add `www.joesnithilam.com` —
   add that too.
5. Netlify automatically provisions a free HTTPS/SSL certificate (via
   Let's Encrypt) once it verifies the domain — this can take up to an
   hour after DNS resolves correctly.

## Quick reference — key values

| Item | Value |
|---|---|
| Domain registrar | BigRock (`myorders.bigrock.in`) |
| Domain | `joesnithilam.com` |
| New Netlify project | `elegant-cranachan-db6244` |
| Netlify subdomain | `elegant-cranachan-db6244.netlify.app` |
| A record (`@`) | `75.2.60.5` |
| CNAME record (`www`) | `elegant-cranachan-db6244.netlify.app` |
| BigRock default nameservers | `dns1.bigrock.in` … `dns4.bigrock.in` |
| Old (Netlify-managed) nameservers | `dns1.p08.nsone.net` … `dns4.p08.nsone.net` |
