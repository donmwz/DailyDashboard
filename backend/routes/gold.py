from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(
    prefix="/api/gold",
    tags=["Gold"]
)

URL = "https://api.genelpara.com/json/"


@router.get("")
async def get_gold():

    params = {
        "list": "altin",
        "sembol": "GA,C,Y,T,CMR,XAUUSD"
    }

    try:

        async with httpx.AsyncClient(
            timeout=10
        ) as client:

            response = await client.get(
                URL,
                params=params
            )

            print(
                "Gold status:",
                response.status_code
            )

            response.raise_for_status()

            data = response.json()

            print(
                "Gold data:",
                data
            )

        return data

    except httpx.HTTPError as error:

        print(
            "Gold HTTP Error:",
            error
        )

        raise HTTPException(
            status_code=502,
            detail="Altın servisine ulaşılamadı."
        )

    except Exception as error:

        print(
            "Gold Error:",
            error
        )

        raise HTTPException(
            status_code=502,
            detail=str(error)
        )