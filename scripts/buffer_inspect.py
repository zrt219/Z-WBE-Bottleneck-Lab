import urllib.request
import ssl
import json

TOKEN = "vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9"
ENDPOINT = "https://api.buffer.com"

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
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read().decode("utf-8"))

if __name__ == "__main__":
    orgs_res = query_buffer("""
    query GetOrganizations {
      account {
        organizations {
          id
          name
        }
      }
    }
    """)
    print("Organizations:", json.dumps(orgs_res, indent=2))
    org_id = orgs_res["data"]["account"]["organizations"][0]["id"]

    channels_res = query_buffer("""
    query GetChannels($organizationId: OrganizationId!) {
      channels(input: { organizationId: $organizationId }) {
        id
        name
        service
        serviceId
        timezone
      }
    }
    """, {"organizationId": org_id})
    print("Channels:", json.dumps(channels_res, indent=2))

    posts_res = query_buffer("""
    query GetPosts($orgId: OrganizationId!) {
      posts(input: { organizationId: $orgId }) {
        edges {
          node {
            id
            text
            status
            channelId
            dueAt
          }
        }
      }
    }
    """, {"orgId": org_id})
    print("Existing Posts (all):", json.dumps(posts_res, indent=2))
