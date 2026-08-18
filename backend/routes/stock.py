from fastapi import APIRouter, HTTPException

from backend.services.twelvedata import (
    TwelveDataService
)


router = APIRouter(
    prefix="/api/stock",
    tags=["Stock"]
)


service = TwelveDataService()


@router.get("/{symbol}")
async def get_stock(symbol: str):

    try:

        symbol = symbol.upper()

        data = await service.stock(
            symbol
        )

        return data

    except Exception as error:

        print(
            "Stock Error:",
            error
        )

        raise HTTPException(
            status_code=502,
            detail=f"Borsa verisi alınamadı: {error}"
        )