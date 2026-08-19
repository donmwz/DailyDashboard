from fastapi import APIRouter, HTTPException

from backend.services.twelvedata import (
    TwelveDataService
)


router = APIRouter(
    prefix="/api/crypto",
    tags=["Crypto"]
)


service = TwelveDataService()


@router.get("/{symbol}")
async def get_crypto(symbol: str):

    try:

        symbol = symbol.upper()

        # BTC gönderilirse BTC/USD yap
        if "/" not in symbol:

            symbol = f"{symbol}/USD"

        data = await service.crypto(
            symbol
        )

        return data

    except Exception as error:

        print(
            "Crypto Error:",
            error
        )

        raise HTTPException(
            status_code=502,
            detail=f"Kripto verisi alınamadı: {error}"
        )