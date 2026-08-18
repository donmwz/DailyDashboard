import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/js/tabler.min.js";
import "./style.css";
import * as bootstrap from "bootstrap";

const API_URL = "http://127.0.0.1:8000";

// ======================================================
// DASHBOARD HTML
// ======================================================

document.querySelector("#app").innerHTML = `
<div class="page">
    <!-- NAVBAR -->
    <header class="navbar navbar-expand-md navbar-light d-print-none sticky-top border-bottom bg-surface shadow-sm">
        <div class="container-xl">
            <a href="#" class="navbar-brand d-flex align-items-center gap-2">
                <div class="p-2 bg-primary-subtle text-primary rounded-2 d-flex align-items-center justify-content-center">
                    <i class="ti ti-layout-dashboard fs-2"></i>
                </div>
                <div>
                    <span class="fw-bold fs-3 tracking-tight d-block lh-1">Daily</span>
                    <span class="fs-6 text-secondary fw-normal">Dashboard</span>
                </div>
            </a>

            <div class="navbar-nav flex-row order-md-last align-items-center gap-2">
                <button class="btn btn-icon btn-ghost-secondary rounded-circle" id="themeToggle" title="Tema Değiştir">
                    <i class="ti ti-moon fs-2" id="themeIcon"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- PAGE WRAPPER -->
    <div class="page-wrapper py-4">
        <div class="container-xl">
            
            <!-- PAGE HEADER -->
            <div class="page-header mb-4">
                <div class="row align-items-center">
                    <div class="col">
                        <h2 class="page-title fs-1 fw-bold">
                            Günaydın 👋
                        </h2>
                        <div class="text-secondary mt-1">
                            Güncel finans, hava ve haber verileri tek ekranda.
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="badge bg-primary-subtle text-primary fs-6 px-3 py-2 rounded-pill shadow-sm" id="currentDate">
                            <i class="ti ti-calendar me-1"></i> --
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODULE SELECTOR BAR -->
            <div class="card mb-4 border-0 shadow-sm">
                <div class="card-body py-2 px-3">
                    <div class="d-flex flex-wrap gap-2 align-items-center" id="moduleSelector">
                        <span class="text-secondary small fw-semibold me-2 d-none d-sm-inline">
                            <i class="ti ti-adjustments me-1"></i> Modüller:
                        </span>
                        <button class="btn btn-sm btn-subtle-primary module-btn active" data-module="weather">
                            <i class="ti ti-cloud me-1"></i> Hava
                        </button>
                        <button class="btn btn-sm btn-subtle-primary module-btn active" data-module="currency">
                            <i class="ti ti-currency-dollar me-1"></i> Döviz
                        </button>
                        <button class="btn btn-sm btn-subtle-primary module-btn active" data-module="gold">
                            <i class="ti ti-coins me-1"></i> Altın
                        </button>
                        <button class="btn btn-sm btn-subtle-primary module-btn active" data-module="crypto">
                            <i class="ti ti-brand-bitcoin me-1"></i> Kripto
                        </button>
                        <button class="btn btn-sm btn-subtle-primary module-btn active" data-module="stocks">
                            <i class="ti ti-chart-line me-1"></i> Borsa
                        </button>
                        <button class="btn btn-sm btn-subtle-primary module-btn active" data-module="news">
                            <i class="ti ti-news me-1"></i> Haberler
                        </button>
                    </div>
                </div>
            </div>

            <!-- DASHBOARD GRID -->
            <div class="row row-cards g-3">

                <!-- WEATHER MODULE -->
                <div class="col-lg-5 col-md-12 module-card" data-module-card="weather">
                    <div class="card card-hover shadow-sm h-100 overflow-hidden border-0">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <span class="badge bg-blue-lt mb-2">Hava Durumu</span>
                                        <h3 class="card-title fs-2 fw-bold mb-0" id="weatherCity">İstanbul</h3>
                                    </div>
                                    <div class="weather-icon-wrapper p-3 bg-light rounded-circle text-primary">
                                        <i class="ti ti-sun fs-1" id="weatherIcon"></i>
                                    </div>
                                </div>

                                <div class="my-4">
                                    <div class="display-3 fw-bold text-dark lh-1" id="weatherTemperature">--°</div>
                                    <div class="text-secondary mt-2 fs-4" id="weatherCondition">
                                        Veriler yükleniyor...
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="row text-center g-2 p-3 bg-body-tertiary rounded-3 mb-3">
                                    <div class="col-4 border-end">
                                        <div class="text-secondary small">Nem</div>
                                        <strong class="fs-5" id="weatherHumidity">--%</strong>
                                    </div>
                                    <div class="col-4 border-end">
                                        <div class="text-secondary small">Hissedilen</div>
                                        <strong class="fs-5" id="weatherFeelsLike">--°</strong>
                                    </div>
                                    <div class="col-4">
                                        <div class="text-secondary small">Rüzgar</div>
                                        <strong class="fs-5" id="weatherWind">-- km/h</strong>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between align-items-center pt-2">
                                    <span class="text-secondary extra-small" id="weatherUpdated"></span>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-primary" id="locationButton" title="Konumumu Kullan">
                                            <i class="ti ti-map-pin"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary" id="cityButton">
                                            <i class="ti ti-building me-1"></i> Şehir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CURRENCY MODULE -->
                <div class="col-lg-7 col-md-12 module-card" data-module-card="currency">
                    <div class="card card-hover shadow-sm h-100 border-0">
                        <div class="card-header bg-transparent border-bottom-0 pb-0">
                            <h3 class="card-title fw-bold">
                                <i class="ti ti-currency-dollar text-primary me-2"></i>Döviz Kurları
                            </h3>
                        </div>
                        <div class="table-responsive">
                            <table class="table card-table table-vcenter text-nowrap">
                                <thead>
                                    <tr>
                                        <th>Parite</th>
                                        <th>Kur</th>
                                        <th class="text-end">Durum</th>
                                    </tr>
                                </thead>
                                <tbody id="currencyTableBody">
                                    <tr>
                                        <td colspan="3" class="text-center py-4">
                                            <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                                            Kurlar yükleniyor...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- GOLD MODULE -->
                <div class="col-lg-7 col-md-12 module-card" data-module-card="gold">
                    <div class="card card-hover shadow-sm h-100 border-0">
                        <div class="card-header bg-transparent border-bottom-0 pb-0">
                            <h3 class="card-title fw-bold">
                                <i class="ti ti-coins text-warning me-2"></i>Altın Fiyatları
                            </h3>
                        </div>
                        <div class="table-responsive">
                            <table class="table card-table table-vcenter text-nowrap">
                                <thead>
                                    <tr>
                                        <th>Ürün</th>
                                        <th>Alış</th>
                                        <th>Satış / Değişim</th>
                                    </tr>
                                </thead>
                                <tbody id="goldTableBody">
                                    <tr>
                                        <td colspan="3" class="text-center py-4">
                                            <div class="spinner-border spinner-border-sm text-warning me-2"></div>
                                            Altın fiyatları yükleniyor...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- CRYPTO MODULE -->
                <div class="col-lg-5 col-md-12 module-card" data-module-card="crypto">
                    <div class="card card-hover shadow-sm h-100 border-0">
                        <div class="card-header bg-transparent border-bottom-0 pb-0">
                            <h3 class="card-title fw-bold">
                                <i class="ti ti-brand-bitcoin text-orange me-2"></i>Kripto Varlıklar
                            </h3>
                        </div>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item py-3">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <span class="avatar bg-orange-lt rounded-circle">₿</span>
                                    </div>
                                    <div class="col">
                                        <strong class="d-block">Bitcoin</strong>
                                        <span class="text-secondary small">BTC</span>
                                    </div>
                                    <div class="col-auto text-end">
                                        <strong class="d-block">$112,450</strong>
                                        <span class="badge bg-green-lt">+2.41%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item py-3">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <span class="avatar bg-blue-lt rounded-circle">Ξ</span>
                                    </div>
                                    <div class="col">
                                        <strong class="d-block">Ethereum</strong>
                                        <span class="text-secondary small">ETH</span>
                                    </div>
                                    <div class="col-auto text-end">
                                        <strong class="d-block">$4,280</strong>
                                        <span class="badge bg-red-lt">-0.82%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STOCKS MODULE -->
                <div class="col-lg-5 col-md-12 module-card" data-module-card="stocks">
                    <div class="card card-hover shadow-sm h-100 border-0">
                        <div class="card-header bg-transparent border-bottom-0 pb-0">
                            <h3 class="card-title fw-bold">
                                <i class="ti ti-chart-line text-success me-2"></i>Borsa Takip
                            </h3>
                        </div>
                        <div class="card-body" id="stockList">
                            <div class="text-center py-4 text-secondary">
                                <div class="spinner-border spinner-border-sm me-2"></div>
                                Hisse fiyatları yükleniyor...
                            </div>
                        </div>
                    </div>
                </div>

                <!-- NEWS MODULE -->
                <div class="col-lg-7 col-md-12 module-card" data-module-card="news">
                    <div class="card card-hover shadow-sm h-100 border-0">
                        <div class="card-header bg-transparent">
                            <div class="w-100">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <h3 class="card-title fw-bold mb-0">
                                        <i class="ti ti-news text-info me-2"></i>Son Dakika Haberleri
                                    </h3>
                                    <button class="btn btn-sm btn-icon btn-ghost-secondary rounded-circle" id="refreshNews" title="Yenile">
                                        <i class="ti ti-refresh"></i>
                                    </button>
                                </div>
                                <div class="d-flex flex-wrap gap-1 mt-2" id="newsSourceFilters">
                                    <button class="btn btn-xs btn-primary news-source-btn active" data-source="all">Tümü</button>
                                </div>
                                <div class="text-secondary extra-small mt-2" id="newsUpdated">
                                    Son güncelleme bekleniyor...
                                </div>
                            </div>
                        </div>
                        <div class="list-group list-group-flush overflow-auto" style="max-height: 480px;" id="newsList">
                            <div class="list-group-item text-center py-5">
                                <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                                Haberler yükleniyor...
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer class="footer footer-transparent border-top py-3">
        <div class="container-xl">
            <div class="text-center text-secondary small">
                Daily Dashboard &copy; ${new Date().getFullYear()} — Tüm hakları saklıdır.
            </div>
        </div>
    </footer>
</div>

<!-- CITY MODAL -->
<div class="modal modal-blur fade" id="cityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Şehir Seç</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <label class="form-label">Şehir Listesi</label>
                <select class="form-select" id="citySelect">
                    <option value="">Seçiniz...</option>
                </select>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary w-100" id="saveCity">Kaydet ve Güncelle</button>
            </div>
        </div>
    </div>
</div>
`;

// ======================================================
// DATE MANAGEMENT
// ======================================================
function updateDate() {
    const dateElement = document.querySelector("#currentDate");
    if (dateElement) {
        const now = new Date();
        dateElement.innerHTML = `<i class="ti ti-calendar me-1"></i> ${now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`;
    }
}
updateDate();

// ======================================================
// MODULE SYSTEM
// ======================================================
const moduleButtons = document.querySelectorAll(".module-btn");
const savedModules = JSON.parse(localStorage.getItem("dashboardModules"));
const activeModules = savedModules || ["weather", "currency", "gold", "crypto", "stocks", "news"];

moduleButtons.forEach((button) => {
    const moduleName = button.dataset.module;
    const card = document.querySelector(`[data-module-card="${moduleName}"]`);
    const isActive = activeModules.includes(moduleName);

    if (isActive) {
        button.classList.add("active");
        card?.classList.remove("d-none");
    } else {
        button.classList.remove("active");
        card?.classList.add("d-none");
    }
});

moduleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const moduleName = button.dataset.module;
        const card = document.querySelector(`[data-module-card="${moduleName}"]`);

        button.classList.toggle("active");
        card?.classList.toggle("d-none");

        const currentModules = [];
        moduleButtons.forEach((btn) => {
            if (btn.classList.contains("active")) {
                currentModules.push(btn.dataset.module);
            }
        });
        localStorage.setItem("dashboardModules", JSON.stringify(currentModules));
    });
});

// ======================================================
// THEME SWITCHER
// ======================================================
const themeButton = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.setAttribute("data-bs-theme", "dark");
        themeIcon.className = "ti ti-sun fs-2 text-warning";
    } else {
        document.body.removeAttribute("data-bs-theme");
        themeIcon.className = "ti ti-moon fs-2";
    }
}

const savedTheme = localStorage.getItem("dashboardTheme") || "light";
applyTheme(savedTheme);

themeButton.addEventListener("click", () => {
    const currentTheme = document.body.hasAttribute("data-bs-theme") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("dashboardTheme", newTheme);
    applyTheme(newTheme);
});

// ======================================================
// WEATHER API
// ======================================================
async function loadWeather(latitude, longitude, cityName = null) {
    const temperature = document.querySelector("#weatherTemperature");
    const condition = document.querySelector("#weatherCondition");
    const humidity = document.querySelector("#weatherHumidity");
    const feelsLike = document.querySelector("#weatherFeelsLike");
    const wind = document.querySelector("#weatherWind");
    const city = document.querySelector("#weatherCity");
    const updated = document.querySelector("#weatherUpdated");

    try {
        condition.textContent = "Güncelleniyor...";
        const response = await fetch(`${API_URL}/api/weather?latitude=${latitude}&longitude=${longitude}`);

        if (!response.ok) throw new Error("Hava durumu verisi alınamadı.");

        const data = await response.json();

        temperature.textContent = `${Math.round(data.temperature)}°`;
        humidity.textContent = `${data.humidity}%`;
        feelsLike.textContent = `${Math.round(data.feels_like)}°`;
        wind.textContent = `${Math.round(data.wind_speed)} km/h`;
        condition.textContent = getWeatherDescription(data.weather_code);

        if (cityName) city.textContent = cityName;
        updated.textContent = `Son güncelleme: ${formatWeatherTime(data.time)}`;
        updateWeatherIcon(data.weather_code);

    } catch (error) {
        console.error("Hava durumu hatası:", error);
        temperature.textContent = "--°";
        humidity.textContent = "--%";
        feelsLike.textContent = "--°";
        wind.textContent = "-- km/h";
        condition.textContent = "Veri alınamadı";
        updated.textContent = "Ulaşılamadı";
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Açık", 1: "Çoğunlukla Açık", 2: "Parçalı Bulutlu", 3: "Kapalı",
        45: "Sisli", 48: "Yoğun Sis", 51: "Hafif Çiseleme", 53: "Çiseleme",
        55: "Yoğun Çiseleme", 61: "Hafif Yağmurlu", 63: "Yağmurlu", 65: "Kuvvetli Yağmur",
        71: "Hafif Kar Yağışlı", 73: "Kar Yağışlı", 75: "Yoğun Kar", 80: "Sağanak Yağışlı",
        81: "Kuvvetli Sağanak", 82: "Şiddetli Sağanak", 95: "Gök Gürültülü Fırtına"
    };
    return weatherCodes[code] || "Bilinmiyor";
}

function updateWeatherIcon(code) {
    const icon = document.querySelector("#weatherIcon");
    if (!icon) return;

    let iconClass = "ti ti-sun";
    if (code === 0) iconClass = "ti ti-sun text-warning";
    else if (code === 1 || code === 2) iconClass = "ti ti-cloud-sun text-warning";
    else if (code === 3) iconClass = "ti ti-cloud text-secondary";
    else if (code >= 45 && code <= 48) iconClass = "ti ti-cloud-fog text-muted";
    else if (code >= 51 && code <= 67) iconClass = "ti ti-cloud-rain text-primary";
    else if (code >= 71 && code <= 77) iconClass = "ti ti-snowflake text-info";
    else if (code >= 80 && code <= 82) iconClass = "ti ti-cloud-storm text-primary";
    else if (code >= 95) iconClass = "ti ti-cloud-storm text-danger";

    icon.className = `${iconClass} fs-1`;
}

function formatWeatherTime(time) {
    if (!time) return "";
    return new Date(time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function useCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Tarayıcınız konum özelliğini desteklemiyor.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem("weatherLocation", JSON.stringify({ type: "gps", latitude, longitude }));
            await loadWeather(latitude, longitude, "Mevcut Konum");
        },
        (error) => {
            console.error("Konum hatası:", error);
            alert("Konum alınamadı. İzin verildiğinden emin olun.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
}

document.querySelector("#locationButton")?.addEventListener("click", useCurrentLocation);

async function loadCities() {
    const select = document.querySelector("#citySelect");
    if (!select) return;

    try {
        const response = await fetch(`${API_URL}/api/weather/cities`);
        if (!response.ok) throw new Error("Şehirler alınamadı.");

        const cities = await response.json();
        cities.forEach((city) => {
            const option = document.createElement("option");
            option.value = city.name;
            option.textContent = city.name;
            option.dataset.latitude = city.latitude;
            option.dataset.longitude = city.longitude;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Şehirler yüklenemedi:", error);
    }
}
loadCities();

const cityModalElement = document.querySelector("#cityModal");
const cityModal = new bootstrap.Modal(cityModalElement);

document.querySelector("#cityButton")?.addEventListener("click", () => cityModal.show());

document.querySelector("#saveCity")?.addEventListener("click", async () => {
    const select = document.querySelector("#citySelect");
    const option = select.options[select.selectedIndex];

    if (!option.value) return;

    const { latitude, longitude } = option.dataset;
    const cityName = option.value;

    localStorage.setItem("weatherLocation", JSON.stringify({ type: "city", city: cityName, latitude, longitude }));
    await loadWeather(latitude, longitude, cityName);
    cityModal.hide();
});

async function initializeWeather() {
    const saved = localStorage.getItem("weatherLocation");
    if (saved) {
        try {
            const location = JSON.parse(saved);
            await loadWeather(location.latitude, location.longitude, location.type === "city" ? location.city : "Mevcut Konum");
            return;
        } catch (error) {
            console.error("Kayıtlı konum okunamadı:", error);
        }
    }
    await loadWeather(41.0082, 28.9784, "İstanbul");
}

// ======================================================
// STOCKS API
// ======================================================
async function loadStocks() {
    const stockList = document.getElementById("stockList");
    if (!stockList) return;

    const symbols = ["THYAO", "AAPL", "IBM"];

    try {
        const responses = await Promise.allSettled(
            symbols.map(async (symbol) => {
                const response = await fetch(`${API_URL}/api/stock/${symbol}`);
                if (!response.ok) throw new Error(`${symbol} verisi alınamadı.`);
                return response.json();
            })
        );

        const validStocks = responses.filter((r) => r.status === "fulfilled").map((r) => r.value);
        if (!validStocks.length) throw new Error("Hiçbir hisse verisi alınamadı.");

        stockList.innerHTML = "";

        validStocks.forEach((data) => {
            const symbol = data?.symbol || "UNKNOWN";
            const price = Number(data?.close ?? data?.last_price ?? 0);
            const change = Number(data?.change ?? 0);
            const isPositive = change >= 0;

            const row = document.createElement("div");
            row.className = "d-flex justify-content-between align-items-center py-2 border-bottom last-border-0";
            row.innerHTML = `
                <div>
                    <strong class="d-block fs-4">${symbol}</strong>
                </div>
                <div class="text-end">
                    <div class="fw-bold fs-4">${price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</div>
                    <span class="badge ${isPositive ? "bg-green-lt" : "bg-red-lt"} small">
                        <i class="ti ${isPositive ? "ti-trending-up" : "ti-trending-down"} me-1"></i>
                        ${isPositive ? "+" : ""}${change.toFixed(2)}%
                    </span>
                </div>
            `;
            stockList.appendChild(row);
        });

    } catch (error) {
        console.error("Stok yükleme hatası:", error);
        stockList.innerHTML = `<div class="text-danger text-center py-3"><i class="ti ti-alert-circle me-1"></i> Veriler yüklenemedi.</div>`;
    }
}

// ======================================================
// CURRENCY API
// ======================================================
async function loadCurrencyRates() {
    const tableBody = document.getElementById("currencyTableBody");
    if (!tableBody) return;

    try {
        const response = await fetch(`${API_URL}/api/currency`);
        if (!response.ok) throw new Error(`API ${response.status} hatası`);

        const data = await response.json();
        tableBody.innerHTML = "";

        for (const [currency, info] of Object.entries(data.rates)) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <span class="avatar avatar-xs bg-primary-subtle text-primary rounded-circle me-2 fw-bold">
                            ${info.symbol || "$"}
                        </span>
                        <div>
                            <strong class="d-block">${currency} / TRY</strong>
                            <span class="text-secondary small">${info.name}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <strong class="fs-4">${Number(info.rate).toFixed(2)} ₺</strong>
                </td>
                <td class="text-end">
                    <span class="badge bg-green-lt rounded-pill">Güncel</span>
                </td>
            `;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Döviz yükleme hatası:", error);
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-4"><i class="ti ti-alert-circle me-1"></i> Döviz verileri alınamadı.</td></tr>`;
    }
}

// ======================================================
// GOLD API
// ======================================================
async function loadGold() {
    const tableBody = document.getElementById("goldTableBody");
    if (!tableBody) return;

    try {
        const response = await fetch(`${API_URL}/api/gold`);
        if (!response.ok) throw new Error(`Gold API: ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error("API hatası");

        const goldData = result.data;
        tableBody.innerHTML = "";

        const goldNames = {
            GA: "Gram Altın", C: "Çeyrek Altın", Y: "Yarım Altın",
            T: "Tam Altın", CMR: "Cumhuriyet Altını", XAUUSD: "Ons Altın"
        };

        Object.entries(goldData).forEach(([symbol, item]) => {
            const name = goldNames[symbol] || symbol;
            const currency = item.kur === "USD" ? "$" : "₺";
            const alis = Number(item.alis).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const satis = Number(item.satis).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const degisim = Number(item.degisim);
            const isPositive = degisim >= 0;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <span class="avatar avatar-xs bg-warning-subtle text-warning rounded-circle me-2 fw-bold">
                            ${item.sembol || "Au"}
                        </span>
                        <div>
                            <strong class="d-block">${name}</strong>
                            <span class="text-secondary small">${symbol}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="text-secondary">${alis} ${currency}</span>
                </td>
                <td>
                    <strong class="d-block fs-4">${satis} ${currency}</strong>
                    <span class="${isPositive ? "text-green" : "text-red"} small">
                        <i class="ti ${isPositive ? "ti-trending-up" : "ti-trending-down"} me-1"></i>${item.degisim}%
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Altın yükleme hatası:", error);
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-4"><i class="ti ti-alert-circle me-1"></i> Altın fiyatları alınamadı.</td></tr>`;
    }
}

// ======================================================
// NEWS API
// ======================================================
let allNews = [];
let selectedNewsSource = "all";

const FALLBACK_NEWS = [
    { title: "TCMB faiz kararına odaklandı", description: "Piyasalarda haftanın odağı Merkez Bankası toplantısı oldu.", source: "Ekonomi", url: "#" },
    { title: "BIST günü artı bölgede kapattı", description: "Borsa İstanbul alıcılı seyirle kapanış yaptı.", source: "Borsa", url: "#" }
];

async function loadNews() {
    const newsList = document.querySelector("#newsList");
    if (!newsList) return;

    newsList.innerHTML = `<div class="list-group-item text-center py-5"><div class="spinner-border spinner-border-sm text-primary me-2"></div>Haberler yükleniyor...</div>`;

    try {
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error("API Hatası");

        const data = await response.json();
        allNews = Array.isArray(data.articles) && data.articles.length ? data.articles : FALLBACK_NEWS;

        document.querySelector("#newsUpdated").textContent = `Son güncelleme: ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
        buildNewsSourceFilters();
        renderNews();
    } catch (error) {
        console.error("Haber hatası:", error);
        allNews = FALLBACK_NEWS;
        document.querySelector("#newsUpdated").textContent = "Yedek içerik gösteriliyor";
        buildNewsSourceFilters();
        renderNews();
    }
}

function buildNewsSourceFilters() {
    const filters = document.querySelector("#newsSourceFilters");
    if (!filters) return;

    const sources = [...new Set(allNews.map((n) => n.source).filter(Boolean))].slice(0, 5);
    const buttons = ["all", ...sources].map((source) => {
        const isActive = selectedNewsSource === source;
        return `<button class="btn btn-xs ${isActive ? "btn-primary active" : "btn-outline-secondary"} news-source-btn" data-source="${escapeHtml(source)}" type="button">${escapeHtml(source === "all" ? "Tümü" : source)}</button>`;
    });
    filters.innerHTML = buttons.join("");
}

function renderNews() {
    const newsList = document.querySelector("#newsList");
    if (!newsList) return;

    let filteredNews = selectedNewsSource === "all" ? allNews : allNews.filter((n) => n.source === selectedNewsSource);

    if (!filteredNews.length) {
        newsList.innerHTML = `<div class="list-group-item text-center py-5 text-secondary">Haber bulunamadı.</div>`;
        return;
    }

    newsList.innerHTML = "";
    filteredNews.forEach((article) => {
        const item = document.createElement(article.url ? "a" : "div");
        if (article.url) {
            item.href = article.url;
            item.target = "_blank";
            item.className = "list-group-item list-group-item-action py-3";
        } else {
            item.className = "list-group-item py-3";
        }

        item.innerHTML = `
            <div class="row align-items-center g-2">
                ${article.image ? `<div class="col-auto"><img src="${article.image}" class="rounded-2 object-cover" width="60" height="60" alt="" loading="lazy"></div>` : ""}
                <div class="col">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge bg-blue-lt small">${escapeHtml(article.source || "Haber")}</span>
                    </div>
                    <strong class="d-block text-body fs-4 lh-sm">${escapeHtml(article.title || "")}</strong>
                    ${article.description ? `<p class="text-secondary small mb-0 mt-1 text-truncate">${escapeHtml(stripHtml(article.description))}</p>` : ""}
                </div>
            </div>
        `;
        newsList.appendChild(item);
    });
}

function stripHtml(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html || "";
    return temp.textContent || temp.innerText || "";
}

function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

document.querySelector("#newsSourceFilters")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".news-source-btn");
    if (!btn) return;
    selectedNewsSource = btn.dataset.source || "all";
    buildNewsSourceFilters();
    renderNews();
});

document.querySelector("#refreshNews")?.addEventListener("click", async () => {
    const btn = document.querySelector("#refreshNews");
    btn.disabled = true;
    await loadNews();
    btn.disabled = false;
});

// INITIALIZATIONS
initializeWeather();
loadCurrencyRates();
loadStocks();
loadGold();
loadNews();