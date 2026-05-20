"""Fetch the latest Instagram posts via the Graph API and write data/feed.json.

Requires two repository secrets exposed as env vars:
  - IG_USER_ID:      the Instagram Business/Creator account ID (numeric)
  - IG_ACCESS_TOKEN: a long-lived user access token with instagram_basic
                     (and pages_show_list / instagram_manage_insights as needed)

Run locally:
  IG_USER_ID=... IG_ACCESS_TOKEN=... python scripts/fetch_feed.py
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

GRAPH_API = "https://graph.facebook.com/v19.0"
FIELDS = (
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
)
LIMIT = 12
OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "feed.json"


def fetch(url: str) -> dict:
    req = Request(url, headers={"User-Agent": "lafenice-feed/1.0"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    user_id = os.environ.get("IG_USER_ID")
    token = os.environ.get("IG_ACCESS_TOKEN")
    if not user_id or not token:
        print("IG_USER_ID and IG_ACCESS_TOKEN are required", file=sys.stderr)
        return 1

    query = urlencode({"fields": FIELDS, "limit": LIMIT, "access_token": token})
    url = f"{GRAPH_API}/{user_id}/media?{query}"
    data = fetch(url)

    if "error" in data:
        print(f"Graph API error: {data['error']}", file=sys.stderr)
        return 2

    posts = data.get("data", [])
    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "username": "lafeniceimmobiliarecinqueterre",
        "posts": posts,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(posts)} posts to {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
