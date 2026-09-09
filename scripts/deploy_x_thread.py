"""
scripts/deploy_x_thread.py
Deploys the corrected Z-WBE Flagship 10am Twitter/X thread drafts to Buffer via GraphQL API.
Handles X channel lock detection, attempts direct Twitter thread creation via createPost,
manages organization content item drafts with video assets, and updates buffer_deployed_posts.json.
"""

import urllib.request
import ssl
import json
import uuid
import os
import sys
from datetime import datetime, timezone

sys.stdout.reconfigure(encoding='utf-8')

TOKEN = "vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9"
ENDPOINT = "https://api.buffer.com"
ORG_ID = "69b906e3a76f6a37fede985b"
X_CH = "69faecd95c4c051afa1628b6"
LINKEDIN_CH = "6a4e1a1c404834462881bed6"
RAW_GITHUB_BASE = "https://raw.githubusercontent.com/zrt219/Z-WBE-Bottleneck-Lab/main"

# Scheduled for today 10:00 AM MDT (Mountain Daylight Time, UTC-6)
TARGET_DATE = "2026-09-09T16:00:00.000Z"

DEPLOYED_STATE_FILE = os.path.join(
    r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab\social-campaign",
    "buffer_deployed_posts.json"
)

ctx = ssl._create_unverified_context()

def query_buffer(query, variables=None):
    data = {"query": query}
    if variables:
        data["variables"] = variables
    encoded = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=encoded,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json"
        }
    )
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))

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

def inspect_channels():
    print("--- 1. Inspecting Buffer Channels ---")
    res = query_buffer("""
    query GetChannels($orgId: OrganizationId!) {
      channels(input: { organizationId: $orgId }) {
        id
        name
        service
        serviceId
        timezone
        isLocked
        allowedActions
      }
    }
    """, {"orgId": ORG_ID})
    channels = res.get("data", {}).get("channels", [])
    x_ch_info = None
    for ch in channels:
        status_str = "LOCKED" if ch.get("isLocked") else "UNLOCKED"
        print(f"Channel: {ch['service'].upper()} - {ch['name']} (ID: {ch['id']}) | Status: {status_str}")
        if ch["id"] == X_CH:
            x_ch_info = ch

    if x_ch_info and x_ch_info.get("isLocked"):
        print(f"\n[DIAGNOSTIC] Twitter/X channel '{x_ch_info['name']}' is currently LOCKED on Buffer.")
        print(f"Allowed actions: {x_ch_info.get('allowedActions')}")
        print("Direct channel publishing/scheduling requires account reauthorization on buffer.com.")
        print("Using Buffer Organization Content Item Drafts to deploy thread drafts directly to Buffer.\n")
    return x_ch_info

def attempt_direct_post(root_item, reply_items):
    """
    Attempts to create a threaded post directly on the X channel via createPost mutation.
    Uses Buffer's TwitterPostMetadataInput with ThreadedPostInput objects.
    """
    print("--- 2. Attempting Direct Thread Creation via Buffer createPost ---")
    mutation = """
    mutation CreateDirectThreadPost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post {
            id
            status
            dueAt
          }
        }
        ... on RestProxyError {
          code
          message
        }
        ... on UnauthorizedError {
          message
        }
        ... on InvalidInputError {
          message
        }
        ... on UnexpectedError {
          message
        }
      }
    }
    """
    thread_entries = []
    for r in reply_items:
        thread_entries.append({
            "text": r["text"],
            "assets": r.get("assets", [])
        })

    variables = {
        "input": {
            "channelId": X_CH,
            "schedulingType": "notification",
            "mode": "addToQueue",
            "needsApproval": False,
            "saveToDraft": True,
            "text": root_item["text"],
            "assets": root_item.get("assets", []),
            "metadata": {
                "twitter": {
                    "thread": thread_entries
                }
            }
        }
    }
    res = query_buffer(mutation, variables)
    data = res.get("data", {}).get("createPost", {})
    if "post" in data and data["post"]:
        print(f"[DIRECT POST SUCCESS] Post ID: {data['post']['id']} | Status: {data['post']['status']}")
        return data["post"]["id"], None
    else:
        err_msg = data.get("message") or res.get("errors") or "Channel locked or forbidden"
        print(f"[DIRECT POST DIAGNOSTIC] Buffer returned: '{err_msg}'.")
        print("As expected, channel lock prevents direct creation. Proceeding with Organization Drafts.\n")
        return None, err_msg

def update_or_create_content_draft(existing_id, title, text, assets=None, target_date=TARGET_DATE):
    draft_assets = assets if assets else []

    if existing_id:
        update_mutation = """
        mutation UpdateCampaignDraft($input: UpdateContentItemDraftInput!) {
          updateContentItemDraft(input: $input) {
            ... on UpdateContentItemDraftSuccess {
              contentItem {
                id
                title
                targetDate
              }
            }
            ... on UpdateContentItemDraftFailure {
              message
            }
          }
        }
        """
        variables = {
            "input": {
                "id": existing_id,
                "targetDate": target_date,
                "draft": {
                    "text": text,
                    "aiAssisted": False,
                    "assets": draft_assets
                }
            }
        }
        res = query_buffer(update_mutation, variables)
        data = res.get("data", {}).get("updateContentItemDraft", {})
        if "contentItem" in data and data["contentItem"]:
            return data["contentItem"]["id"], None

    # Fallback to create if update failed or no existing ID
    create_mutation = """
    mutation CreateCampaignDraft($input: CreateContentItemDraftInput!) {
      createContentItemDraft(input: $input) {
        ... on CreateContentItemDraftSuccess {
          contentItem {
            id
            title
            createdAt
          }
        }
        ... on CreateContentItemDraftFailure {
          message
        }
      }
    }
    """
    variables = {
        "input": {
            "organizationId": ORG_ID,
            "title": title,
            "correlationId": str(uuid.uuid4()),
            "targetDate": target_date,
            "draft": {
                "text": text,
                "aiAssisted": False,
                "assets": draft_assets
            }
        }
    }
    res = query_buffer(create_mutation, variables)
    data = res.get("data", {}).get("createContentItemDraft", {})
    if "contentItem" in data and data["contentItem"]:
        return data["contentItem"]["id"], None
    else:
        err = data.get("message") or res.get("errors") or "Unknown error"
        return None, err

def deploy_thread():
    x_info = inspect_channels()
    state = load_deployed_state()

    video_url = f"{RAW_GITHUB_BASE}/master-launch-post/02_hero_bottleneck_shift.mp4"
    video_asset = [{"video": {"url": video_url}}]

    root_post_item = {
        "key": "buffer_x_d01_p1_root",
        "existing_id": "6aa1a52ad158a3222b7a07da",
        "title": "Z-WBE Signature Post (10:00 AM MDT): What Breaks First in WBE?",
        "slot": "Root Signature Post",
        "media_desc": "02_hero_bottleneck_shift.mp4 (30s signature bottleneck shift demo)",
        "assets": video_asset,
        "text": (
            "What breaks first in whole-brain emulation?\n\n"
            "I built Z-WBE Bottleneck Lab for the @googlecloud x @NVIDIAAI GTC Challenge.\n\n"
            "Signature experiment: 100x imaging speedup collapses acquisition and exposes the memory wall.\n\n"
            "cc @googlecloud @GoogleDevs @NVIDIAAI @asierarranz #NVIDIAGTC"
        )
    }

    reply_items = [
        {
            "key": "buffer_x_d01_p1_reply1",
            "existing_id": "6aa1a52a11252a6cf169e72c",
            "title": "Z-WBE X Thread - Reply 1: Deterministic Engine vs AI Interpretation",
            "slot": "Reply 1",
            "media_desc": "GitHub repository reference",
            "assets": [],
            "text": (
                "> Z-WBE separates deterministic calculations from AI interpretation.\n\n"
                "12 scaling equations calculate the scenario values. NVIDIA Nemotron 3 Super explains the resulting trade-offs without changing those values.\n\n"
                "GitHub: https://github.com/zrt219/Z-WBE-Bottleneck-Lab\n\n"
                "@asierarranz @NVIDIAAI"
            )
        },
        {
            "key": "buffer_x_d01_p1_reply2",
            "existing_id": "6aa1a52bd158a3222b7a07e3",
            "title": "Z-WBE X Thread - Reply 2: NVIDIA Tesla T4 8.62x Speedup in Google Colab",
            "slot": "Reply 2",
            "media_desc": "Google Colab notebook with RAPIDS cuDF evidence",
            "assets": [],
            "text": (
                "> I also tested the research workflow on an NVIDIA Tesla T4 in Google Colab.\n\n"
                "CPU: 1.907 s\n"
                "GPU: 0.221 s\n"
                "Speedup: 8.62×\n\n"
                "RAPIDS cudf.pandas accelerated supported operations.\n\n"
                "Colab: https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb\n\n"
                "@NVIDIAAI @googlecloud"
            )
        },
        {
            "key": "buffer_x_d01_p1_reply3",
            "existing_id": "6aa1a52b15d60598e551fb09",
            "title": "Z-WBE X Thread - Reply 3: 100,000 BigQuery Sandbox Scenarios",
            "slot": "Reply 3",
            "media_desc": "BigQuery Sandbox + Vercel Live App",
            "assets": [],
            "text": (
                "> For the larger parameter study, I generated 100,000 deterministic Z-WBE scenarios and stored them in Google BigQuery Sandbox.\n\n"
                "GoogleSQL analyzes which engineering constraint becomes dominant under different assumptions.\n\n"
                "Live: https://z-wbe-bottleneck-lab.vercel.app\n\n"
                "@googlecloud @GoogleDevs"
            )
        },
        {
            "key": "buffer_x_d01_p1_reply4",
            "existing_id": "6aa1a52b17610ce63803e5ce",
            "title": "Z-WBE X Thread - Reply 4: Core Systems Engineering Conclusion",
            "slot": "Reply 4",
            "media_desc": "Challenge summary & contest entry closing",
            "assets": [],
            "text": (
                "> The main idea is simple:\n\n"
                "Whole-Brain Emulation is not one engineering problem.\n\n"
                "Solve one bottleneck, and another can become the limiting factor.\n\n"
                "That is what Z-WBE is built to explore.\n\n"
                "@asierarranz @googlecloud\n"
                "#NVIDIAGTC"
            )
        },
        {
            "key": "buffer_x_d01_p1_live_fix",
            "existing_id": "6aa1a52b64ff2af5dcf93aa1",
            "title": "Z-WBE X Thread - Live Fix Reply: Golden Ticket Challenge & Judge Tag",
            "slot": "Live Thread Fix Reply",
            "media_desc": "Official contest entry verification reply",
            "assets": [],
            "text": (
                "> Built for the Google Cloud × NVIDIA GTC Berlin Golden Ticket Challenge.\n\n"
                "Thanks @asierarranz for pushing builders to show something real working.\n\n"
                "@googlecloud @GoogleDevs @NVIDIAAI\n"
                "#NVIDIAGTC"
            )
        },
        {
            "key": "buffer_x_d01_p1_full_thread",
            "existing_id": "6aa1a52c11252a6cf169e736",
            "title": "Z-WBE Flagship Complete Corrected Thread (Root + 4 Replies + Live Fix)",
            "slot": "Full Thread Master Draft",
            "media_desc": "Complete sequential thread bundle with video asset",
            "assets": video_asset,
            "text": (
                "=== Z-WBE FLAGSHIP 10:00 AM MDT CORRECTED X THREAD ===\n\n"
                "[ROOT POST - WITH VIDEO]\n"
                "What breaks first in whole-brain emulation?\n\n"
                "I built Z-WBE Bottleneck Lab for the @googlecloud x @NVIDIAAI GTC Challenge.\n\n"
                "Signature experiment: 100x imaging speedup collapses acquisition and exposes the memory wall.\n\n"
                "cc @googlecloud @GoogleDevs @NVIDIAAI @asierarranz #NVIDIAGTC\n\n"
                "---\n[REPLY 1]\n"
                "> Z-WBE separates deterministic calculations from AI interpretation.\n\n"
                "12 scaling equations calculate the scenario values. NVIDIA Nemotron 3 Super explains the resulting trade-offs without changing those values.\n\n"
                "GitHub: https://github.com/zrt219/Z-WBE-Bottleneck-Lab\n\n"
                "@asierarranz @NVIDIAAI\n\n"
                "---\n[REPLY 2]\n"
                "> I also tested the research workflow on an NVIDIA Tesla T4 in Google Colab.\n\n"
                "CPU: 1.907 s\n"
                "GPU: 0.221 s\n"
                "Speedup: 8.62×\n\n"
                "RAPIDS cudf.pandas accelerated supported operations.\n\n"
                "Colab: https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb\n\n"
                "@NVIDIAAI @googlecloud\n\n"
                "---\n[REPLY 3]\n"
                "> For the larger parameter study, I generated 100,000 deterministic Z-WBE scenarios and stored them in Google BigQuery Sandbox.\n\n"
                "GoogleSQL analyzes which engineering constraint becomes dominant under different assumptions.\n\n"
                "Live: https://z-wbe-bottleneck-lab.vercel.app\n\n"
                "@googlecloud @GoogleDevs\n\n"
                "---\n[REPLY 4]\n"
                "> The main idea is simple:\n\n"
                "Whole-Brain Emulation is not one engineering problem.\n\n"
                "Solve one bottleneck, and another can become the limiting factor.\n\n"
                "That is what Z-WBE is built to explore.\n\n"
                "@asierarranz @googlecloud\n"
                "#NVIDIAGTC\n\n"
                "---\n[IF THREAD IS ALREADY LIVE - FINAL FIX REPLY]\n"
                "> Built for the Google Cloud × NVIDIA GTC Berlin Golden Ticket Challenge.\n\n"
                "Thanks @asierarranz for pushing builders to show something real working.\n\n"
                "@googlecloud @GoogleDevs @NVIDIAAI\n"
                "#NVIDIAGTC"
            )
        }
    ]

    # Attempt direct channel post (which validates thread input structure against Buffer API)
    attempt_direct_post(root_post_item, reply_items[:4])

    print("--- 3. Deploying / Updating Organization Content Item Drafts in Buffer ---")
    all_items = [root_post_item] + reply_items
    deployed_count = 0
    for item in all_items:
        key = item["key"]
        print(f"Deploying/Updating draft: '{item['title']}'...", end=" ")
        buf_id, err = update_or_create_content_draft(
            existing_id=item.get("existing_id"),
            title=item["title"],
            text=item["text"],
            assets=item["assets"],
            target_date=TARGET_DATE
        )
        if buf_id:
            print(f"SUCCESS -> Buffer Draft ID: {buf_id}")
            state[key] = {
                "buffer_id": buf_id,
                "status": "draft",
                "channel": "X (Twitter) Draft via Buffer Content Items",
                "channel_id": X_CH,
                "channel_status": "Channel isLocked in Buffer (requires OAuth reconnect)",
                "target_date": TARGET_DATE,
                "title": item["title"],
                "slot": item["slot"],
                "media": item["media_desc"],
                "text_snippet": item["text"][:120].replace("\n", " "),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            deployed_count += 1
        else:
            print(f"FAILED: {err}")

    # Primary key buffer_x_d01_p1 maps to the root post with thread references
    state["buffer_x_d01_p1"] = {
        "buffer_id": root_post_item["existing_id"],
        "status": "draft",
        "channel": "X (Twitter)",
        "channel_id": X_CH,
        "channel_status": "Channel isLocked in Buffer (requires OAuth reconnect)",
        "target_date": TARGET_DATE,
        "title": "Z-WBE Flagship Signature Launch (10:00 AM MDT): Root Post + 4-Part Thread",
        "slot": "Morning Hook & Flagship Signature Launch",
        "media": "master-launch-post/02_hero_bottleneck_shift.mp4 (30s signature bottleneck shift demo)",
        "thread_drafts": {
            "root": root_post_item["existing_id"],
            "reply1": reply_items[0]["existing_id"],
            "reply2": reply_items[1]["existing_id"],
            "reply3": reply_items[2]["existing_id"],
            "reply4": reply_items[3]["existing_id"],
            "live_fix": reply_items[4]["existing_id"],
            "full_thread_bundle": reply_items[5]["existing_id"]
        },
        "text_snippet": root_post_item["text"][:120].replace("\n", " "),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    save_deployed_state(state)
    print(f"\n--- 4. Deployment Complete ---")
    print(f"Successfully verified/updated {deployed_count} thread drafts in Buffer with targetDate: {TARGET_DATE}.")
    print(f"Primary key 'buffer_x_d01_p1' successfully linked to root draft {root_post_item['existing_id']}.")

if __name__ == "__main__":
    deploy_thread()
