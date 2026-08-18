import os
from pathlib import Path

import httpx
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("TWELVE_DATA_API_KEY")

BASE_URL = "https://api.twelvedata.com"


class TwelveDataService:

    def __init__(self):

        if not API_KEY:
            raise ValueError(
                "TWELVE_DATA_API_KEY bulunamadı."
            )

        self.api_key = API_KEY


    async def quote(self, symbol: str):

        params = {
            "symbol": symbol,
            "apikey": self.api_key
        }

        async with httpx.AsyncClient(
            timeout=15
        ) as client:

            response = await client.get(
                f"{BASE_URL}/quote",
                params=params
            )

            response.raise_for_status()

            data = response.json()

        if "code" in data:

            raise Exception(
                data.get(
                    "message",
                    "Twelve Data API hatası"
                )
            )

        return data


    async def stock(self, symbol: str):

        symbol = symbol.strip().upper()

        if symbol.endswith(":XIST"):
            symbol = symbol.replace(":XIST", "")

        return await self.quote(symbol)


    async def forex(self, symbol: str):

        return await self.quote(symbol)


    async def crypto(self, symbol: str):

        return await self.quote(symbol)


    async def gold(self):

        return await self.quote(
            "XAU/USD"
        )