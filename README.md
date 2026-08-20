# Daily Dashboard

Hava, döviz, altın, kripto, borsa ve haberleri tek ekranda toplayan bir dashboard. Arayüz Vite ile çalışır; veriler kendi FastAPI sunucularından gelir. Kullanıcı giriş ve kayıt işlemleri Supabase Auth üzerinden gerçekleştirilir.

## Mimari

```
Tarayıcı (Vite, port 5173)
  ├── FastAPI  →  http://127.0.0.1:8000
  │     ├── Open-Meteo          (hava)
  │     ├── Frankfurter         (döviz)
  │     ├── Genelpara           (altın)
  │     ├── CoinMarketCap       (kripto)
  │     ├── Twelve Data         (borsa)
  │     └── GNews               (haber)
  └── Supabase                    (Auth + kullanıcı ayarları)
```

Dashboard fiyat ve haber verisini kendi veritabanında tutmaz; her istekte ilgili dış API’den çekilir. Tema, kart sırası, görünür modüller ve sınıflandırmalar tarayıcı `localStorage` içindedir.

## Klasörler

- `frontend/` — arayüz (Vite, Tabler, Bootstrap, SortableJS, Supabase JS)
- `backend/` — FastAPI, route’lar ve `.env` anahtarları

## Gereksinimler

- Python 3.13+
- Node.js (npm)
- Hesap / API anahtarı: CoinMarketCap, Twelve Data, GNews, Supabase

## Kurulum

### Backend

Proje kökünden:

```bash
pip install fastapi uvicorn httpx python-dotenv
```

`backend/.env` dosyasını oluştur:

```
TWELVE_DATA_API_KEY=
GNEWS_API_KEY=
COINMARKETCAP_API_KEY=
```

API’yi başlat:

```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Sağlık kontrolü: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Frontend

```bash
cd frontend
npm install
```

`frontend/.env` dosyasını oluştur:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=
```

`VITE_SUPABASE_URL` proje kök adresi olmalı (`/rest/v1` ekleme). Vite env’i yalnızca başlangıçta okur; değiştirdikten sonra `npm run dev`’i yeniden çalıştır.

```bash
npm run dev
```

Arayüz varsayılan olarak [http://127.0.0.1:5173](http://127.0.0.1:5173) adresindedir.

### Supabase veritabanı (kullanıcı ayarları)

Supabase Dashboard → **SQL Editor** içinde `supabase/migrations/20240820000000_user_dashboard_settings.sql` dosyasının içeriğini çalıştırın. Bu migration `user_dashboard_settings` tablosunu ve RLS politikalarını oluşturur.

Giriş yapmış kullanıcılar için kaydedilen alanlar:

| Alan | Açıklama |
|------|----------|
| `theme` | `light` / `dark` |
| `modules` | Görünür modül kartları |
| `card_order` | Sürükle-bırak sırası |
| `data_prefs` | Altın, kripto, hisse seçimleri |
| `weather_location` | Şehir veya GPS konumu |

## API uçları

| Method | Yol | Kaynak |
|--------|-----|--------|
| GET | `/api/health` | — |
| GET | `/api/weather?latitude=&longitude=` | Open-Meteo |
| GET | `/api/weather/cities` | Sabit şehir listesi |
| GET | `/api/currency` | Frankfurter (USD/EUR/GBP → TRY) |
| GET | `/api/gold` | Genelpara |
| GET | `/api/crypto/{symbol}` | CoinMarketCap (ör. `BTC`) |
| GET | `/api/stock/{symbol}` | Twelve Data (ör. `AAPL`) |
| GET | `/api/news` | GNews (TR, genel) |

CORS, Vite geliştirme portları `5173` ve `5174` için açıktır.

## Özellikler

- Modül kartlarını göster / gizle (Ayarlar)
- Altın türü, kripto ve hisse seçimi (sınıflandırmalar)
- Kart sürükle-bırak sıralama
- Koyu tema
- E-posta ile kayıt ve giriş (Supabase)
- Kullanıcı ayarları Supabase PostgreSQL'de kalıcı (modüller, sıra, tema, altın/kripto/hisse seçimi, hava konumu)

## Notlar

- Kripto yanıtı arayüzün beklediği alanlarla döner: `close`, `percent_change`
- Haberler için GNews ücretsiz planda e-posta doğrulama / kota limiti olabilir
