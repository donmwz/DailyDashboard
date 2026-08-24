from fastapi import APIRouter, HTTPException, Query

from backend.services.yahoo import YahooFinanceService


router = APIRouter(
    prefix="/api/stock",
    tags=["Stock"]
)

service = YahooFinanceService()


@router.get("")
async def list_stocks(
    symbols: str = Query(
        ...,
        description="Virgülle ayrılmış Yahoo sembolleri (ör. AAPL,THYAO.IS,XU100.IS)",
    )
):
    """Yahoo Finance chart API — ücretsiz, API anahtarı yok."""
    try:
        symbol_list = [part.strip() for part in symbols.split(",") if part.strip()]
        if not symbol_list:
            raise HTTPException(status_code=400, detail="symbols parametresi gerekli.")

        quotes = await service.quotes(symbol_list)
        if not quotes:
            raise HTTPException(status_code=502, detail="Hiçbir hisse verisi alınamadı.")

        return {"quotes": quotes}
    except HTTPException:
        raise
    except Exception as error:
        print("Stock Error:", error)
        raise HTTPException(
            status_code=502,
            detail=f"Borsa verisi alınamadı: {error}"
        ) from error


@router.get("/{symbol}")
async def get_stock(symbol: str):
    try:
        return await service.quote(symbol)
    except Exception as error:
        print("Stock Error:", error)
        raise HTTPException(
            status_code=502,
            detail=f"Borsa verisi alınamadı: {error}"
        ) from error
