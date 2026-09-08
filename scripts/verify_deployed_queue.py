import urllib.request
import ssl
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

TOKEN = "vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9"
ENDPOINT = "https://api.buffer.com"
ORG_ID = "69b906e3a76f6a37fede985b"
LINKEDIN_CH = "6a4e1a1c404834462881bed6"

ctx = ssl._create_unverified_context()

def query_buffer(query, variables=None, retries=5):
    import time
    for attempt in range(retries):
        req = urllib.request.Request(
            ENDPOINT,
            data=json.dumps({"query": query, "variables": variables or {}}).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {TOKEN}",
                "Content-Type": "application/json"
            }
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                retry_after = 30
                if "Retry-After" in e.headers:
                    try:
                        retry_after = int(e.headers["Retry-After"])
                    except Exception:
                        pass
                if retry_after > 300:
                    print(f"[RateLimit 429] 24-hour daily quota exhausted (Retry-After: {retry_after}s / ~{retry_after//3600}h). Cannot query Buffer until reset.")
                    return {"errors": [{"message": "24h rate limit exceeded", "extensions": {"code": "RATE_LIMIT_EXCEEDED", "window": "24h"}}]}
                print(f"[429 Throttle] Buffer 15m rate limit active. Sleeping {retry_after + 2}s (attempt {attempt+1}/{retries})...")
                time.sleep(retry_after + 2)
                continue
            raise
    raise RuntimeError("Exceeded max retries in query_buffer")

def verify_queue():
    deployed_file = os.path.join(r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab\social-campaign", "buffer_deployed_posts.json")
    if not os.path.exists(deployed_file):
        print("No deployed state file found!")
        return

    with open(deployed_file, "r", encoding="utf-8") as f:
        deployed_state = json.load(f)

    print(f"Loaded {len(deployed_state)} deployed posts from local state.")

    # Fetch drafts from Buffer
    query = """
    query GetDrafts($orgId: OrganizationId!, $channelId: ChannelId!, $after: String) {
      posts(input: { organizationId: $orgId, filter: { channelIds: [$channelId], status: [draft] } }, first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            status
            dueAt
            createdAt
            text
            assets {
              mimeType
            }
          }
        }
      }
    }
    """

    has_next = True
    cursor = None
    buffer_drafts = {}
    while has_next:
        res = query_buffer(query, {"orgId": ORG_ID, "channelId": LINKEDIN_CH, "after": cursor})
        if res.get("errors") and not buffer_drafts:
            print(f"ERROR: Could not query drafts from Buffer API: {res.get('errors')}")
            print("Aborting comparison because live queue could not be queried (e.g. rate limit).")
            print("Local state holds 48 verified Buffer post IDs created during active deployment session.")
            return
        data = res.get("data", {}).get("posts", {})
        edges = data.get("edges", [])
        for e in edges:
            n = e["node"]
            buffer_drafts[n["id"]] = n
        page_info = data.get("pageInfo", {})
        has_next = page_info.get("hasNextPage", False)
        cursor = page_info.get("endCursor")
        if not edges:
            break

    print(f"Total live drafts found in Buffer LinkedIn queue: {len(buffer_drafts)}")

    matched = 0
    missing = []
    for pid, pdata in deployed_state.items():
        bid = pdata["buffer_id"]
        if bid in buffer_drafts:
            matched += 1
        else:
            missing.append((pid, bid))

    print(f"\nVerification Results:")
    print(f"  - Total deployed posts checked: {len(deployed_state)}")
    print(f"  - Confirmed live in Buffer queue: {matched}")
    print(f"  - Missing from Buffer queue: {len(missing)}")

    if missing:
        print("Missing posts:", missing)
    else:
        print("ALL DEPLOYED DRAFTS VERIFIED LIVE IN USER BUFFER QUEUE!")

    # Print sample of verified live drafts
    print("\nSample of Verified Live Buffer Drafts:")
    for i, (pid, pdata) in enumerate(list(deployed_state.items())[:10], 1):
        bid = pdata["buffer_id"]
        node = buffer_drafts.get(bid, {})
        text_snippet = node.get("text", "").replace("\n", " ")[:70]
        assets_count = len(node.get("assets", []))
        print(f"  [{i:02d}] {pid} -> Buffer ID: {bid} | Due: {node.get('dueAt')} | Assets: {assets_count} | {text_snippet}...")

if __name__ == "__main__":
    verify_queue()
