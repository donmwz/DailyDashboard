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
    <header class="navbar navbar-expand-md">

        <div class="container-xl">

            <div class="navbar-brand">
                <i class="ti ti-layout-dashboard"></i>
                <span>Daily Dashboard</span>
            </div>

            <div class="navbar-nav flex-row order-md-last">

                <button
                    class="btn btn-icon"
                    id="themeToggle"
                    title="Tema değiştir"
                >
                    <i class="ti ti-moon"></i>
                </button>

            </div>

        </div>

    </header>


    <!-- PAGE -->
    <div class="page-wrapper">

        <div class="container-xl">


            <!-- HEADER -->
            <div class="page-header d-print-none">

                <div class="row align-items-center">

                    <div class="col">

                        <h2 class="page-title">
                            Günaydın 👋
                        </h2>

                        <div class="text-secondary">
                            Güncel bilgileri tek yerden takip et.
                        </div>

                    </div>

                    <div class="col-auto">

                        <div
                            class="text-secondary"
                            id="currentDate"
                        >
                        </div>

                    </div>

                </div>

            </div>


            <!-- MODULE SELECTOR -->
            <div class="module-selector mb-4">

                <button
                    class="module-btn active"
                    data-module="weather"
                >
                    <i class="ti ti-cloud"></i>
                    Hava
                </button>


                <button
                    class="module-btn active"
                    data-module="currency"
                >
                    <i class="ti ti-currency-dollar"></i>
                    Döviz
                </button>


                <button
                    class="module-btn active"
                    data-module="gold"
                >
                    <i class="ti ti-coins"></i>
                    Altın
                </button>


                <button
                    class="module-btn active"
                    data-module="crypto"
                >
                    <i class="ti ti-brand-bitcoin"></i>
                    Kripto
                </button>


                <button
                    class="module-btn active"
                    data-module="stocks"
                >
                    <i class="ti ti-chart-line"></i>
                    Borsa
                </button>


                <button
                    class="module-btn active"
                    data-module="news"
                >
                    <i class="ti ti-news"></i>
                    Haberler
                </button>

            </div>


            <!-- DASHBOARD -->
            <div class="row row-cards">


                <!-- ================================= -->
                <!-- WEATHER -->
                <!-- ================================= -->

                <div
                    class="col-lg-5 module-card"
                    data-module-card="weather"
                >

                    <div class="card weather-card">

                        <div class="card-body">


                            <div class="d-flex justify-content-between">

                                <div>

                                    <div class="text-secondary">
                                        Hava Durumu
                                    </div>

                                    <h3
                                        class="card-title"
                                        id="weatherCity"
                                    >
                                        İstanbul
                                    </h3>

                                </div>


                                <div class="weather-icon">

                                    <i
                                        class="ti ti-sun"
                                        id="weatherIcon"
                                    ></i>

                                </div>

                            </div>


                            <!-- TEMPERATURE -->

                            <div
                                class="weather-temperature"
                                id="weatherTemperature"
                            >
                                --°
                            </div>


                            <!-- CONDITION -->

                            <div
                                class="text-secondary"
                                id="weatherCondition"
                            >
                                Veriler yükleniyor...
                            </div>


                            <!-- WEATHER DETAILS -->

                            <div class="row mt-4">


                                <!-- HUMIDITY -->

                                <div class="col">

                                    <div class="text-secondary">
                                        Nem
                                    </div>

                                    <strong id="weatherHumidity">
                                        --%
                                    </strong>

                                </div>


                                <!-- FEELS LIKE -->

                                <div class="col">

                                    <div class="text-secondary">
                                        Hissedilen
                                    </div>

                                    <strong id="weatherFeelsLike">
                                        --°
                                    </strong>

                                </div>


                                <!-- WIND -->

                                <div class="col">

                                    <div class="text-secondary">
                                        Rüzgar
                                    </div>

                                    <strong id="weatherWind">
                                        -- km/h
                                    </strong>

                                </div>

                            </div>


                            <!-- UPDATE TIME -->

                            <div
                                class="text-secondary mt-3"
                                id="weatherUpdated"
                            >
                            </div>


                            <!-- LOCATION BUTTONS -->

                            <div class="mt-4">

                                <button
                                    class="btn btn-outline-primary"
                                    id="locationButton"
                                >
                                    <i class="ti ti-map-pin"></i>
                                    Konumumu Kullan
                                </button>


                                <button
                                    class="btn btn-outline-secondary"
                                    id="cityButton"
                                >
                                    <i class="ti ti-building"></i>
                                    Şehir Seç
                                </button>

                            </div>

                        </div>

                    </div>

                </div>



                <!-- ================================= -->
                <!-- CURRENCY -->
                <!-- ================================= -->

                <div
                    class="col-lg-7 module-card"
                    data-module-card="currency"
                >

                    <div class="card">

                        <div class="card-header">

                            <h3 class="card-title">

                                <i class="ti ti-currency-dollar"></i>

                                Döviz Kurları

                            </h3>

                        </div>


                        <div class="table-responsive">

                            <table class="table card-table table-vcenter">

                                <thead>

                                    <tr>
                                        <th>Parite</th>
                                        <th>Kur</th>
                                        <th>Tarih</th>
                                    </tr>

                                </thead>


                                <tbody id="currencyTableBody">

                                    <tr>
                                        <td colspan="3" class="text-center">
                                            Kurlar yukleniyor...
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>


                <!-- ================================= -->
                <!-- GOLD -->
                <!-- ================================= -->

                <div
                    class="col-lg-7 module-card"
                    data-module-card="gold"
                >

                    <div class="card">

                        <div class="card-header">

                            <h3 class="card-title">

                                <i class="ti ti-coins"></i>

                                Altın Fiyatları

                            </h3>

                        </div>


                        <div class="table-responsive">

                            <table class="table card-table table-vcenter">

                                <thead>

                                    <tr>
                                        <th>Ürün</th>
                                        <th>Alış</th>
                                        <th>Satış</th>
                                    </tr>

                                </thead>


                                <tbody id="goldTableBody">

                                    <tr>
                                        <td colspan="3" class="text-center">
                                            Altın fiyatları yükleniyor...
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
                <!-- ================================= -->
                <!-- CRYPTO -->
                <!-- ================================= -->

                <div
                    class="col-lg-7 module-card"
                    data-module-card="crypto"
                >

                    <div class="card">

                        <div class="card-header">

                            <h3 class="card-title">

                                <i class="ti ti-brand-bitcoin"></i>

                                Kripto

                            </h3>

                        </div>


                        <div
                            class="list-group list-group-flush"
                        >


                            <!-- BITCOIN -->

                            <div class="list-group-item">

                                <div class="row align-items-center">

                                    <div class="col-auto">

                                        <span
                                            class="avatar bg-orange-lt"
                                        >
                                            ₿
                                        </span>

                                    </div>


                                    <div class="col">

                                        <strong>
                                            Bitcoin
                                        </strong>

                                        <div class="text-secondary">
                                            BTC
                                        </div>

                                    </div>


                                    <div
                                        class="col-auto text-end"
                                    >

                                        <strong>
                                            $112,450
                                        </strong>

                                        <div class="text-green">
                                            +2.41%
                                        </div>

                                    </div>

                                </div>

                            </div>



                            <!-- ETHEREUM -->

                            <div class="list-group-item">

                                <div class="row align-items-center">

                                    <div class="col-auto">

                                        <span
                                            class="avatar bg-blue-lt"
                                        >
                                            Ξ
                                        </span>

                                    </div>


                                    <div class="col">

                                        <strong>
                                            Ethereum
                                        </strong>

                                        <div class="text-secondary">
                                            ETH
                                        </div>

                                    </div>


                                    <div
                                        class="col-auto text-end"
                                    >

                                        <strong>
                                            $4,280
                                        </strong>

                                        <div class="text-red">
                                            -0.82%
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>



                <!-- ================================= -->
                <!-- STOCKS -->
                <!-- ================================= -->

                <div
                    class="col-lg-5 module-card"
                    data-module-card="stocks"
                >

                    <div class="card">

                        <div class="card-header">

                            <h3 class="card-title">

                                <i class="ti ti-chart-line"></i>

                                Borsa

                            </h3>

                        </div>


                        <div class="card-body">


                            <div class="stock-item">

                                <span>
                                    THYAO
                                </span>

                                <strong>
                                    312.40 ₺
                                </strong>

                                <span class="text-green">
                                    +1.24%
                                </span>

                            </div>


                            <div class="stock-item">

                                <span>
                                    ASELS
                                </span>

                                <strong>
                                    168.20 ₺
                                </strong>

                                <span class="text-green">
                                    +0.74%
                                </span>

                            </div>


                            <div class="stock-item">

                                <span>
                                    TUPRS
                                </span>

                                <strong>
                                    192.80 ₺
                                </strong>

                                <span class="text-red">
                                    -0.32%
                                </span>

                            </div>

                        </div>

                    </div>

                </div>



                <!-- ================================= -->
                <!-- NEWS -->
                <!-- ================================= -->

                <!-- ================================= -->
<!-- NEWS -->
<!-- ================================= -->

<div
    class="col-12 module-card"
    data-module-card="news"
>

    <div class="card">

        <div class="card-header">

            <div class="d-flex flex-column w-100">

                <div class="d-flex align-items-center justify-content-between">

                    <h3 class="card-title mb-0">

                        <i class="ti ti-news"></i>

                        Son Dakika Haberleri

                    </h3>

                    <button
                        class="btn btn-sm btn-ghost-secondary"
                        id="refreshNews"
                        title="Haberleri yenile"
                    >

                        <i class="ti ti-refresh"></i>

                    </button>

                </div>


                <!-- KAYNAK FİLTRESİ -->

                <div
                    class="btn-list mt-3"
                    id="newsSourceFilters"
                >

                    <button
                        class="btn btn-sm btn-primary news-source-btn active"
                        data-source="all"
                    >
                        Tumu
                    </button>

                </div>


                <div
                    class="text-secondary mt-2 news-updated"
                    id="newsUpdated"
                >
                    Son guncelleme bekleniyor...
                </div>

            </div>

        </div>


        <!-- HABERLER -->

        <div
            class="list-group list-group-flush"
            id="newsList"
        >

            <div class="list-group-item text-center py-5">

                <div class="spinner-border spinner-border-sm me-2"></div>

                Haberler yükleniyor...

            </div>

        </div>

    </div>

</div>
        <!-- FOOTER -->

        <footer class="footer footer-transparent">

            <div class="container-xl">

                <div class="text-center text-secondary">
                    Daily Dashboard
                </div>

            </div>

        </footer>

    </div>

</div>


<!-- ================================= -->
<!-- CITY MODAL -->
<!-- ================================= -->

<div
    class="modal modal-blur fade"
    id="cityModal"
    tabindex="-1"
>

    <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content">


            <div class="modal-header">

                <h5 class="modal-title">
                    Şehir Seç
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                ></button>

            </div>


            <div class="modal-body">

                <label class="form-label">
                    Şehir
                </label>

                <select
                    class="form-select"
                    id="citySelect"
                >

                    <option value="">
                        Şehir seçin
                    </option>

                </select>

            </div>


            <div class="modal-footer">

                <button
                    class="btn btn-primary"
                    id="saveCity"
                >
                    Kaydet
                </button>

            </div>


        </div>

    </div>

</div>

`;


// ======================================================
// DATE
// ======================================================

function updateDate() {

    const dateElement =
        document.querySelector("#currentDate");

    const now = new Date();

    dateElement.textContent =
        now.toLocaleDateString(
            "tr-TR",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}

updateDate();


// ======================================================
// MODULE SYSTEM
// ======================================================

const moduleButtons =
    document.querySelectorAll(".module-btn");


const savedModules =
    JSON.parse(
        localStorage.getItem("dashboardModules")
    );


const activeModules =
    savedModules || [
        "weather",
        "currency",
        "gold",
        "crypto",
        "stocks",
        "news"
    ];


// Sayfa açılırken modül durumlarını uygula

moduleButtons.forEach((button) => {

    const moduleName =
        button.dataset.module;

    const card =
        document.querySelector(
            `[data-module-card="${moduleName}"]`
        );


    const isActive =
        activeModules.includes(moduleName);


    if (isActive) {

        button.classList.add("active");

        card?.classList.remove("hidden");

    } else {

        button.classList.remove("active");

        card?.classList.add("hidden");

    }

});


// Modül butonları

moduleButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const moduleName =
                button.dataset.module;

            const card =
                document.querySelector(
                    `[data-module-card="${moduleName}"]`
                );


            button.classList.toggle("active");


            if (
                button.classList.contains("active")
            ) {

                card?.classList.remove("hidden");

            } else {

                card?.classList.add("hidden");

            }


            // Aktif modülleri kaydet

            const currentModules = [];


            moduleButtons.forEach((btn) => {

                if (
                    btn.classList.contains("active")
                ) {

                    currentModules.push(
                        btn.dataset.module
                    );

                }

            });


            localStorage.setItem(
                "dashboardModules",
                JSON.stringify(currentModules)
            );

        }
    );

});


// ======================================================
// WEATHER
// ======================================================

async function loadWeather(
    latitude,
    longitude,
    cityName = null
) {

    const temperature =
        document.querySelector(
            "#weatherTemperature"
        );

    const condition =
        document.querySelector(
            "#weatherCondition"
        );

    const humidity =
        document.querySelector(
            "#weatherHumidity"
        );

    const feelsLike =
        document.querySelector(
            "#weatherFeelsLike"
        );

    const wind =
        document.querySelector(
            "#weatherWind"
        );

    const city =
        document.querySelector(
            "#weatherCity"
        );

    const updated =
        document.querySelector(
            "#weatherUpdated"
        );


    try {

        condition.textContent =
            "Veriler yükleniyor...";


        const response =
            await fetch(
                `${API_URL}/api/weather?latitude=${latitude}&longitude=${longitude}`
            );


        if (!response.ok) {

            throw new Error(
                "Hava durumu alınamadı."
            );

        }


        const data =
            await response.json();


        temperature.textContent =
            `${Math.round(data.temperature)}°`;


        humidity.textContent =
            `${data.humidity}%`;


        feelsLike.textContent =
            `${Math.round(data.feels_like)}°`;


        wind.textContent =
            `${Math.round(data.wind_speed)} km/h`;


        condition.textContent =
            getWeatherDescription(
                data.weather_code
            );


        if (cityName) {

            city.textContent =
                cityName;

        }


        updated.textContent =
            `Son güncelleme: ${formatWeatherTime(data.time)}`;


        updateWeatherIcon(
            data.weather_code
        );


    } catch (error) {

        console.error(
            "Hava durumu hatası:",
            error
        );


        temperature.textContent =
            "--°";


        humidity.textContent =
            "--%";


        feelsLike.textContent =
            "--°";


        wind.textContent =
            "-- km/h";


        condition.textContent =
            "Hava durumu alınamadı";


        updated.textContent =
            "Veri kaynağına ulaşılamadı";

    }

}


// ======================================================
// WEATHER DESCRIPTION
// ======================================================

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Açık",

        1: "Çoğunlukla açık",

        2: "Parçalı bulutlu",

        3: "Kapalı",

        45: "Sisli",

        48: "Yoğun sis",

        51: "Hafif çiseleme",

        53: "Çiseleme",

        55: "Yoğun çiseleme",

        61: "Hafif yağmur",

        63: "Yağmurlu",

        65: "Kuvvetli yağmur",

        71: "Hafif kar",

        73: "Kar yağışlı",

        75: "Yoğun kar",

        80: "Hafif sağanak",

        81: "Sağanak",

        82: "Kuvvetli sağanak",

        95: "Gök gürültülü fırtına",

        96: "Dolu ihtimali",

        99: "Kuvvetli dolu"

    };


    return (
        weatherCodes[code]
        || "Bilinmeyen hava durumu"
    );

}


// ======================================================
// WEATHER ICON
// ======================================================

function updateWeatherIcon(code) {

    const icon =
        document.querySelector(
            "#weatherIcon"
        );


    if (!icon) {
        return;
    }


    let iconClass =
        "ti ti-sun";


    if (code === 0) {

        iconClass =
            "ti ti-sun";

    } else if (
        code === 1 ||
        code === 2
    ) {

        iconClass =
            "ti ti-cloud-sun";

    } else if (code === 3) {

        iconClass =
            "ti ti-cloud";

    } else if (
        code === 45 ||
        code === 48
    ) {

        iconClass =
            "ti ti-cloud-fog";

    } else if (
        code >= 51 &&
        code <= 67
    ) {

        iconClass =
            "ti ti-cloud-rain";

    } else if (
        code >= 71 &&
        code <= 77
    ) {

        iconClass =
            "ti ti-snowflake";

    } else if (
        code >= 80 &&
        code <= 82
    ) {

        iconClass =
            "ti ti-cloud-rain";

    } else if (code >= 95) {

        iconClass =
            "ti ti-cloud-storm";

    }


    icon.className =
        iconClass;

}


// ======================================================
// WEATHER TIME
// ======================================================

function formatWeatherTime(time) {

    if (!time) {
        return "";
    }


    const date =
        new Date(time);


    return date.toLocaleTimeString(
        "tr-TR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ======================================================
// GPS LOCATION
// ======================================================

function useCurrentLocation() {

    if (!navigator.geolocation) {

        alert(
            "Tarayıcınız konum özelliğini desteklemiyor."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            // Konumu kaydet

            localStorage.setItem(
                "weatherLocation",
                JSON.stringify({

                    type: "gps",

                    latitude,

                    longitude

                })
            );


            // Hava durumunu getir

            await loadWeather(
                latitude,
                longitude,
                "Mevcut Konum"
            );

        },


        (error) => {

            console.error(
                "Konum hatası:",
                error
            );


            alert(
                "Konum alınamadı. Lütfen tarayıcınızdan konum izni verin."
            );

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 300000
        }

    );

}


// GPS butonu

document
    .querySelector("#locationButton")
    .addEventListener(
        "click",
        useCurrentLocation
    );


// ======================================================
// CITY LIST
// ======================================================

async function loadCities() {

    const select =
        document.querySelector(
            "#citySelect"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/api/weather/cities`
            );


        if (!response.ok) {

            throw new Error(
                "Şehirler alınamadı."
            );

        }


        const cities =
            await response.json();


        cities.forEach((city) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                city.name;


            option.textContent =
                city.name;


            option.dataset.latitude =
                city.latitude;


            option.dataset.longitude =
                city.longitude;


            select.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Şehirler yüklenemedi:",
            error
        );

    }

}


loadCities();


// ======================================================
// CITY MODAL
// ======================================================

const cityModalElement =
    document.querySelector(
        "#cityModal"
    );


const cityModal =
    new bootstrap.Modal(
        cityModalElement
    );


// Modal aç

document
    .querySelector("#cityButton")
    .addEventListener(
        "click",
        () => {

            cityModal.show();

        }
    );


// ======================================================
// SAVE CITY
// ======================================================

document
    .querySelector("#saveCity")
    .addEventListener(
        "click",
        async () => {

            const select =
                document.querySelector(
                    "#citySelect"
                );


            const option =
                select.options[
                    select.selectedIndex
                ];


            if (!option.value) {

                return;

            }


            const latitude =
                option.dataset.latitude;


            const longitude =
                option.dataset.longitude;


            const cityName =
                option.value;


            // Kaydet

            localStorage.setItem(
                "weatherLocation",
                JSON.stringify({

                    type: "city",

                    city: cityName,

                    latitude,

                    longitude

                })
            );


            // Hava durumunu getir

            await loadWeather(
                latitude,
                longitude,
                cityName
            );


            cityModal.hide();

        }
    );


// ======================================================
// INITIALIZE WEATHER
// ======================================================

async function initializeWeather() {

    const saved =
        localStorage.getItem(
            "weatherLocation"
        );


    // Daha önce seçim yapılmışsa

    if (saved) {

        try {

            const location =
                JSON.parse(saved);


            await loadWeather(

                location.latitude,

                location.longitude,

                location.type === "city"
                    ? location.city
                    : "Mevcut Konum"

            );


            return;

        } catch (error) {

            console.error(
                "Kayıtlı konum okunamadı:",
                error
            );

        }

    }


    // İlk açılış → İstanbul

    await loadWeather(

        41.0082,

        28.9784,

        "İstanbul"

    );

}


// ======================================================
// THEME
// ======================================================

const themeButton =
    document.querySelector(
        "#themeToggle"
    );


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "theme-dark"
        );

    }
);

async function loadCurrencyRates() {

    console.log("💰 Döviz fonksiyonu başladı");

    const tableBody = document.getElementById(
        "currencyTableBody"
    );

    if (!tableBody) {
        console.error(
            "❌ currencyTableBody bulunamadı!"
        );
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/currency`
        );

        console.log(
            "💰 Currency status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `API ${response.status} hatası`
            );
        }

        const data = await response.json();

        console.log(
            "💰 Currency data:",
            data
        );

        tableBody.innerHTML = "";

        for (
            const [currency, info]
            of Object.entries(data.rates)
        ) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">

                        <span class="avatar avatar-sm me-2">
                            ${info.symbol}
                        </span>

                        <div>
                            <strong>
                                ${currency} / TRY
                            </strong>

                            <div class="text-secondary">
                                ${info.name}
                            </div>
                        </div>

                    </div>
                </td>

                <td>
                    <strong>
                        ${Number(info.rate).toFixed(2)} ₺
                    </strong>
                </td>

                <td>
                    <span class="badge bg-green-lt">
                        Güncel
                    </span>
                </td>
            `;

            tableBody.appendChild(row);
        }

        console.log(
            "✅ Kurlar dashboard'a eklendi"
        );

    } catch (error) {

        console.error(
            "❌ Döviz yükleme hatası:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="text-center text-danger py-4"
                >
                    <i class="ti ti-alert-circle"></i>
                    Döviz verileri alınamadı.
                </td>
            </tr>
        `;
    }
}


// ======================================================
// NEWS
// ======================================================

let allNews = [];

let selectedNewsSource = "all";

let usingFallbackNews = false;


const FALLBACK_NEWS = [
    {
        title: "TCMB faiz kararina odaklanildi",
        description: "Piyasalarda haftanin odagi Merkez Bankasi toplantisi ve enflasyon beklentileri oldu.",
        source: "Ekonomi",
        url: "https://www.aa.com.tr/tr/ekonomi",
        image: ""
    },
    {
        title: "BIST gunu arti bölgede kapatti",
        description: "Bankacilik ve sanayi hisselerinde alicili seyirle Borsa Istanbul pozitif kapanis yapti.",
        source: "Borsa",
        url: "https://www.borsaistanbul.com/tr/",
        image: ""
    },
    {
        title: "Teknoloji sirketlerinden yeni yapay zeka hamleleri",
        description: "Kuresel teknoloji firmalari verimlilik odakli yeni urun ve servislerini duyurdu.",
        source: "Teknoloji",
        url: "https://www.bloomberght.com/teknoloji",
        image: ""
    },
    {
        title: "Enerji fiyatlarinda dalgali gorunum suruyor",
        description: "Petrol ve dogalgaz fiyatlarinda jeopolitik etkilerle gun ici oynaklik devam ediyor.",
        source: "Dunya",
        url: "https://www.reuters.com/world/",
        image: ""
    }
];


function getFallbackNews() {

    const now = Date.now();

    return FALLBACK_NEWS.map(
        (article, index) => ({
            ...article,
            published_at: new Date(
                now - (index * 45 * 60 * 1000)
            ).toISOString()
        })
    );

}


function setNewsUpdatedText(message) {

    const updated =
        document.querySelector("#newsUpdated");

    if (!updated) {
        return;
    }

    updated.textContent = message;

}


function buildNewsSourceFilters() {

    const filters =
        document.querySelector("#newsSourceFilters");

    if (!filters) {
        return;
    }


    const sources = [
        ...new Set(
            allNews
                .map((article) => article.source)
                .filter(Boolean)
        )
    ].slice(0, 6);


    if (
        selectedNewsSource !== "all" &&
        !sources.includes(selectedNewsSource)
    ) {
        selectedNewsSource = "all";
    }


    const buttons = ["all", ...sources].map(
        (source) => {

            const isActive =
                selectedNewsSource === source;

            const label =
                source === "all"
                    ? "Tumu"
                    : source;

            const variant = isActive
                ? "btn-primary active"
                : "btn-outline-secondary";

            return `

                <button
                    class="btn btn-sm ${variant} news-source-btn"
                    data-source="${escapeHtml(source)}"
                    type="button"
                >
                    ${escapeHtml(label)}
                </button>

            `;

        }
    );


    filters.innerHTML = buttons.join("");

}


// ======================================================
// LOAD NEWS
// ======================================================

async function loadNews() {

    const newsList =
        document.querySelector("#newsList");

    if (!newsList) {

        console.error(
            "newsList bulunamadı!"
        );

        return;
    }


    newsList.innerHTML = `

        <div class="list-group-item text-center py-5">

            <div class="spinner-border spinner-border-sm me-2"></div>

            Haberler yükleniyor...

        </div>

    `;


    try {

        console.log(
            "Haber API çağrılıyor..."
        );


        const response =
            await fetch(
                `${API_URL}/api/news`
            );


        console.log(
            "Haber API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Haber API hatası: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Haber verisi:",
            data
        );


        allNews =
            Array.isArray(data.articles)
                ? data.articles
                : [];


        usingFallbackNews =
            allNews.length === 0;


        if (usingFallbackNews) {
            allNews = getFallbackNews();
        }


        setNewsUpdatedText(
            `Son guncelleme: ${new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
            })}${
                usingFallbackNews
                    ? " • Yedek icerik"
                    : ""
            }`
        );


        buildNewsSourceFilters();

        renderNews();


    } catch (error) {

        console.error(
            "Haber yükleme hatası:",
            error
        );


        usingFallbackNews = true;

        allNews = getFallbackNews();


        setNewsUpdatedText(
            "Canli kaynak kullanilamadi • Yedek icerik gosteriliyor"
        );


        buildNewsSourceFilters();

        renderNews();

    }

}

// ======================================================
// RENDER NEWS
// ======================================================

function renderNews() {

    const newsList =
        document.querySelector("#newsList");


    if (!newsList) {
        return;
    }


    let filteredNews =
        allNews;


    // Kaynak filtresi

    if (
        selectedNewsSource !== "all"
    ) {

        filteredNews =
            allNews.filter(
                (article) =>
                    article.source ===
                    selectedNewsSource
            );

    }


    // Haber yoksa

    if (
        filteredNews.length === 0
    ) {

        newsList.innerHTML = `

            <div
                class="list-group-item text-center py-5"
            >

                <i
                    class="ti ti-news-off"
                    style="font-size: 32px;"
                ></i>

                <div class="mt-2">
                    Bu kaynaktan haber bulunamadı.
                </div>

            </div>

        `;

        return;
    }


    newsList.innerHTML = "";


    filteredNews.forEach(
        (article) => {

            const hasLink =
                Boolean(article.url);

            const item =
                document.createElement(
                    hasLink ? "a" : "div"
                );


            if (hasLink) {

                item.href =
                    article.url;

                item.target =
                    "_blank";

                item.rel =
                    "noopener noreferrer";

                item.className =
                    "list-group-item list-group-item-action";

            } else {

                item.className =
                    "list-group-item";

            }


            const date =
                formatNewsDate(
                    article.published_at
                );


            item.innerHTML = `

                <div class="row align-items-center">

                    ${
                        article.image
                            ? `

                            <div class="col-auto">

                                <img
                                    src="${article.image}"
                                    class="rounded news-item-image"
                                    alt=""
                                    loading="lazy"
                                >

                            </div>

                            `
                            : ""
                    }


                    <div class="col">

                        <div class="d-flex align-items-center gap-2 mb-1">

                            <span class="badge bg-blue-lt">

                                ${
                                    escapeHtml(
                                        article.source ||
                                        "Haber"
                                    )
                                }

                            </span>


                            ${
                                date
                                    ? `
                                    <span class="text-secondary small">
                                        ${date}
                                    </span>
                                    `
                                    : ""
                            }

                        </div>


                        <strong class="d-block">

                            ${escapeHtml(
                                article.title || "Baslik bulunamadi"
                            )}

                        </strong>


                        ${
                            article.description
                                ? `

                                <div
                                    class="text-secondary mt-1 news-description"
                                >

                                    ${escapeHtml(
                                        stripHtml(
                                            article.description
                                        )
                                    )}

                                </div>

                                `
                                : ""
                        }

                    </div>


                    <div class="col-auto">

                        <i
                            class="ti ti-chevron-right text-secondary"
                        ></i>

                    </div>

                </div>

            `;


            newsList.appendChild(
                item
            );

        }
    );

}
// ======================================================
// NEWS DATE
// ======================================================

function formatNewsDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleString(
        "tr-TR",
        {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}
// ======================================================
// STRIP HTML
// ======================================================

function stripHtml(html) {

    const temp =
        document.createElement("div");


    temp.innerHTML =
        html || "";


    return temp.textContent ||
        temp.innerText ||
        "";

}
// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
// ======================================================
// NEWS SOURCE FILTER
// ======================================================

const newsSourceFilters =
    document.querySelector("#newsSourceFilters");


newsSourceFilters?.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".news-source-btn"
            );

        if (!button) {
            return;
        }


        selectedNewsSource =
            button.dataset.source || "all";


        buildNewsSourceFilters();

        renderNews();

    }
);

    // ======================================================
// REFRESH NEWS
// ======================================================

document
    .querySelector("#refreshNews")
    .addEventListener(
        "click",
        async () => {

            const button =
                document.querySelector(
                    "#refreshNews"
                );


            button.disabled = true;


            const icon =
                button.querySelector("i");


            icon.classList.add(
                "ti-spin"
            );


            await loadNews();


            icon.classList.remove(
                "ti-spin"
            );


            button.disabled = false;

        }
    );

// ======================================================
// GOLD
// ======================================================

async function loadGold() {

    const tableBody =
        document.getElementById("goldTableBody");

    if (!tableBody) {
        console.error("goldTableBody bulunamadı!");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/gold`
        );

        if (!response.ok) {
            throw new Error(
                `Gold API: ${response.status}`
            );
        }

        const result = await response.json();

        console.log("🥇 Altın API:", result);

        if (!result.success) {
            throw new Error(
                "Altın API başarısız cevap döndürdü."
            );
        }

        // API'deki gerçek veri
        const goldData = result.data;

        tableBody.innerHTML = "";

        const goldNames = {
            GA: "Gram Altın",
            C: "Çeyrek Altın",
            Y: "Yarım Altın",
            T: "Tam Altın",
            CMR: "Cumhuriyet Altını",
            XAUUSD: "Ons Altın"
        };


        Object.entries(goldData).forEach(
            ([symbol, item]) => {

                const name =
                    goldNames[symbol] || symbol;

                const currency =
                    item.kur === "USD"
                        ? "$"
                        : "₺";


                const alis =
                    Number(item.alis)
                        .toLocaleString(
                            "tr-TR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        );


                const satis =
                    Number(item.satis)
                        .toLocaleString(
                            "tr-TR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        );


                const degisim =
                    Number(item.degisim);


                const changeClass =
                    degisim >= 0
                        ? "text-green"
                        : "text-red";


                const changeIcon =
                    degisim >= 0
                        ? "ti-trending-up"
                        : "ti-trending-down";


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <div
                            class="d-flex align-items-center"
                        >

                            <span
                                class="avatar avatar-sm me-2"
                            >

                                ${item.sembol}

                            </span>


                            <div>

                                <strong>
                                    ${name}
                                </strong>

                                <div
                                    class="text-secondary"
                                >
                                    ${symbol}
                                </div>

                            </div>

                        </div>

                    </td>


                    <td>

                        <span
                            class="text-secondary"
                        >

                            ${alis} ${currency}

                        </span>

                    </td>


                    <td>

                        <strong>

                            ${satis} ${currency}

                        </strong>


                        <div
                            class="${changeClass} small"
                        >

                            <i
                                class="ti ${changeIcon}"
                            ></i>

                            ${item.degisim}%

                        </div>

                    </td>

                `;


                tableBody.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "🥇 Altın yükleme hatası:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="3"
                    class="text-center text-danger py-4"
                >

                    <i
                        class="ti ti-alert-circle"
                    ></i>

                    Altın fiyatları alınamadı.

                </td>

            </tr>

        `;

    }
}

loadNews();
initializeWeather();
loadCurrencyRates();
loadGold();
loadNews();