from fastapi import APIRouter, HTTPException
from pathlib import Path
import httpx
import os
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

router = APIRouter(
    prefix="/api/news",
    tags=["News"]
)

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY", "")
GNEWS_URL = "https://gnews.io/api/v4/top-headlines"


@router.get("")
async def get_news():
    if not GNEWS_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GNEWS_API_KEY tanımlanmamış. .env dosyasına ekleyin."
        )

    params = {
        "category": "general",
        "lang": "tr",
        "country": "tr",
        "max": 15,
        "apikey": GNEWS_API_KEY,
    }

    try:
        async with httpx.AsyncClient(verify=False, timeout=15) as client:
            response = await client.get(GNEWS_URL, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"GNews API hatası: {response.text[:200]}"
            )

        data = response.json()
        raw_articles = data.get("articles", [])

        articles = []
        for item in raw_articles:
            articles.append({
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "url": item.get("url", ""),
                "image": item.get("image", ""),
                "source": item.get("source", {}).get("name", "Bilinmiyor"),
                "published_at": item.get("publishedAt", ""),
            })

        return {
            "total": len(articles),
            "articles": articles,
        }

    except httpx.HTTPError as e:
        print("GNews API bağlantı hatası:", e)
        raise HTTPException(
            status_code=502,
            detail="Haber API'sine ulaşılamadı."
        )
