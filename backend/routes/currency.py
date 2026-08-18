from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(
    prefix="/api/currency",
    tags=["Currency"]
)


CURRENCIES = {
    "USD": {
        "name": "Amerikan Doları",
        "symbol": "$"
    },
    "EUR": {
        "name": "Euro",
        "symbol": "€"
    },
    "GBP": {
        "name": "İngiliz Sterlini",
        "symbol": "£"
    }
}


@router.get("")
async def get_currency_rates():

    try:

        async with httpx.AsyncClient(timeout=10) as client:

            usd_response = await client.get(
                "https://api.frankfurter.dev/v2/rate/USD/TRY"
            )

            eur_response = await client.get(
                "https://api.frankfurter.dev/v2/rate/EUR/TRY"
            )

            gbp_response = await client.get(
                "https://api.frankfurter.dev/v2/rate/GBP/TRY"
            )


        usd_response.raise_for_status()
        eur_response.raise_for_status()
        gbp_response.raise_for_status()


        usd = usd_response.json()
        eur = eur_response.json()
        gbp = gbp_response.json()


        return {
            "date": usd["date"],

            "rates": {

                "USD": {
                    "name": "Amerikan Doları",
                    "symbol": "$",
                    "rate": usd["rate"]
                },

                "EUR": {
                    "name": "Euro",
                    "symbol": "€",
                    "rate": eur["rate"]
                },

                "GBP": {
                    "name": "İngiliz Sterlini",
                    "symbol": "£",
                    "rate": gbp["rate"]
                }

            }
        }


    except httpx.HTTPError as error:

        print("Currency API Error:", error)

        raise HTTPException(
            status_code=502,
            detail="Döviz servisine ulaşılamadı."
        )