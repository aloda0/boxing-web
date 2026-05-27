#!/usr/bin/env python3
"""
Boxing news auto-parser for boxing-hmao.ru
Sources: championat.com (RSS), sport-express.ru (HTML), ura.news (RSS + keywords)
"""

import hashlib
import json
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import anthropic
import feedparser
import requests
from bs4 import BeautifulSoup
from dateutil import parser as dateparser

# ─── Config ───────────────────────────────────────────────────────────────────

SEEN_URLS_FILE = Path(__file__).parent / "seen_urls.json"

SANITY_PROJECT_ID = os.environ["SANITY_PROJECT_ID"]
SANITY_DATASET    = os.environ.get("SANITY_DATASET", "production")
SANITY_TOKEN      = os.environ["SANITY_TOKEN"]
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID   = os.environ.get("TELEGRAM_CHAT_ID", "")

SANITY_API = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data"

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; boxing-hmao-parser/1.0)"}

# Ключевые слова для фильтрации ura.news
YUGRA_KEYWORDS = [
    "бокс", "боксёр", "боксер", "боксерск",
    "хмао", "югра", "ханты-мансийск", "сургут", "нижневартовск",
    "фбю", "федерация бокса",
]

# ─── Deduplication ────────────────────────────────────────────────────────────

def load_seen() -> set:
    if SEEN_URLS_FILE.exists():
        return set(json.loads(SEEN_URLS_FILE.read_text()))
    return set()

def save_seen(urls: set):
    SEEN_URLS_FILE.write_text(
        json.dumps(sorted(urls), ensure_ascii=False, indent=2)
    )

# ─── Helpers ──────────────────────────────────────────────────────────────────

TRANSLIT = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
    'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
    'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts',
    'ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
}

def slugify(text: str) -> str:
    s = text.lower().strip()
    s = ''.join(TRANSLIT.get(c, c) for c in s)
    s = re.sub(r"['\"`'«»]", '', s)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s[:90]

def parse_dt(s: str) -> str:
    if not s:
        return datetime.now(timezone.utc).isoformat()
    try:
        dt = dateparser.parse(s)
        if dt:
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.isoformat()
    except Exception:
        pass
    return datetime.now(timezone.utc).isoformat()

def make_body(text: str) -> list:
    """Портативный текст Sanity из plain text."""
    paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    if not paragraphs:
        paragraphs = [text.strip() or "—"]
    return [
        {
            "_type": "block",
            "_key": hashlib.md5(f"{i}{p}".encode()).hexdigest()[:8],
            "style": "normal",
            "markDefs": [],
            "children": [{"_type": "span", "_key": "s0", "marks": [], "text": p}],
        }
        for i, p in enumerate(paragraphs)
    ]

# ─── Scrapers ─────────────────────────────────────────────────────────────────

def fetch_championat() -> list:
    """RSS championat.com/boxing — картинки через enclosure."""
    print("  [championat] fetching RSS...")
    feed = feedparser.parse("https://www.championat.com/rss/news/boxing/")
    out = []
    for e in feed.entries[:25]:
        img = None
        if getattr(e, 'enclosures', None):
            img = e.enclosures[0].get('url')
        out.append({
            "source": "Чемпионат.com",
            "source_url": "https://www.championat.com/boxing/",
            "url": e.link,
            "title": e.title,
            "description": e.get('summary', ''),
            "published_at": e.get('published', ''),
            "image_url": img,
        })
    print(f"  [championat] got {len(out)} items")
    return out


def fetch_sport_express() -> list:
    """HTML-парсинг sport-express.ru/martial/boxing/."""
    print("  [sport-express] fetching HTML...")
    try:
        resp = requests.get(
            "https://www.sport-express.ru/martial/boxing/",
            headers=HEADERS, timeout=15
        )
        resp.raise_for_status()
    except Exception as e:
        print(f"  [sport-express] ERROR: {e}")
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')
    seen_links: set = set()
    out = []

    for a in soup.find_all('a', href=True):
        href: str = a['href']
        if '/news/' not in href:
            continue
        full = f"https://www.sport-express.ru{href}" if href.startswith('/') else href
        if full in seen_links:
            continue
        title = a.get_text(strip=True)
        if len(title) < 25:
            continue
        seen_links.add(full)

        # Ищем картинку рядом
        img = None
        parent = a.find_parent()
        if parent:
            tag = parent.find('img', src=True)
            if tag:
                src = tag['src']
                if src.startswith('http'):
                    img = src

        out.append({
            "source": "Спорт-Экспресс",
            "source_url": "https://www.sport-express.ru/martial/boxing/",
            "url": full,
            "title": title,
            "description": "",
            "published_at": "",
            "image_url": img,
        })

    print(f"  [sport-express] got {len(out)} items")
    return out[:20]


def fetch_ura_news() -> list:
    """RSS ura.news, фильтр по ключевым словам."""
    print("  [ura.news] fetching RSS...")
    feed = feedparser.parse("https://ura.news/rss")
    out = []
    for e in feed.entries[:60]:
        text = (e.title + ' ' + e.get('summary', '')).lower()
        if not any(kw in text for kw in YUGRA_KEYWORDS):
            continue

        # Пробуем достать картинку из content:encoded
        img = None
        for c in e.get('content', []):
            m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', c.get('value', ''))
            if m:
                url = m.group(1)
                if url.startswith('http'):
                    img = url
                    break

        out.append({
            "source": "УРА.РУ",
            "source_url": "https://ura.news",
            "url": e.link,
            "title": e.title,
            "description": e.get('summary', ''),
            "published_at": e.get('published', ''),
            "image_url": img,
        })

    print(f"  [ura.news] got {len(out)} relevant items")
    return out

# ─── Claude filter ────────────────────────────────────────────────────────────

def filter_with_claude(articles: list) -> list:
    if not articles:
        return []

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    relevant = []
    batch_size = 12

    for i in range(0, len(articles), batch_size):
        batch = articles[i:i + batch_size]
        lines = "\n".join(
            f"{j+1}. [{a['source']}] {a['title']} | {a['description'][:180]}"
            for j, a in enumerate(batch)
        )

        msg = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=300,
            messages=[{
                "role": "user",
                "content": (
                    "Ты редактор сайта Федерации бокса Ханты-Мансийского округа — Югры.\n"
                    "Отбери ТОЛЬКО статьи строго про:\n"
                    "1. Бокс — новости, результаты боёв, российские и мировые соревнования\n"
                    "2. Российские боксёры на международном уровне\n"
                    "3. Бокс в Югре / ХМАО / Ханты-Мансийске\n\n"
                    "НЕ ВКЛЮЧАЙ: ММА, UFC, кикбоксинг, другие виды спорта, политику.\n\n"
                    f"Статьи:\n{lines}\n\n"
                    "Ответь ТОЛЬКО номерами через запятую. Если нет подходящих — напиши 'нет'."
                ),
            }]
        )

        response = msg.content[0].text.strip()
        if response.lower() == 'нет':
            continue

        for num in re.findall(r'\d+', response):
            idx = int(num) - 1
            if 0 <= idx < len(batch):
                relevant.append(batch[idx])

        time.sleep(0.3)

    return relevant

# ─── Sanity ───────────────────────────────────────────────────────────────────

def upload_image(url: str) -> Optional[str]:
    """Загружает картинку в Sanity Assets, возвращает asset _id."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=15, stream=True)
        r.raise_for_status()
        ct = r.headers.get('content-type', 'image/jpeg').split(';')[0].strip()
        if not ct.startswith('image/'):
            return None
        upload_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/{SANITY_DATASET}"
        up = requests.post(
            upload_url,
            headers={"Authorization": f"Bearer {SANITY_TOKEN}", "Content-Type": ct},
            data=r.content,
            timeout=30,
        )
        up.raise_for_status()
        return up.json()['document']['_id']
    except Exception as e:
        print(f"    [image] upload failed: {e}")
        return None


def create_draft(article: dict) -> Optional[str]:
    """Создаёт черновик newsArticle в Sanity."""
    uid = hashlib.md5(article['url'].encode()).hexdigest()[:14]
    doc_id = f"drafts.auto-{uid}"
    slug = slugify(article['title'])

    # Тело — описание + ссылка на источник
    body_text = article.get('description', '').strip()
    body_text += f"\n\nИсточник: {article['source']} — {article['url']}"
    body = make_body(body_text)

    doc: dict = {
        "_id": doc_id,
        "_type": "newsArticle",
        "title": article['title'],
        "slug": {"_type": "slug", "current": slug},
        "publishedAt": parse_dt(article.get('published_at', '')),
        "body": body,
    }

    # Картинка
    if article.get('image_url'):
        asset_id = upload_image(article['image_url'])
        if asset_id:
            doc["coverImage"] = {
                "_type": "image",
                "asset": {"_type": "reference", "_ref": asset_id},
            }

    resp = requests.post(
        f"{SANITY_API}/mutate/{SANITY_DATASET}",
        headers={
            "Authorization": f"Bearer {SANITY_TOKEN}",
            "Content-Type": "application/json",
        },
        json={"mutations": [{"createOrReplace": doc}]},
        timeout=30,
    )
    resp.raise_for_status()
    return doc_id

# ─── Telegram ─────────────────────────────────────────────────────────────────

def telegram_notify(articles: list):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID or not articles:
        return
    lines = [f"📰 <b>Новые черновики: {len(articles)}</b>\n"]
    for a in articles[:10]:
        lines.append(f"• <b>[{a['source']}]</b> {a['title']}")
    lines.append(
        f"\n✏️ <a href='https://www.boxing-hmao.ru/studio/structure/newsArticle'>Открыть студию →</a>"
    )
    try:
        requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id": TELEGRAM_CHAT_ID,
                "text": "\n".join(lines),
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            },
            timeout=10,
        )
        print("  [telegram] notification sent")
    except Exception as e:
        print(f"  [telegram] ERROR: {e}")

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"=== Boxing News Parser — {datetime.now().strftime('%Y-%m-%d %H:%M')} ===")

    seen = load_seen()

    # 1. Fetch
    print("\n[1] Fetching sources...")
    all_articles = []
    all_articles.extend(fetch_championat())
    all_articles.extend(fetch_sport_express())
    all_articles.extend(fetch_ura_news())
    print(f"  Total: {len(all_articles)}")

    # 2. Deduplicate
    new_articles = [a for a in all_articles if a['url'] not in seen]
    print(f"\n[2] New (not seen before): {len(new_articles)}")
    if not new_articles:
        print("Nothing new. Done.")
        save_seen(seen)
        return

    # 3. Filter with Claude
    print("\n[3] Filtering with Claude AI...")
    relevant = filter_with_claude(new_articles)
    print(f"  Relevant: {len(relevant)}")

    # 4. Mark all new as seen (even rejected)
    for a in new_articles:
        seen.add(a['url'])

    # 5. Create Sanity drafts
    print("\n[4] Creating Sanity drafts...")
    created = []
    for article in relevant:
        try:
            doc_id = create_draft(article)
            if doc_id:
                print(f"  ✓ {article['title'][:70]}")
                created.append(article)
            time.sleep(0.5)
        except Exception as e:
            print(f"  ✗ FAILED: {e} | {article['url']}")

    # 6. Save state
    save_seen(seen)
    print(f"\n[5] Seen URLs total: {len(seen)}")

    # 7. Notify
    if created:
        telegram_notify(created)

    print(f"\n=== Done. Created {len(created)} drafts ===")


if __name__ == "__main__":
    main()
