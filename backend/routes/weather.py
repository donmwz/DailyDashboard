from fastapi import APIRouter, HTTPException, Query
import httpx

CITIES = {
    "istanbul": {
        "name": "İstanbul",
        "latitude": 41.0082,
        "longitude": 28.9784
    },

    "ankara": {
        "name": "Ankara",
        "latitude": 39.9334,
        "longitude": 32.8597
    },

    "izmir": {
        "name": "İzmir",
        "latitude": 38.4237,
        "longitude": 27.1428
    },

    "bursa": {
        "name": "Bursa",
        "latitude": 40.1950,
        "longitude": 29.0600
    },

    "antalya": {
        "name": "Antalya",
        "latitude": 36.8969,
        "longitude": 30.7133
    },

    "adana": {
        "name": "Adana",
        "latitude": 37.0000,
        "longitude": 35.3213
    },

    "trabzon": {
        "name": "Trabzon",
        "latitude": 41.0015,
        "longitude": 39.7178
    }
}

router = APIRouter(
    prefix="/api/weather",
    tags=["Weather"]
)

@router.get("/cities")
async def get_cities():

    return list(CITIES.values())

@router.get("/city/{city_name}")
async def get_city_weather(city_name: str):

    city = CITIES.get(city_name.lower())

    if not city:
        raise HTTPException(
            status_code=404,
            detail="Şehir bulunamadı."
        )

    return await get_weather(
        latitude=city["latitude"],
        longitude=city["longitude"]
    )

@router.get("")
async def get_weather(
    latitude: float = Query(...),
    longitude: float = Query(...)
):
    """
    Verilen koordinatlara göre güncel hava durumunu getirir.
    """

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "wind_speed_10m,"
            "weather_code"
        ),
        "temperature_unit": "celsius",
        "wind_speed_unit": "kmh",
        "timezone": "auto",
    }

    try:

        async with httpx.AsyncClient(timeout=10) as client:

            response = await client.get(
                url,
                params=params
            )

            response.raise_for_status()

            data = response.json()

        current = data["current"]

        return {
            "latitude": latitude,
            "longitude": longitude,
            "temperature": current["temperature_2m"],
            "humidity": current["relative_humidity_2m"],
            "feels_like": current["apparent_temperature"],
            "wind_speed": current["wind_speed_10m"],
            "weather_code": current["weather_code"],
            "time": current["time"],
        }

    except httpx.HTTPError:

        raise HTTPException(
            status_code=502,
            detail="Hava durumu servisine ulaşılamadı."
        )