import urllib.request
import ssl
import json

TOKEN = "vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9"
ENDPOINT = "https://api.buffer.com"

ctx = ssl._create_unverified_context()
req = urllib.request.Request(
    ENDPOINT,
    data=json.dumps({"query": "{ account { id } }"}).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
)
with urllib.request.urlopen(req, context=ctx) as resp:
    print("Headers:")
    for k, v in resp.headers.items():
        if "ratelimit" in k.lower():
            print(f"  {k}: {v}")
