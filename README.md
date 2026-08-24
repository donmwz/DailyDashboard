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
  │     ├── Yahoo Finance       (borsa — ABD + BIST, API anahtarı yok)
  │     └── GNews               (haber)
  └── Supabase                    (Auth + kullanıcı ayarları)
```

Dashboard fiyat ve haber verisini kendi veritabanında tutmaz; her istekte ilgili dış API’den çekilir. Tema, kart sırası, görünür modüller ve sınıflandırmalar giriş yapılmış kullanıcıda Supabase `user_dashboard_settings` tablosunda; takvim kayıtları `user_calendar_items` tablosunda; misafirde `localStorage` içindedir.

## Klasörler

- `frontend/` — arayüz (Vite, Tabler, Bootstrap, SortableJS, Supabase JS)
- `backend/` — FastAPI, route’lar ve `.env` anahtarları

## Gereksinimler

- Python 3.13+
- Node.js (npm)
- Hesap / API anahtarı: CoinMarketCap, GNews, Supabase  
  (Borsa için Yahoo Finance kullanılır; ekstra anahtar gerekmez.)

## Kurulum

### Backend

Proje kökünden:

```bash
pip install fastapi uvicorn httpx python-dotenv
```

`backend/.env` dosyasını oluştur:

```
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

Supabase Dashboard → **SQL Editor** içinde `supabase/migrations/user_dashboard.sql` dosyasının içeriğini çalıştırın. Bu dosya `user_dashboard_settings` tablosunu, takvim alanını ve RLS politikalarını oluşturur / günceller.

Giriş yapmış kullanıcılar için kaydedilen alanlar:

| Alan | Açıklama |
|------|----------|
| `theme` | `light` / `dark` |
| `modules` | Görünür modül kartları |
| `card_order` | Sürükle-bırak sırası |
| `data_prefs` | Altın, kripto, hisse seçimleri (ABD + BIST) |
| `weather_location` | Şehir veya GPS konumu |

Takvim kayıtları ayrı tabloda tutulur: `user_calendar_items` (başlık, tür, tarih, saat, bildirim, tamamlandı).

## API uçları

| Method | Yol | Kaynak |
|--------|-----|--------|
| GET | `/api/health` | — |
| GET | `/api/weather?latitude=&longitude=` | Open-Meteo |
| GET | `/api/weather/cities` | Sabit şehir listesi |
| GET | `/api/currency` | Frankfurter (USD/EUR/GBP/CHF/JPY/CAD/AUD/CNY/NOK/SEK/DKK/PLN → TRY) |
| GET | `/api/gold` | Genelpara |
| GET | `/api/crypto/{symbol}` | CoinMarketCap (ör. `BTC`) |
| GET | `/api/stock?symbols=` | Yahoo Finance (ör. `AAPL,THYAO.IS,XU100.IS`) |
| GET | `/api/stock/{symbol}` | Yahoo Finance tek sembol (ör. `GARAN.IS`) |
| GET | `/api/news` | GNews (TR, genel) |

Borsa sembolleri Yahoo formatındadır: ABD hisseleri `AAPL`, BIST hisseleri `THYAO.IS`, endeksler `XU100.IS` / `^GSPC`.

CORS, Vite geliştirme portları `5173` ve `5174` için açıktır.

## Özellikler

- Modül kartlarını göster / gizle (Ayarlar)
- Takvim: etkinlik / görev / yapılacak ekleme, tamamlama ve zamanı gelince bildirim
- Altın türü, kripto ve hisse seçimi — ABD + BIST + endeksler (sınıflandırmalar)
- Kart sürükle-bırak sıralama
- Koyu tema
- E-posta ile kayıt ve giriş (Supabase)
- Kullanıcı ayarları Supabase PostgreSQL'de kalıcı (modüller, sıra, tema, altın/kripto/hisse seçimi, hava konumu, takvim)

## Notlar

- Backend’i proje kökünden çalıştır (`uvicorn backend.main:app`).
- Frontend, API adresi için `VITE_API_URL` yoksa `http://127.0.0.1:8000` kullanır.
- Borsa verisi Yahoo Finance üzerinden gelir; API anahtarı gerekmez.
- Haberler için GNews ücretsiz planda e-posta doğrulama / kota limiti olabilir.
