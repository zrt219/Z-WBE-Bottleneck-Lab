"""
scripts/deploy_buffer_campaign.py
Production-grade deployment engine for Z-WBE 21-Day Launch Sprint to Buffer.
Supports rate-limit tracking, automatic backoff, state persistence, and file reconciliation.
"""

import urllib.request
import ssl
import json
import time
import os
import sys
import re
from datetime import datetime, timedelta, timezone

sys.stdout.reconfigure(encoding='utf-8')

# Ensure scripts directory in path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.append(SCRIPT_DIR)

from campaign_week1 import get_week1_data
from campaign_week2 import get_week2_data
from campaign_week3 import get_week3_data
import compile_campaign

TOKEN = "vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9"
ENDPOINT = "https://api.buffer.com"
ORG_ID = "69b906e3a76f6a37fede985b"
LINKEDIN_CH = "6a4e1a1c404834462881bed6"
X_CH = "69faecd95c4c051afa1628b6"
RAW_GITHUB_BASE = "https://raw.githubusercontent.com/zrt219/Z-WBE-Bottleneck-Lab/main"

DEPLOYED_STATE_FILE = os.path.join(r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab\social-campaign", "buffer_deployed_posts.json")

ctx = ssl._create_unverified_context()

def parse_rate_limit_headers(headers):
    # e.g. ratelimit: "100-in-15min"; r=65; t=643
    result = {}
    vals = []
    if hasattr(headers, "get_all"):
        for h_name in ["ratelimit", "ratelimit-policy", "x-ratelimit-reset"]:
            found = headers.get_all(h_name)
            if found:
                vals.extend(found)
    if hasattr(headers, "items"):
        for k, v in headers.items():
            if "ratelimit" in k.lower():
                vals.append(v)
    for v in vals:
        if "-in-15min" in v:
            m_r = re.search(r'r=(\d+)', v)
            m_t = re.search(r't=(\d+)', v)
            if m_r: result['r_15m'] = int(m_r.group(1))
            if m_t: result['t_15m'] = int(m_t.group(1))
        elif "-in-1day" in v:
            m_r = re.search(r'r=(\d+)', v)
            m_t = re.search(r't=(\d+)', v)
            if m_r: result['r_1d'] = int(m_r.group(1))
            if m_t: result['t_1d'] = int(m_t.group(1))
    return result

def query_buffer(query, variables=None, retries=5):
    data = {"query": query}
    if variables:
        data["variables"] = variables
    encoded = json.dumps(data).encode("utf-8")

    for attempt in range(retries):
        req = urllib.request.Request(
            ENDPOINT,
            data=encoded,
            headers={
                "Authorization": f"Bearer {TOKEN}",
                "Content-Type": "application/json"
            }
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                headers = resp.headers
                limits = parse_rate_limit_headers(headers)
                body = json.loads(resp.read().decode("utf-8"))
                return body, limits
        except urllib.error.HTTPError as e:
            if e.code == 429:
                retry_after = 60
                if "Retry-After" in e.headers:
                    try:
                        retry_after = int(e.headers["Retry-After"])
                    except Exception:
                        pass
                limits = parse_rate_limit_headers(e.headers)
                t_15m = limits.get('t_15m', retry_after)
                if retry_after > 300 or limits.get('r_1d') == 0:
                    print(f"[RateLimit 429] 24-hour quota exhausted (Retry-After: {retry_after}s / ~{retry_after//3600}h). Stopping deployment.")
                    return {"http_error": 429, "error": "24-hour rate limit exceeded"}, limits
                wait_sec = max(retry_after, t_15m) + 3
                print(f"[RateLimit 429] Buffer 15m window active. Sleeping {wait_sec}s until reset... (attempt {attempt+1}/{retries})")
                time.sleep(wait_sec)
                continue
            err_body = e.read().decode("utf-8")
            print(f"[HTTP {e.code}] Error: {err_body}")
            return {"http_error": e.code, "error": err_body}, {}
        except Exception as e:
            print(f"[Network Exception] {e}")
            if attempt < retries - 1:
                time.sleep(3)
                continue
            return {"exception": str(e)}, {}
    return {"error": "Exceeded max retries"}, {}

def parse_mdt_to_utc_iso(date_str, time_str):
    t_clean = time_str.replace("MDT", "").strip()
    dt = datetime.strptime(f"{date_str} {t_clean}", "%Y-%m-%d %H:%M")
    tz_mdt = timezone(timedelta(hours=-6))
    dt_mdt = dt.replace(tzinfo=tz_mdt)
    dt_utc = dt_mdt.astimezone(timezone.utc)
    return dt_utc.strftime("%Y-%m-%dT%H:%M:%S.000Z")

def format_assets(media):
    m_list = media if isinstance(media, list) else [media]
    assets = []
    for m in m_list:
        m_norm = m.replace('\\', '/')
        url = f"{RAW_GITHUB_BASE}/{m_norm}"
        if m.lower().endswith(".mp4"):
            assets.append({"video": {"url": url}})
        else:
            assets.append({"image": {"url": url}})
    return assets

def load_deployed_state():
    if os.path.exists(DEPLOYED_STATE_FILE):
        try:
            with open(DEPLOYED_STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_deployed_state(state):
    with open(DEPLOYED_STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

def deploy_posts():
    print("=== Starting Z-WBE Buffer Deployment Engine ===")
    state = load_deployed_state()
    print(f"Loaded existing deployed state: {len(state)} posts recorded.")

    # 1. Verify channels
    res, limits = query_buffer("""
    query GetChannels($orgId: OrganizationId!) {
      channels(input: { organizationId: $orgId }) {
        id
        name
        service
        isLocked
        allowedActions
      }
    }
    """, {"orgId": ORG_ID})

    channels = res.get("data", {}).get("channels", [])
    print(f"Verified {len(channels)} Buffer channels:")
    li_channel = None
    x_channel = None
    for ch in channels:
        print(f"  - {ch['service'].upper()}: {ch['name']} (ID: {ch['id']}) | Locked: {ch['isLocked']}")
        if ch['id'] == LINKEDIN_CH:
            li_channel = ch
        elif ch['id'] == X_CH:
            x_channel = ch

    if not li_channel or li_channel.get("isLocked"):
        print("ERROR: LinkedIn channel is missing or locked!")
        return

    if x_channel and x_channel.get("isLocked"):
        print("[INFO] Channel X (Twitter) is currently locked on Buffer (isLocked=true).")
        print("       All X posts will be recorded as BLOCKED pending channel unlock in Buffer.")

    # 2. Gather campaign data
    all_days = get_week1_data() + get_week2_data() + get_week3_data()
    all_linkedin_posts = []
    for d in all_days:
        for p in d['linkedin']:
            p_copy = dict(p)
            p_copy['date'] = d['date']
            all_linkedin_posts.append(p_copy)

    print(f"Total LinkedIn campaign posts to manage: {len(all_linkedin_posts)}")

    create_mutation = """
    mutation CreateCampaignDraft($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post {
            id
            status
            dueAt
          }
        }
        ... on MutationError {
          message
        }
      }
    }
    """

    created_count = 0
    skipped_count = 0

    for idx, p in enumerate(all_linkedin_posts, 1):
        pid = p['id']
        if pid in state and state[pid].get("buffer_id"):
            skipped_count += 1
            continue

        # Check rate limits before making call
        if limits:
            r_1d = limits.get('r_1d', 999)
            r_15m = limits.get('r_15m', 999)
            t_15m = limits.get('t_15m', 0)

            if r_1d <= 4:
                print(f"[QUOTA REACHED] 24-hour request limit approaching (r_1d={r_1d}). Pausing deployment to preserve query headroom.")
                break
            if r_15m <= 2:
                wait_sec = t_15m + 5
                print(f"[15-MIN THROTTLE] r_15m={r_15m}. Sleeping for {wait_sec}s...")
                time.sleep(wait_sec)

        due_iso = parse_mdt_to_utc_iso(p['date'], p['time'])
        assets = format_assets(p['media'])

        variables = {
            "input": {
                "channelId": LINKEDIN_CH,
                "text": p['text'],
                "schedulingType": "automatic",
                "mode": "customScheduled",
                "dueAt": due_iso,
                "saveToDraft": True,
                "assets": assets
            }
        }

        print(f"[{idx}/{len(all_linkedin_posts)}] Creating draft for {pid} ({p['date']} {p['time']})...", end=" ")
        res, limits = query_buffer(create_mutation, variables)

        post_data = res.get("data", {}).get("createPost", {})
        if "post" in post_data and post_data["post"]:
            b_id = post_data["post"]["id"]
            b_status = post_data["post"]["status"]
            state[pid] = {
                "buffer_id": b_id,
                "status": b_status,
                "dueAt": due_iso,
                "channelId": LINKEDIN_CH,
                "platform": "LinkedIn",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            save_deployed_state(state)
            created_count += 1
            print(f"SUCCESS -> Buffer ID: {b_id} (r_1d: {limits.get('r_1d')}, r_15m: {limits.get('r_15m')})")
        else:
            err_msg = post_data.get("message") or res.get("error") or res.get("errors") or res
            print(f"FAILED: {err_msg}")
            # If rate limit exceeded, break
            if "rate limit" in str(err_msg).lower() or res.get("http_error") == 429:
                break

        # Polite sleep between requests
        time.sleep(1.0)

    print(f"\n=== Deployment Run Completed ===")
    print(f"Created in this run: {created_count}")
    print(f"Previously created: {skipped_count}")
    print(f"Total deployed drafts in state: {len(state)}")

    print("\nRecompiling campaign calendar and day files with newly deployed IDs...")
    compile_campaign.main()
    print("Compilation complete.")

    return state

if __name__ == "__main__":
    deploy_posts()
