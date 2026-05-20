# La Fenice Immobiliare Cinque Terre — Instagram feed

A small static site that displays the latest Instagram posts of
[@lafeniceimmobiliarecinqueterre](https://www.instagram.com/lafeniceimmobiliarecinqueterre).
A GitHub Action refreshes the feed once a day via the Instagram Graph
API.

## Files

| Path                                | Purpose                                  |
| ----------------------------------- | ---------------------------------------- |
| `index.html`, `styles.css`, `app.js` | The page rendered to visitors            |
| `data/feed.json`                     | Cached Instagram posts (committed daily) |
| `scripts/fetch_feed.py`              | Calls the Graph API, writes `feed.json`  |
| `.github/workflows/update-feed.yml`  | Daily cron + manual trigger              |
| `SETUP.md`                          | One-time setup guide (do this first)     |

## Quick start

1. Follow [`SETUP.md`](SETUP.md) to add `IG_USER_ID` and `IG_ACCESS_TOKEN`
   secrets to the repo.
2. Run the **Update Instagram feed** workflow manually from the Actions
   tab to populate `data/feed.json`.
3. Enable GitHub Pages (Settings → Pages → Branch: `main`, root).

Until the first workflow run, the page will show a placeholder.
