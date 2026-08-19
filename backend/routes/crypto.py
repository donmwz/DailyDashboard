from fastapi import APIRouter, HTTPException
from pathlib import Path
import httpx
import os
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

router = APIRouter(
    prefix="/api/crypto",
    tags=["Crypto"]
)

CMC_API_KEY = os.getenv("COINMARKETCAP_API_KEY", "")
CMC_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"


@router.get("/{symbol}")
async def get_crypto(symbol: str):
    if not CMC_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="COINMARKETCAP_API_KEY tanımlanmamış."
        )

    symbol = symbol.upper().replace("/USD", "").strip()

    try:
        async with httpx.AsyncClient(verify=False, timeout=15) as client:
            response = await client.get(
                CMC_URL,
                params={"symbol": symbol, "convert": "USD"},
                headers={
                    "X-CMC_PRO_API_KEY": CMC_API_KEY,
                    "Accept": "application/json",
                },
            )

        payload = response.json()

        if response.status_code != 200:
            message = payload.get("status", {}).get("error_message") or response.text[:200]
            raise HTTPException(status_code=response.status_code, detail=message)

        coin = payload.get("data", {}).get(symbol)
        if isinstance(coin, list):
            coin = coin[0] if coin else None

        if not coin:
            raise HTTPException(status_code=404, detail=f"{symbol} bulunamadı.")

        quote = coin.get("quote", {}).get("USD", {})

        return {
            "symbol": symbol,
            "name": coin.get("name", symbol),
            "close": quote.get("price"),
            "percent_change": quote.get("percent_change_24h"),
        }

    except HTTPException:
        raise
    except Exception as error:
        print("Crypto Error:", error)
        raise HTTPException(
            status_code=502,
            detail=f"Kripto verisi alınamadı: {error}"
        )
