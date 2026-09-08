import urllib.request
import ssl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

TOKEN = "vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9"
ENDPOINT = "https://api.buffer.com"
ORG_ID = "69b906e3a76f6a37fede985b"
LINKEDIN_CH = "6a4e1a1c404834462881bed6"
X_CH = "69faecd95c4c051afa1628b6"

def query_buffer(query, variables=None):
    ctx = ssl._create_unverified_context()
    data = {"query": query}
    if variables:
        data["variables"] = variables
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return {"http_error": e.code, "body": e.read().decode("utf-8")}

# 1. Inspect all 11 drafts on LinkedIn
drafts_res = query_buffer("""
query GetDrafts($orgId: OrganizationId!, $channelId: ChannelId!) {
  posts(input: { organizationId: $orgId, filter: { channelIds: [$channelId], status: [draft] } }, first: 50) {
    edges {
      node {
        id
        text
        status
        dueAt
        createdAt
      }
    }
  }
}
""", {"orgId": ORG_ID, "channelId": LINKEDIN_CH})

print("=== ALL LINKEDIN DRAFTS ===")
for i, edge in enumerate(drafts_res.get("data", {}).get("posts", {}).get("edges", []), 1):
    n = edge["node"]
    print(f"[{i}] ID: {n['id']} | Due: {n.get('dueAt')} | Created: {n.get('createdAt')}")
    print(f"    Text snippet: {repr(n['text'][:100])}\n")

# 2. Inspect Channel details and permissions
channels_detail = query_buffer("""
query GetChannelDetails($organizationId: OrganizationId!) {
  channels(input: { organizationId: $organizationId }) {
    id
    name
    service
    serviceId
    timezone
  }
  account {
    id
    name
    email
  }
}
""", {"organizationId": ORG_ID})
print("=== ACCOUNT & CHANNELS DETAIL ===")
print(json.dumps(channels_detail, indent=2))
