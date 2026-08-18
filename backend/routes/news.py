from fastapi import APIRouter, HTTPException
import feedparser
import asyncio

router = APIRouter(
    prefix="/api/news",
    tags=["News"]
)


RSS_SOURCES = [
    {
        "name": "TRT Haber",
        "url": "https://www.trthaber.com/sondakika_articles.rss"
    },

    {
        "name": "Haber Global",
        "url": "https://haberglobal.com.tr/rss"
    },

    {
        "name": "Google News",
        "url": "https://news.google.com/rss?hl=tr&gl=TR&ceid=TR:tr"
    }
]


async def fetch_rss(source):

    def parse_feed():

        return feedparser.parse(
            source["url"]
        )

    feed = await asyncio.to_thread(
        parse_feed
    )

    articles = []

    for entry in feed.entries[:15]:

        # Google News'te source bilgisi
        # farklı bir yapıda gelebilir.
        source_name = source["name"]

        if source["name"] == "Google News":

            source_data = entry.get(
                "source"
            )

            if source_data:

                source_name = source_data.get(
                    "title",
                    "Google News"
                )


        articles.append({

            "title": entry.get(
                "title",
                ""
            ),

            "description": entry.get(
                "description",
                ""
            ),

            "url": entry.get(
                "link",
                ""
            ),

            "published_at": entry.get(
                "published",
                entry.get(
                    "pubDate",
                    ""
                )
            ),

            "source": source_name

        })

    return articles


@router.get("")
async def get_news():

    try:

        results = await asyncio.gather(
            *[
                fetch_rss(source)
                for source in RSS_SOURCES
            ],
            return_exceptions=True
        )

        articles = []


        for result in results:

            if isinstance(
                result,
                Exception
            ):

                print(
                    "RSS kaynağı hatası:",
                    result
                )

                continue


            articles.extend(result)


        return {
            "total": len(articles),
            "articles": articles
        }


    except Exception as error:

        print(
            "News API Error:",
            error
        )

        raise HTTPException(
            status_code=502,
            detail="Haber kaynaklarına ulaşılamadı."
        )