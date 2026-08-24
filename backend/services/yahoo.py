import asyncio
from typing import Iterable

import httpx

CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
}

# Kısa BIST kodları Yahoo'da .IS soneki ile gelir (THYAO.IS).


def normalize_symbol(symbol: str) -> str:
    raw = (symbol or "").strip().upper()
    if not raw:
        return raw
    # Endeks / özel semboller (^GSPC vb.)
    if raw.startswith("^") or "." in raw:
        return raw
    return raw


async def _fetch_chart(client: httpx.AsyncClient, symbol: str) -> dict:
    response = await client.get(
        CHART_URL.format(symbol=symbol),
        params={"interval": "1d", "range": "5d"},
    )
    response.raise_for_status()
    payload = response.json()

    error = (payload.get("chart") or {}).get("error")
    if error:
        raise Exception(error.get("description") or str(error))

    results = (payload.get("chart") or {}).get("result") or []
    if not results:
        raise Exception(f"Sembol için veri yok: {symbol}")

    meta = results[0].get("meta") or {}
    price = _to_float(meta.get("regularMarketPrice"))
    previous = _to_float(
        meta.get("chartPreviousClose")
        or meta.get("previousClose")
        or meta.get("regularMarketPreviousClose")
    )

    if price is None:
        raise Exception(f"Fiyat bulunamadı: {symbol}")

    change_pct = 0.0
    if previous and previous != 0:
        change_pct = ((price - previous) / previous) * 100.0

    currency = (meta.get("currency") or "").upper() or None
    exchange = meta.get("exchangeName") or meta.get("fullExchangeName")

    return {
        "symbol": meta.get("symbol") or symbol,
        "name": meta.get("shortName") or meta.get("longName") or symbol,
        "close": price,
        "previous_close": previous,
        "change": round(change_pct, 4),
        "currency": currency,
        "exchange": exchange,
        "market": _market_label(symbol, currency, exchange),
    }


def _market_label(symbol: str, currency: str | None, exchange: str | None) -> str:
    if symbol.endswith(".IS") or (currency == "TRY"):
        return "BIST"
    if currency == "USD" or (exchange and "NYSE" in exchange.upper()) or (
        exchange and "Nasdaq" in exchange
    ):
        return "US"
    return currency or "OTHER"


def _to_float(value):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


class YahooFinanceService:
    async def quote(self, symbol: str) -> dict:
        symbol = normalize_symbol(symbol)
        async with httpx.AsyncClient(
            timeout=20,
            headers=HEADERS,
            follow_redirects=True,
        ) as client:
            return await _fetch_chart(client, symbol)

    async def quotes(self, symbols: Iterable[str]) -> list[dict]:
        unique = []
        seen = set()
        for item in symbols:
            sym = normalize_symbol(item)
            if not sym or sym in seen:
                continue
            seen.add(sym)
            unique.append(sym)

        if not unique:
            return []

        async with httpx.AsyncClient(
            timeout=20,
            headers=HEADERS,
            follow_redirects=True,
        ) as client:
            results = await asyncio.gather(
                *[_fetch_chart(client, sym) for sym in unique],
                return_exceptions=True,
            )

        quotes = []
        for sym, result in zip(unique, results):
            if isinstance(result, Exception):
                print(f"Yahoo quote error ({sym}):", result)
                continue
            quotes.append(result)
        return quotes
