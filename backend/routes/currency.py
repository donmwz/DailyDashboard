from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(
    prefix="/api/currency",
    tags=["Currency"]
)

# Frankfurter'da TRY bazlı kurlar; gösterim 1 birim döviz → TRY
CURRENCIES = {
    "USD": {"name": "Amerikan Doları", "symbol": "$"},
    "EUR": {"name": "Euro", "symbol": "€"},
    "GBP": {"name": "İngiliz Sterlini", "symbol": "£"},
    "CHF": {"name": "İsviçre Frangı", "symbol": "Fr"},
    "JPY": {"name": "Japon Yeni", "symbol": "¥"},
    "CAD": {"name": "Kanada Doları", "symbol": "C$"},
    "AUD": {"name": "Avustralya Doları", "symbol": "A$"},
    "CNY": {"name": "Çin Yuanı", "symbol": "¥"},
    "NOK": {"name": "Norveç Kronu", "symbol": "kr"},
    "SEK": {"name": "İsveç Kronu", "symbol": "kr"},
    "DKK": {"name": "Danimarka Kronu", "symbol": "kr"},
    "PLN": {"name": "Polonya Zlotisi", "symbol": "zł"},
}


@router.get("")
async def get_currency_rates():
    try:
        codes = list(CURRENCIES.keys())

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                "https://api.frankfurter.dev/v1/latest",
                params={
                    "base": "TRY",
                    "symbols": ",".join(codes),
                },
            )

        response.raise_for_status()
        payload = response.json()
        raw_rates = payload.get("rates") or {}

        rates = {}
        for code, meta in CURRENCIES.items():
            foreign_per_try = raw_rates.get(code)
            if not foreign_per_try:
                continue
            # 1 TRY = foreign_per_try → 1 foreign = 1 / foreign_per_try TRY
            rates[code] = {
                "name": meta["name"],
                "symbol": meta["symbol"],
                "rate": round(1 / float(foreign_per_try), 4),
            }

        if not rates:
            raise HTTPException(status_code=502, detail="Döviz kurları boş döndü.")

        return {
            "date": payload.get("date"),
            "updated_at": payload.get("date"),
            "source": "Frankfurter",
            "rates": rates,
        }

    except HTTPException:
        raise
    except httpx.HTTPError as error:
        print("Currency API Error:", error)
        raise HTTPException(
            status_code=502,
            detail="Döviz servisine ulaşılamadı."
        ) from error
