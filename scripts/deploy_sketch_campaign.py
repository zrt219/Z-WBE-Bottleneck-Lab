# scripts/deploy_sketch_campaign.py
import urllib.request, urllib.parse, ssl, json, time, os, sys, re
from datetime import datetime, timedelta, timezone

sys.stdout.reconfigure(encoding='utf-8')

TOKEN = 'vfzzaMs7Qkaz5tocOxEw_2tZL2pX-KDE6shZdKEfpk9'
ENDPOINT = 'https://api.buffer.com'
LINKEDIN_CH = '6a4e1a1c404834462881bed6'
RAW_GITHUB_BASE = 'https://raw.githubusercontent.com/zrt219/Z-WBE-Bottleneck-Lab/main'

BASE_DIR = r'd:\programming\Blockchain development\Z-WBE Bottleneck Lab'
DEPLOYED_STATE_FILE = os.path.join(BASE_DIR, 'social-campaign', 'buffer_deployed_posts.json')
SKETCH_DIR = os.path.join(BASE_DIR, 'social-campaign', 'linkedin', 'sketch-series')
os.makedirs(SKETCH_DIR, exist_ok=True)

ctx = ssl._create_unverified_context()

def parse_rate_limit_headers(headers):
    result = {}
    vals = []
    if hasattr(headers, 'get_all'):
        for h in ['ratelimit', 'ratelimit-policy', 'x-ratelimit-reset']:
            found = headers.get_all(h)
            if found: vals.extend(found)
    if hasattr(headers, 'items'):
        for k, v in headers.items():
            if 'ratelimit' in k.lower(): vals.append(v)
    for v in vals:
        if '-in-15min' in v:
            m_r = re.search(r'r=(\d+)', v)
            m_t = re.search(r't=(\d+)', v)
            if m_r: result['r_15m'] = int(m_r.group(1))
            if m_t: result['t_15m'] = int(m_t.group(1))
        elif '-in-1day' in v:
            m_r = re.search(r'r=(\d+)', v)
            m_t = re.search(r't=(\d+)', v)
            if m_r: result['r_1d'] = int(m_r.group(1))
            if m_t: result['t_1d'] = int(m_t.group(1))
    return result

def query_buffer(query, variables=None, retries=3):
    payload = {'query': query}
    if variables: payload['variables'] = variables
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(ENDPOINT, data=data, headers={
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'Z-WBE-Sketch-Deployer/1.0'
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                limits = parse_rate_limit_headers(resp.headers)
                body = json.loads(resp.read().decode('utf-8'))
                return body, limits
        except urllib.error.HTTPError as e:
            if e.code == 429:
                limits = parse_rate_limit_headers(e.headers)
                t_15m = limits.get('t_15m', 60)
                print('[RateLimit 429] Sleeping ' + str(t_15m + 5) + 's...')
                time.sleep(t_15m + 5)
                continue
            err_body = e.read().decode('utf-8')
            print('[HTTP ' + str(e.code) + '] Error: ' + err_body)
            return {'http_error': e.code, 'error': err_body}, {}
        except Exception as e:
            print('[Network Exception] ' + str(e))
            if attempt < retries - 1:
                time.sleep(3)
                continue
            return {'exception': str(e)}, {}
    return {'error': 'Exceeded retries'}, {}

def parse_mdt_to_utc_iso(date_str, time_str):
    t_clean = time_str.replace('MDT', '').strip()
    dt = datetime.strptime(date_str + ' ' + t_clean, '%Y-%m-%d %H:%M')
    tz_mdt = timezone(timedelta(hours=-6))
    dt_mdt = dt.replace(tzinfo=tz_mdt)
    dt_utc = dt_mdt.astimezone(timezone.utc)
    return dt_utc.strftime('%Y-%m-%dT%H:%M:%S.000Z')

def format_assets(media):
    m_list = media if isinstance(media, list) else [media]
    assets = []
    for m in m_list:
        m_norm = m.replace('\\', '/')
        parts = m_norm.split('/')
        encoded_parts = [urllib.parse.quote(p) for p in parts]
        url = RAW_GITHUB_BASE + '/' + '/'.join(encoded_parts)
        assets.append({'image': {'url': url}})
    return assets

def load_deployed_state():
    if os.path.exists(DEPLOYED_STATE_FILE):
        try:
            with open(DEPLOYED_STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_deployed_state(state):
    with open(DEPLOYED_STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2)

def write_sketch_markdown(p, buffer_id=None, buffer_status=None):
    day_num = p['day']
    fname = f"day-{day_num:02d}.md"
    fpath = os.path.join(SKETCH_DIR, fname)
    
    media_list = p['media'] if isinstance(p['media'], list) else [p['media']]
    media_md = ""
    for idx, m in enumerate(media_list, 1):
        m_norm = m.replace('\\', '/')
        parts = m_norm.split('/')
        encoded_parts = [urllib.parse.quote(part) for part in parts]
        raw_url = f"{RAW_GITHUB_BASE}/{'/'.join(encoded_parts)}"
        media_md += f"{idx}. **Asset**: `{m}`\n   - **Raw GitHub URL**: {raw_url}\n"
    
    content = f"""# Z-WBE Sketch Campaign — Day {day_num:02d}

**Post ID**: `{p['id']}`  
**Scheduled Date**: {p['date']}  
**Scheduled Time**: {p['time']} (MDT)  
**Buffer Status**: `{buffer_status or 'pending'}`  
**Buffer Post ID**: `{buffer_id or 'N/A'}`  
**Target Platform**: LinkedIn (Zhane Grey / Channel `{LINKEDIN_CH}`)  
**CTA Target**: https://careercircle.app  

---

### Topic: {p['topic']}

#### Attached Media
{media_md}

#### Post Text (LinkedIn)
```text
{p['text']}
```

---
*Generated for Z-WBE Bottleneck Lab 14-Day Sketch Architecture Series*
"""
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

def write_sketch_series_readme(posts, state):
    readme_path = os.path.join(SKETCH_DIR, 'README.md')
    rows = []
    for p in posts:
        pid = p['id']
        b_info = state.get(pid, {})
        b_id = b_info.get('buffer_id', 'Pending')
        b_status = b_info.get('status', 'scheduled')
        media_str = p['media'] if isinstance(p['media'], str) else f"{len(p['media'])} images (Carousel)"
        rows.append(f"| Day {p['day']:02d} | {p['date']} | {p['time']} | {p['topic']} | `{media_str}` | `{b_status}` | `{b_id}` |")

    table = "\n".join(rows)
    content = f"""# 14-Day Z-WBE Hand-Drawn Sketch Series on LinkedIn

A 14-day technical storytelling campaign across LinkedIn illustrating the systems engineering, biophysics, and cloud architecture of **Z-WBE Bottleneck Lab** using high-resolution hand-drawn sketches.

## Campaign Specifications
- **Frequency**: 1 post per day for 14 consecutive days (Sept 9 – Sept 22, 2026)
- **Time Window**: 17:30 MDT (7:30 PM EDT / 4:30 PM PDT)
- **Platform**: LinkedIn
- **Primary CTA**: [CareerCircle.app](https://careercircle.app) — Upskilling, high-performance computing, and career transitions into AI/cloud/systems engineering
- **Hashtags**: `#CareerCircle #CareerTransition #Upskilling #AIEngineering #CloudArchitecture #SystemsEngineering #DevChallenge #BuildInPublic`
- **Schedule Mode**: Scheduled Queue in Buffer (`saveToDraft: false`, `mode: customScheduled`)

## Master Schedule & Buffer Tracking
| Day | Date | Time (MDT) | Focus / Topic | Media | Buffer Status | Buffer ID |
|:---:|:----:|:----------:|:--------------|:------|:-------------:|:---------:|
{table}

---
*Built with Antigravity & Buffer GraphQL API for Z-WBE Bottleneck Lab*
"""
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(content)

def deploy_sketch_campaign():
    data_path = os.path.join(BASE_DIR, 'scripts', 'sketch_posts_data.json')
    with open(data_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    state = load_deployed_state()
    print(f"Loaded {len(posts)} sketch posts. Current state has {len(state)} records.")

    create_mutation = """
    mutation CreateCampaignPost($input: CreatePostInput!) {
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

    success_count = 0
    skipped_count = 0

    for idx, p in enumerate(posts, 1):
        pid = p['id']
        if pid in state and state[pid].get('buffer_id'):
            print(f"[{idx}/{len(posts)}] {pid} already deployed (Buffer ID: {state[pid]['buffer_id']}). Skipping API call.")
            write_sketch_markdown(p, buffer_id=state[pid]['buffer_id'], buffer_status=state[pid].get('status', 'scheduled'))
            skipped_count += 1
            continue

        due_iso = parse_mdt_to_utc_iso(p['date'], p['time'])
        assets = format_assets(p['media'])

        variables = {
            "input": {
                "channelId": LINKEDIN_CH,
                "text": p['text'],
                "schedulingType": "automatic",
                "mode": "customScheduled",
                "dueAt": due_iso,
                "saveToDraft": False,
                "assets": assets
            }
        }

        print(f"[{idx}/{len(posts)}] Scheduling {pid} for {p['date']} {p['time']}...", end=" ", flush=True)
        res, limits = query_buffer(create_mutation, variables)

        post_res = res.get('data', {}).get('createPost', {})
        if 'post' in post_res and post_res['post']:
            b_id = post_res['post']['id']
            b_status = post_res['post']['status']
            state[pid] = {
                "buffer_id": b_id,
                "status": b_status,
                "dueAt": due_iso,
                "channelId": LINKEDIN_CH,
                "platform": "LinkedIn",
                "topic": p['topic'],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            save_deployed_state(state)
            write_sketch_markdown(p, buffer_id=b_id, buffer_status=b_status)
            print(f"SUCCESS -> Buffer ID: {b_id} (Status: {b_status})")
            success_count += 1
        else:
            err = post_res.get('message') or res.get('error') or str(res)
            print(f"FAILED -> {err}")
            state[pid] = {
                "error": err,
                "attempted_at": datetime.now(timezone.utc).isoformat()
            }
            save_deployed_state(state)
            write_sketch_markdown(p, buffer_id="ERROR", buffer_status=f"Failed: {err}")

        # Sleep to respect rate limits
        time.sleep(2)

    write_sketch_series_readme(posts, state)
    print(f"\n=== Finished Sketch Deployment: {success_count} scheduled, {skipped_count} skipped, {len(posts)} total ===")

if __name__ == '__main__':
    deploy_sketch_campaign()

