# Setup — Instagram feed for @lafeniceimmobiliarecinqueterre

The site (`index.html`) reads `data/feed.json`. A daily GitHub Action
(`.github/workflows/update-feed.yml`) calls the Instagram Graph API and
rewrites that file.

You need to do two things once: prepare the Instagram side and add two
GitHub secrets.

---

## 1. Prepare the Instagram account

(All of this is free.)

1. **Convert the Instagram account to Business or Creator**
   Instagram app → Settings → Account → "Switch to professional account".
2. **Link it to a Facebook Page**
   Either an existing Page or a new one — Pages are free.
3. (Optional) **Verify** that you can log in to the Facebook Page as an
   admin from the same account you'll use for the Developer App.

You can do all three steps on your phone.

---

## 2. Create the Facebook Developer App & get a token

> Easier on desktop. On mobile, open the browser and request the desktop
> site.

1. Go to <https://developers.facebook.com/apps> and **Create App**.
   - Use case: **Other** → App type: **Business**.
2. In the new app, **Add product → Instagram Graph API**.
3. Open the **Graph API Explorer**:
   <https://developers.facebook.com/tools/explorer/>
   - Select your app top-right.
   - "User or Page": pick the Facebook Page linked to the Instagram account.
   - Add permissions: `instagram_basic`, `pages_show_list`,
     `pages_read_engagement`, `business_management`.
   - Click **Generate Access Token** and approve in the popup.
4. **Exchange for a long-lived token** (60 days) so it doesn't expire fast.
   In the same explorer, run this GET request (replace the placeholders
   with your app ID, app secret, and the short token you just got):

   ```
   GET /oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &fb_exchange_token={SHORT_LIVED_TOKEN}
   ```

   Copy the `access_token` from the response — that's your
   **`IG_ACCESS_TOKEN`**.

5. **Find your Instagram Business Account ID.** In the Explorer run:

   ```
   GET /me/accounts
   ```

   Copy the `id` of the Page that owns the Instagram account, then run:

   ```
   GET /{PAGE_ID}?fields=instagram_business_account
   ```

   The returned `instagram_business_account.id` is your
   **`IG_USER_ID`**.

---

## 3. Add the secrets to GitHub

On the repo: **Settings → Secrets and variables → Actions → New
repository secret**. Add two secrets:

| Name              | Value                                  |
| ----------------- | -------------------------------------- |
| `IG_USER_ID`      | the numeric Instagram Business account ID |
| `IG_ACCESS_TOKEN` | the long-lived access token               |

---

## 4. Trigger the first run

- **Actions** tab → **Update Instagram feed** → **Run workflow**.
- After ~30 seconds, `data/feed.json` will be updated and the site will
  show the latest posts.
- After that the workflow runs every day at 06:00 UTC.

---

## Hosting the page

Enable **GitHub Pages**: Settings → Pages → Source: `main` branch, root
folder. The site will be served at
`https://<your-user>.github.io/<repo>/`.

---

## Token renewal

Long-lived tokens last ~60 days but auto-refresh as long as the workflow
uses them at least once every 60 days — which the daily cron handles. If
the token ever expires, repeat step 2.4 and update the `IG_ACCESS_TOKEN`
secret.
