# Git Commit & Domain Re-check — Quick Reference

## 1. Committing and publishing site changes

The project folder (`d:\Projects\Nithilam\joe's`) is a git repo with
`origin` pointing at `https://github.com/majalajamessnkmdr-web/joesnithilam`.
Any push to `main` auto-deploys to GitHub Pages within a minute or two.

```bash
# 1. See what changed
git status

# 2. Stage the files you actually edited (avoid `git add -A` blindly)
git add index.html css/style.css js/script.js

# 3. Commit with a message describing the change
git commit -m "describe the change"

# 4. Get any remote changes first (GitHub sometimes commits directly,
#    e.g. when the CNAME file is touched via the Pages settings UI)
git pull

# 5. Push
git push
```

If `git push` is rejected ("fetch first"), it means something changed
on the remote since your last pull (commonly GitHub auto-committing a
`CNAME` file change when the custom domain is removed/re-added in
Settings → Pages). Run `git pull` (or `git fetch` + `git merge
origin/main`) to bring those changes in locally, resolve anything if
needed, then `git push` again.

## 2. Re-checking / re-issuing the domain SSL certificate

Use this if the site shows a certificate error (e.g. "invalid
certificate name", antivirus like Kaspersky blocking it, or browser
warnings) even though DNS looks correct. It forces GitHub to redo its
DNS check and reissue the Let's Encrypt certificate for the custom
domain.

1. Go to `https://github.com/majalajamessnkmdr-web/joesnithilam` →
   **Settings → Pages**.
2. Under **Custom domain**, click **Remove**.
3. Click **Save** — the field will be empty.
4. Wait about a minute.
5. Type `joesnithilam.com` back into the field and click **Save**
   again.
6. Refresh the page after a few minutes — it should show a green
   **"DNS check successful"** message instead of "DNS Check in
   Progress".
7. Once the DNS check passes, tick **Enforce HTTPS** (it's greyed out
   until the cert is ready — this can take anywhere from a few
   minutes up to ~24 hours, though it was quick last time).

### How to verify the fix worked

From a terminal with `openssl` available:

```bash
echo | openssl s_client -connect joesnithilam.com:443 -servername joesnithilam.com 2>/dev/null | openssl x509 -noout -subject -dates -ext subjectAltName
```

Look for:

```
subject=CN=joesnithilam.com
...
X509v3 Subject Alternative Name:
    DNS:joesnithilam.com, DNS:www.joesnithilam.com
```

If instead it shows `subject=CN=*.github.io`, the custom-domain
certificate hasn't been issued yet — repeat the remove/re-add steps
above and wait longer.

If the browser (or antivirus like Kaspersky) still blocks the site
after the certificate is confirmed correct via the command above, it's
just a local cache — restart the browser, or restart the antivirus's
web-protection service, or reboot the machine.
