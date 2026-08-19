import "@tabler/core/dist/css/tabler.min.css";
import "./style.css";
import * as bootstrap from "bootstrap";
import Sortable from "sortablejs";
import { supabase } from "./lib/supabase";

const API_URL = "http://127.0.0.1:8000";

// ======================================================
// DASHBOARD HTML
// ======================================================

document.querySelector("#app").innerHTML = `
<div class="page">
    <!-- NAVBAR -->
        <header class="navbar d-print-none sticky-top border-bottom bg-surface shadow-sm">
        <div class="container-xl d-flex align-items-center justify-content-between gap-3 py-2">
            <a href="#" class="navbar-brand d-flex align-items-center gap-2 m-0">
                <div class="p-2 bg-primary-subtle text-primary rounded-2 d-flex align-items-center justify-content-center">
                    <i class="ti ti-layout-dashboard fs-2"></i>
                </div>
                <div>
                    <span class="fw-bold fs-3 tracking-tight d-block lh-1">Günlük Özet</span>
                    <span class="fs-6 text-secondary fw-normal">2026</span>
                </div>
            </a>

            <div class="user-menu position-relative flex-shrink-0">
                <button type="button" class="user-menu-btn" id="userMenuButton" aria-expanded="false" aria-label="Kullanıcı menüsü">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                    </svg>
                </button>
                <div class="dropdown-menu dropdown-menu-end shadow-lg" id="userDropdownMenu">
                    <div class="px-3 py-2 border-bottom d-none" id="activeUserHeaderInfo">
                        <div class="fw-bold text-truncate" id="navUserName"></div>
                        <div class="small text-secondary text-truncate" id="navUserEmail"></div>
                    </div>
                    <div id="guestActionMenu">
                        <button type="button" class="dropdown-item py-2" id="openLoginBtn">
                            Giriş Yap
                        </button>
                        <button type="button" class="dropdown-item py-2" id="openRegisterBtn">
                            Kayıt Ol
                        </button>
                    </div>
                    <button type="button" class="dropdown-item py-2" id="openSettingsBtn">
                        Ayarlar
                    </button>
                    <div id="logoutActionMenu" class="d-none">
                        <div class="dropdown-divider my-1"></div>
                        <button type="button" class="dropdown-item py-2 text-danger" id="logoutBtn">
                            Çıkış Yap
                        </button>
                    </div>
                </div>
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
                            Hoş Geldin :<span id="welcomeUserName"></span>
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

           

            <!-- DASHBOARD GRID -->
            <div class="row row-cards g-3">

                <!-- WEATHER MODULE -->
                <div class="col-lg-5 col-md-12 module-card" data-module-card="weather">
                    <div class="card weather-card-shell card-hover shadow-sm h-100 border-0" data-weather-state="clear">
                        <div class="weather-sky" aria-hidden="true">
                            <span class="weather-sun"></span>
                            <span class="weather-moon"></span>
                            <span class="weather-stars"></span>
                            <span class="weather-cloud weather-cloud-one"></span>
                            <span class="weather-cloud weather-cloud-two"></span>
                            <span class="weather-wave"></span>
                            <span class="weather-wave weather-wave-two"></span>
                            <span class="weather-snowflake weather-snowflake-one"></span>
                            <span class="weather-snowflake weather-snowflake-two"></span>
                            <span class="weather-snowflake weather-snowflake-three"></span>
                            <span class="weather-snowflake weather-snowflake-four"></span>
                            <span class="weather-snowflake weather-snowflake-five"></span>
                        </div>

                        <div class="card-body d-flex flex-column justify-content-between position-relative">
                            <div>
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <span class="badge bg-white bg-opacity-30 text-white mb-2">Hava Durumu</span>
                                        <h3 class="card-title fs-2 fw-bold mb-0 text-white" id="weatherCity">İstanbul</h3>
                                    </div>
                                    <div class="weather-icon-wrapper p-3 bg-white bg-opacity-20 rounded-circle border border-white border-opacity-40">
                                        <i class="ti ti-sun fs-1 text-white" id="weatherIcon"></i>
                                    </div>
                                </div>

                                <div class="my-4">
                                    <div class="display-3 fw-bold lh-1 text-white" id="weatherTemperature">--°</div>
                                    <div class="mt-2 fs-4 text-white-50" id="weatherCondition">
                                        Veriler yükleniyor...
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="row text-center g-2 p-3 weather-stats-card rounded-3 mb-3">
                                    <div class="col-4 border-end border-white border-opacity-25">
                                        <div class="text-white-50 small">Nem</div>
                                        <strong class="fs-5 text-white" id="weatherHumidity">--%</strong>
                                    </div>
                                    <div class="col-4 border-end border-white border-opacity-25">
                                        <div class="text-white-50 small">Hissedilen</div>
                                        <strong class="fs-5 text-white" id="weatherFeelsLike">--°</strong>
                                    </div>
                                    <div class="col-4">
                                        <div class="text-white-50 small">Rüzgar</div>
                                        <strong class="fs-5 text-white" id="weatherWind">-- km/h</strong>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between align-items-center pt-2">
                                    <span class="text-white-50 extra-small" id="weatherUpdated"></span>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-glass" id="locationButton" title="Konumumu Kullan">
                                            <i class="ti ti-map-pin"></i>
                                        </button>
                                        <button class="btn btn-sm btn-glass" id="cityButton">
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

                                <i class="ti ti-brand-bitcoin text-orange me-2"></i>

                                Kripto Varlıklar

                            </h3>

                        </div>


                        <div
                            class="list-group list-group-flush"
                            id="cryptoList"
                        >

                            <!-- Bitcoin -->

                            <div class="list-group-item py-3">

                                <div class="row align-items-center">

                                    <div class="col-auto">

                                        <span
                                            class="avatar bg-orange-lt rounded-circle"
                                        >
                                            ₿
                                        </span>

                                    </div>


                                    <div class="col">

                                        <strong class="d-block">
                                            Bitcoin
                                        </strong>

                                        <span class="text-secondary small">
                                            BTC
                                        </span>

                                    </div>


                                    <div
                                        class="col-auto text-end"
                                        id="crypto-BTC"
                                    >

                                        <div class="spinner-border spinner-border-sm"></div>

                                    </div>

                                </div>

                            </div>


                            <!-- Ethereum -->

                            <div class="list-group-item py-3">

                                <div class="row align-items-center">

                                    <div class="col-auto">

                                        <span
                                            class="avatar bg-blue-lt rounded-circle"
                                        >
                                            Ξ
                                        </span>

                                    </div>


                                    <div class="col">

                                        <strong class="d-block">
                                            Ethereum
                                        </strong>

                                        <span class="text-secondary small">
                                            ETH
                                        </span>

                                    </div>


                                    <div
                                        class="col-auto text-end"
                                        id="crypto-ETH"
                                    >

                                        <div class="spinner-border spinner-border-sm"></div>

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

<!-- LOGIN MODAL -->
<div class="modal modal-blur fade" id="loginModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Giriş Yap</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="loginForm">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">E-posta</label>
                        <input type="email" class="form-control" id="loginEmail" required placeholder="ornek@mail.com">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Şifre</label>
                        <input type="password" class="form-control" id="loginPassword" required placeholder="******">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary w-100">Giriş Yap</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- REGISTER MODAL -->
<div class="modal modal-blur fade" id="registerModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Kayıt Ol</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="registerForm">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Ad Soyad</label>
                        <input type="text" class="form-control" id="regName" required placeholder="John Doe">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">E-posta</label>
                        <input type="email" class="form-control" id="regEmail" required placeholder="ornek@mail.com">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Şifre</label>
                        <input type="password" class="form-control" id="regPassword" required placeholder="******">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary w-100">Kayıt Ol</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- AYARLAR VE ÖZELLEŞTİRMELER MODAL -->
<div class="modal modal-blur fade" id="settingsModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">
                    <i class="ti ti-settings me-2"></i>Ayarlar & Özelleştirme
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <h6 class="fw-bold mb-3">Görünüm</h6>
                <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-body-tertiary rounded-3">
                    <div>
                        <strong class="d-block">Koyu Tema (Dark Mode)</strong>
                        <span class="text-secondary small">Arayüzü karanlık moda geçir.</span>
                    </div>
                    <div class="form-check form-switch m-0">
                        <input class="form-check-input" type="checkbox" id="settingsThemeToggle">
                    </div>
                </div>

                <h6 class="fw-bold mb-3">Sınıflandırma</h6>
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

                <h6 class="fw-bold mb-3">Sıfırlama</h6>
                <button class="btn btn-outline-danger btn-sm w-100" id="resetDashboardBtn">
                    <i class="ti ti-refresh me-1"></i> Dashboard Sıralamasını Ve Ayarlarını Sıfırla
                </button>
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
// USER PROFILE & SETTINGS SYSTEM - SUPABASE
// ======================================================

// ======================================================
// GET ACTIVE USER
// ======================================================

async function getActiveUser() {
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error) {
        console.error("Aktif kullanıcı alınamadı:", error);
        return null;
    }

    return user;
}


// ======================================================
// UPDATE AUTH UI
// ======================================================

async function updateAuthUI() {
    const activeUser = await getActiveUser();

    const headerInfo = document.getElementById("activeUserHeaderInfo");
    const nameEl = document.getElementById("navUserName");
    const emailEl = document.getElementById("navUserEmail");
    const guestMenu = document.getElementById("guestActionMenu");
    const logoutMenu = document.getElementById("logoutActionMenu");
    const welcomeUserName = document.getElementById("welcomeUserName");

    if (welcomeUserName) {
        welcomeUserName.textContent = activeUser
            ? (activeUser.user_metadata?.name || activeUser.email?.split("@")[0] || "")
            : "";
    }
    
    if (activeUser) {
        const name =
            activeUser.user_metadata?.name ||
            activeUser.email?.split("@")[0] ||
            "Kullanıcı";

        if (nameEl) nameEl.textContent = name;
        if (emailEl) emailEl.textContent = activeUser.email || "";

        headerInfo?.classList.remove("d-none");
        guestMenu?.classList.add("d-none");
        logoutMenu?.classList.remove("d-none");
    } else {
        headerInfo?.classList.add("d-none");
        guestMenu?.classList.remove("d-none");
        logoutMenu?.classList.add("d-none");
    }
}


// ======================================================
// USER MENU
// ======================================================

function closeUserMenu() {
    const menu = document.getElementById("userDropdownMenu");
    const button = document.getElementById("userMenuButton");

    menu?.classList.remove("show");
    button?.setAttribute("aria-expanded", "false");
}

function toggleUserMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    const menu = document.getElementById("userDropdownMenu");
    const button = document.getElementById("userMenuButton");

    if (!menu || !button) return;

    const isOpen = menu.classList.contains("show");

    if (isOpen) {
        closeUserMenu();
    } else {
        menu.classList.add("show");
        button.setAttribute("aria-expanded", "true");
    }
}

function openModalById(modalId) {
    closeUserMenu();

    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}


// ======================================================
// EVENT LISTENERS
// ======================================================

document
    .getElementById("userMenuButton")
    ?.addEventListener("click", toggleUserMenu);

document.addEventListener("click", (event) => {
    const menu = document.getElementById("userDropdownMenu");
    const button = document.getElementById("userMenuButton");

    if (!menu || !button) return;
    if (!menu.classList.contains("show")) return;

    if (menu.contains(event.target) || button.contains(event.target)) return;

    closeUserMenu();
});

document
    .getElementById("openLoginBtn")
    ?.addEventListener("click", () => openModalById("loginModal"));

document
    .getElementById("openRegisterBtn")
    ?.addEventListener("click", () => openModalById("registerModal"));

document
    .getElementById("openSettingsBtn")
    ?.addEventListener("click", () => openModalById("settingsModal"));


// ======================================================
// REGISTER
// ======================================================

document
    .getElementById("registerForm")
    ?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;

        if (!name || !email || !password) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        if (error) {
            console.error("Kayıt hatası:", error);
            alert(error.message);
            return;
        }

        console.log("Kayıt başarılı:", data);

        const modalEl = document.getElementById("registerModal");
        const modal =
            bootstrap.Modal.getInstance(modalEl) ||
            new bootstrap.Modal(modalEl);

        modal.hide();

        if (!data.session) {
            alert("Kayıt başarılı! E-posta adresinizi doğrulayın.");
        } else {
            alert("Kayıt başarılı!");
        }

        await updateAuthUI();
    });


// ======================================================
// LOGIN
// ======================================================

document
    .getElementById("loginForm")
    ?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Lütfen e-posta ve şifrenizi girin.");
            return;
        }

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            console.error("Giriş hatası:", error);
            alert(error.message);
            return;
        }

        console.log("Giriş başarılı:", data);

        const modalEl = document.getElementById("loginModal");
        const modal =
            bootstrap.Modal.getInstance(modalEl) ||
            new bootstrap.Modal(modalEl);

        modal.hide();

        await updateAuthUI();
    });


// ======================================================
// LOGOUT
// ======================================================

document
    .getElementById("logoutBtn")
    ?.addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Çıkış hatası:", error);
            alert(error.message);
            return;
        }

        closeUserMenu();
        await updateAuthUI();
    });


// ======================================================
// AUTH STATE
// ======================================================

supabase.auth.onAuthStateChange(() => {
    updateAuthUI();
});


// ======================================================
// INITIAL CHECK
// ======================================================

updateAuthUI();
// ======================================================
// THEME & SETTINGS IN MODAL
// ======================================================
const themeToggleInput = document.getElementById("settingsThemeToggle");

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.setAttribute("data-bs-theme", "dark");
        if (themeToggleInput) themeToggleInput.checked = true;
    } else {
        document.body.removeAttribute("data-bs-theme");
        if (themeToggleInput) themeToggleInput.checked = false;
    }
}

const savedTheme = localStorage.getItem("dashboardTheme") || "light";
applyTheme(savedTheme);

themeToggleInput?.addEventListener("change", (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    localStorage.setItem("dashboardTheme", newTheme);
    applyTheme(newTheme);
});

// Ayarları Sıfırla
document.getElementById("resetDashboardBtn")?.addEventListener("click", () => {
    if (confirm("Dashboard düzeni ve modül ayarları varsayılana sıfırlansın mı?")) {
        localStorage.removeItem("dashboardOrder");
        localStorage.removeItem("dashboardModules");
        window.location.reload();
    }
});

// Uygulama Başlangıç Yüklemesi
updateAuthUI();

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
    const weatherCard = document.querySelector('[data-module-card="weather"] .weather-card-shell');

    if (!icon || !weatherCard) return;

    let iconClass = "ti ti-sun";
    let state = "clear";
    const hour = new Date().getHours();

    if (code === 0) {
        state = hour >= 19 || hour <= 5 ? "night" : "clear";
        iconClass = state === "night" ? "ti ti-moon-stars" : "ti ti-sun";
    } else if (code >= 1 && code <= 3) {
        state = hour >= 19 || hour <= 5 ? "night" : "cloudy";
        iconClass = state === "night" ? "ti ti-cloud-moon" : "ti ti-cloud-sun";
    } else if (code >= 45 && code <= 48) {
        state = hour >= 19 || hour <= 5 ? "night" : "fog";
        iconClass = state === "night" ? "ti ti-cloud-moon" : "ti ti-cloud-fog";
    } else if (code >= 51 && code <= 67) {
        state = "rain";
        iconClass = "ti ti-cloud-rain";
    } else if (code >= 71 && code <= 77) {
        state = "snow";
        iconClass = "ti ti-snowflake";
    } else if (code >= 80 && code <= 82) {
        state = "rain";
        iconClass = "ti ti-cloud-rain";
    } else if (code >= 95) {
        state = "storm";
        iconClass = "ti ti-cloud-storm";
    }

    weatherCard.dataset.weatherState = state;
    icon.className = iconClass;
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

    const symbols = ["IBM", "AAPL", "ASELS"];

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


async function loadNews() {
    const newsList = document.querySelector("#newsList");
    if (!newsList) return;

    newsList.innerHTML = `<div class="list-group-item text-center py-5"><div class="spinner-border spinner-border-sm text-primary me-2"></div>Haberler yükleniyor...</div>`;

    try {
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error("API Hatası");

        const data = await response.json();
        allNews = Array.isArray(data.articles) ? data.articles : [];

        document.querySelector("#newsUpdated").textContent = `Son güncelleme: ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
        buildNewsSourceFilters();
        renderNews();
    } catch (error) {
        console.error("Haber hatası:", error);
        allNews = [];
        document.querySelector("#newsUpdated").textContent = "Haberler yüklenemedi";
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

// ======================================================
// CRYPTO
// ======================================================

async function loadCrypto() {

    const btcElement =
        document.getElementById("crypto-BTC");

    const ethElement =
        document.getElementById("crypto-ETH");


    try {

        // ==============================================
        // BITCOIN
        // ==============================================

        const btcResponse = await fetch(
            `${API_URL}/api/crypto/BTC`
        );


        if (!btcResponse.ok) {

            throw new Error(
                `Bitcoin API: ${btcResponse.status}`
            );

        }


        const btc = await btcResponse.json();


        console.log(
            "₿ Bitcoin:",
            btc
        );


        // ==============================================
        // ETHEREUM
        // ==============================================

        const ethResponse = await fetch(
            `${API_URL}/api/crypto/ETH`
        );


        if (!ethResponse.ok) {

            throw new Error(
                `Ethereum API: ${ethResponse.status}`
            );

        }


        const eth = await ethResponse.json();


        console.log(
            "Ξ Ethereum:",
            eth
        );


        // ==============================================
        // BITCOIN HTML
        // ==============================================

        if (btcElement) {

            btcElement.innerHTML =
                createCryptoPrice(
                    btc
                );

        }


        // ==============================================
        // ETHEREUM HTML
        // ==============================================

        if (ethElement) {

            ethElement.innerHTML =
                createCryptoPrice(
                    eth
                );

        }


    } catch (error) {

        console.error(
            "Crypto Error:",
            error
        );


        if (btcElement) {

            btcElement.innerHTML = `

                <span class="text-danger small">

                    <i class="ti ti-alert-circle"></i>

                    Veri alınamadı

                </span>

            `;

        }


        if (ethElement) {

            ethElement.innerHTML = `

                <span class="text-danger small">

                    <i class="ti ti-alert-circle"></i>

                    Veri alınamadı

                </span>

            `;

        }

    }

}

// ======================================================
// CRYPTO PRICE HTML
// ======================================================

function createCryptoPrice(data) {

    const price =
        Number(
            data.close
        );


    const change =
        Number(
            data.percent_change
        );


    const isPositive =
        change >= 0;


    const badgeClass =
        isPositive
            ? "bg-green-lt"
            : "bg-red-lt";


    const sign =
        isPositive
            ? "+"
            : "";


    return `

        <strong class="d-block">

            $${price.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}

        </strong>


        <span
            class="badge ${badgeClass}"
        >

            ${sign}${change.toFixed(2)}%

        </span>

    `;

}
// ======================================================
// DRAG & DROP SYSTEM (SORTABLEJS)
// ======================================================
function initDragAndDrop() {
    const gridContainer = document.querySelector(".row-cards");
    if (!gridContainer) return;

    Sortable.create(gridContainer, {
        animation: 150, // Yer değiştirme animasyonu hızı (ms)
        handle: ".card-header, .weather-card-shell", // Sadece başlıktan tutarak sürükleme
        ghostClass: "sortable-ghost", // Sürüklenirken kartın arkasında kalan hayalet stil
        dragClass: "sortable-drag",   // Sürüklenen öğenin stili
        onEnd: function () {
            // Yeni sıralamayı localStorage'a kaydetmek için:
            const order = Array.from(gridContainer.children).map(
                (card) => card.dataset.moduleCard
            );
            localStorage.setItem("dashboardOrder", JSON.stringify(order));
        }
    });

    // Kaydedilmiş sıralamayı geri yükleme
    restoreCardOrder(gridContainer);
}

function restoreCardOrder(container) {
    const savedOrder = JSON.parse(localStorage.getItem("dashboardOrder"));
    if (!savedOrder) return;

    savedOrder.forEach((moduleName) => {
        const card = container.querySelector(`[data-module-card="${moduleName}"]`);
        if (card) {
            container.appendChild(card); // Kaydedilen sıraya göre kartları diz
        }
    });
}



// INITIALIZATIONS
initDragAndDrop();
initializeWeather();
loadCurrencyRates();
loadStocks();
loadGold();
loadNews();
loadCrypto();