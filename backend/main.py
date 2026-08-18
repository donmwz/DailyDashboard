from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.stock import router as stock_router


from backend.routes.weather import router as weather_router
from backend.routes.currency import router as currency_router
from backend.routes.news import router as news_router
from backend.routes.gold import router as gold_router

app = FastAPI(
    title="Daily Dashboard API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(weather_router)
app.include_router(currency_router)
app.include_router(news_router)
app.include_router(gold_router)
app.include_router(stock_router)


@app.get("/")
def root():
    return {
        "message": "Daily Dashboard API çalışıyor 🚀"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }