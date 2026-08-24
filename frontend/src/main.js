import "@tabler/core/dist/css/tabler.min.css";
import "./style.css";
import * as bootstrap from "bootstrap";
import Sortable from "sortablejs";
import { supabase } from "./lib/supabase";
import {
    DEFAULT_DATA_PREFS,
    getDataPrefs,
    getSettings,
    initUserSettings,
    resetSettings,
    saveDataPrefs,
    updateSettings
} from "./lib/userSettings";
import {
    CALENDAR_TYPES,
    deleteCalendarItem,
    getCalendarItems,
    getTypeMeta,
    initCalendarStore,
    saveCalendarItems,
    upsertCalendarItem
} from "./lib/calendarItems";

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
                        <div class="badge bg-primary-subtle text-primary fs-5 px-3 py-2 rounded-pill shadow-sm" id="currentDate">
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
                                    <span class="text-white-50 extra-small" id="weatherUpdated">Open-Meteo · —</span>
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

                <!-- CALENDAR MODULE -->
                <div class="col-lg-7 col-md-12 module-card align-self-start" data-module-card="calendar">
                    <div class="card calendar-card-shell card-hover shadow-sm border-0">
                        <div class="card-body d-flex flex-column position-relative py-2 px-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div class="calendar-heading">
                                    <span class="calendar-kicker">Takvim</span>
                                    <div class="d-flex align-items-baseline gap-2 flex-wrap">
                                        <h3 class="card-title calendar-month mb-0" id="calendarMonthLabel">--</h3>
                                        <span class="calendar-day-focus" id="calendarDayNumber">--</span>
                                        <span class="calendar-weekday" id="calendarWeekday">--</span>
                                        <span class="d-none" id="calendarDayHint">Bugün</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-1">
                                    <button class="btn btn-sm calendar-action-btn" id="calendarNotifyBtn" type="button" title="Bildirim izni">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
                                            <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                                        </svg>
                                    </button>
                                    <button class="btn btn-sm calendar-action-btn calendar-action-primary" id="calendarAddBtn" type="button" title="Görev / etkinlik ekle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M12 5v14"></path>
                                            <path d="M5 12h14"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="calendar-board mb-1">
                                <div class="calendar-weekdays" id="calendarWeekdays"></div>
                                <div class="calendar-grid" id="calendarGrid"></div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="calendar-list-label" id="calendarListTitle">Seçilen gün</span>
                                <div class="calendar-nav">
                                    <button class="btn btn-sm calendar-action-btn" id="calendarPrev" type="button" title="Önceki ay">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6l6 6"></path></svg>
                                    </button>
                                    <button class="btn btn-sm calendar-today-btn" id="calendarToday" type="button">Bugün</button>
                                    <button class="btn btn-sm calendar-action-btn" id="calendarNext" type="button" title="Sonraki ay">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6l-6 6"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <div class="calendar-item-list" id="calendarItemList"></div>
                            <div class="module-meta module-meta-calendar mt-2">
                                <span class="module-meta-source">Yerel / Supabase</span>
                                <span class="module-meta-updated" data-module-updated="calendar">—</span>
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
                            <table class="table card-table table-vcenter text-nowrap mb-0">
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
                        <div class="card-footer module-meta">
                            <span class="module-meta-source">Frankfurter</span>
                            <span class="module-meta-updated" data-module-updated="currency">—</span>
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
                            <table class="table card-table table-vcenter text-nowrap mb-0">
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
                        <div class="card-footer module-meta">
                            <span class="module-meta-source">Genelpara</span>
                            <span class="module-meta-updated" data-module-updated="gold">—</span>
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


                        <div class="list-group list-group-flush" id="cryptoList">
                            <div class="list-group-item text-center py-4 text-secondary">
                                <div class="spinner-border spinner-border-sm me-2"></div>
                                Kripto verileri yükleniyor...
                            </div>
                        </div>
                        <div class="card-footer module-meta">
                            <span class="module-meta-source">CoinMarketCap</span>
                            <span class="module-meta-updated" data-module-updated="crypto">—</span>
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
                        <div class="card-footer module-meta">
                            <span class="module-meta-source">Yahoo Finance</span>
                            <span class="module-meta-updated" data-module-updated="stocks">—</span>
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
                            </div>
                        </div>
                        <div class="list-group list-group-flush overflow-auto" style="max-height: 480px;" id="newsList">
                            <div class="list-group-item text-center py-5">
                                <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                                Haberler yükleniyor...
                            </div>
                        </div>
                        <div class="card-footer module-meta">
                            <span class="module-meta-source">GNews</span>
                            <span class="module-meta-updated" data-module-updated="news">—</span>
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

<div class="toast-container position-fixed bottom-0 end-0 p-3" id="appToasts" style="z-index: 1090;"></div>

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
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Ayarlar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="settings-section-label">Hava Durumu</div>
                <label class="settings-box settings-theme">
                    <span>Otomatik konum</span>
                    <input class="form-check-input m-0" type="checkbox" id="settingsAutoLocationToggle" checked>
                </label>

                <div class="settings-section-label">Görünüm</div>
                <label class="settings-box settings-theme">
                    <span>Koyu tema</span>
                    <input class="form-check-input m-0" type="checkbox" id="settingsThemeToggle">
                </label>

                <div class="settings-section-label">Kartlar</div>
                <div class="settings-box settings-grid" id="moduleSelector">
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="weather"> <span class="form-check-label">Hava</span></label>
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="calendar"> <span class="form-check-label">Takvim</span></label>
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="currency"> <span class="form-check-label">Döviz</span></label>
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="gold"> <span class="form-check-label">Altın</span></label>
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="crypto"> <span class="form-check-label">Kripto</span></label>
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="stocks"> <span class="form-check-label">Borsa</span></label>
                    <label class="form-check m-0"><input class="form-check-input module-toggle" type="checkbox" data-module="news"> <span class="form-check-label">Haberler</span></label>
                </div>

                <div class="settings-section-label">Veriler</div>
                <div id="classificationLists" class="settings-data"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-link text-danger px-0 me-auto" id="resetDashboardBtn">Varsayılana sıfırla</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Tamam</button>
            </div>
        </div>
    </div>
</div>

<!-- CALENDAR ITEM MODAL -->
<div class="modal modal-blur fade" id="calendarItemModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content shadow">
            <form id="calendarItemForm">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold" id="calendarItemModalTitle">Yeni kayıt</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="calendarItemId">
                    <div class="mb-3">
                        <label class="form-label">Başlık</label>
                        <input type="text" class="form-control" id="calendarItemTitle" required maxlength="120" placeholder="Toplantı, alışveriş...">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tür</label>
                        <select class="form-select" id="calendarItemType">
                            <option value="event">Etkinlik</option>
                            <option value="task">Görev</option>
                            <option value="todo">Yapılacak</option>
                        </select>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col-7">
                            <label class="form-label">Tarih</label>
                            <input type="date" class="form-control" id="calendarItemDate" required>
                        </div>
                        <div class="col-5">
                            <label class="form-label">Saat</label>
                            <input type="time" class="form-control" id="calendarItemTime">
                        </div>
                    </div>
                    <label class="form-check">
                        <input class="form-check-input" type="checkbox" id="calendarItemNotify">
                        <span class="form-check-label">Zamanı gelince bildirim gönder</span>
                    </label>
                    <div class="extra-small text-secondary mt-2">Bildirimler, dashboard açıkken tarayıcı bildirimi olarak gelir.</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link text-danger me-auto d-none" id="calendarItemDeleteBtn">Sil</button>
                    <button type="submit" class="btn btn-primary">Kaydet</button>
                </div>
            </form>
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

        const date = now.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const time = now.toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        dateElement.innerHTML = `
            <i class="ti ti-calendar me-1"></i>
            ${date}
            <span class="mx-1">•</span>
            <i class="ti ti-clock me-1"></i>
            ${time}
        `;
    }
}

updateDate();
setInterval(updateDate, 1000);

// ======================================================
// MODULE SYSTEM
// ======================================================
const moduleToggles = document.querySelectorAll(".module-toggle");

function applyVisibleModules(modules) {
    moduleToggles.forEach((input) => {
        const moduleName = input.dataset.module;
        const card = document.querySelector(`[data-module-card="${moduleName}"]`);
        const isActive = modules.includes(moduleName);
        input.checked = isActive;
        card?.classList.toggle("d-none", !isActive);
    });
}

function saveVisibleModules() {
    const currentModules = [];
    moduleToggles.forEach((input) => {
        if (input.checked) currentModules.push(input.dataset.module);
    });
    updateSettings({ modules: currentModules });
}

moduleToggles.forEach((input) => {
    const moduleName = input.dataset.module;
    input.addEventListener("change", () => {
        const target = document.querySelector(`[data-module-card="${moduleName}"]`);
        target?.classList.toggle("d-none", !input.checked);
        saveVisibleModules();
    });
});


// ======================================================
// DATA CLASSIFICATIONS (user-selected series)
// ======================================================
const DATA_CATALOG = {
    gold: [
        { id: "GA", label: "Gram Altın" },
        { id: "C", label: "Çeyrek Altın" },
        { id: "Y", label: "Yarım Altın" },
        { id: "T", label: "Tam Altın" },
        { id: "CMR", label: "Cumhuriyet Altını" },
        { id: "XAUUSD", label: "Ons Altın" }
    ],
    crypto: [
        { id: "BTC", label: "Bitcoin", icon: "₿", color: "bg-orange-lt" },
        { id: "ETH", label: "Ethereum", icon: "Ξ", color: "bg-blue-lt" },
        { id: "SOL", label: "Solana", icon: "S", color: "bg-purple-lt" },
        { id: "XRP", label: "Ripple", icon: "X", color: "bg-azure-lt" },
        { id: "DOGE", label: "Dogecoin", icon: "D", color: "bg-yellow-lt" }
    ],
    stocks: [
        // ABD
        { id: "AAPL", label: "AAPL", hint: "Apple", market: "US" },
        { id: "MSFT", label: "MSFT", hint: "Microsoft", market: "US" },
        { id: "GOOGL", label: "GOOGL", hint: "Alphabet", market: "US" },
        { id: "AMZN", label: "AMZN", hint: "Amazon", market: "US" },
        { id: "NVDA", label: "NVDA", hint: "NVIDIA", market: "US" },
        { id: "TSLA", label: "TSLA", hint: "Tesla", market: "US" },
        { id: "META", label: "META", hint: "Meta", market: "US" },
        { id: "NFLX", label: "NFLX", hint: "Netflix", market: "US" },
        { id: "JPM", label: "JPM", hint: "JPMorgan", market: "US" },
        { id: "V", label: "V", hint: "Visa", market: "US" },
        { id: "AMD", label: "AMD", hint: "AMD", market: "US" },
        { id: "INTC", label: "INTC", hint: "Intel", market: "US" },
        // BIST
        { id: "THYAO.IS", label: "THYAO", hint: "THY", market: "BIST" },
        { id: "ASELS.IS", label: "ASELS", hint: "Aselsan", market: "BIST" },
        { id: "GARAN.IS", label: "GARAN", hint: "Garanti", market: "BIST" },
        { id: "AKBNK.IS", label: "AKBNK", hint: "Akbank", market: "BIST" },
        { id: "YKBNK.IS", label: "YKBNK", hint: "Yapı Kredi", market: "BIST" },
        { id: "ISCTR.IS", label: "ISCTR", hint: "İş Bankası", market: "BIST" },
        { id: "EREGL.IS", label: "EREGL", hint: "Erdemir", market: "BIST" },
        { id: "BIMAS.IS", label: "BIMAS", hint: "BİM", market: "BIST" },
        { id: "KCHOL.IS", label: "KCHOL", hint: "Koç", market: "BIST" },
        { id: "SAHOL.IS", label: "SAHOL", hint: "Sabancı", market: "BIST" },
        { id: "TUPRS.IS", label: "TUPRS", hint: "Tüpraş", market: "BIST" },
        { id: "SISE.IS", label: "SISE", hint: "Şişecam", market: "BIST" },
        { id: "TCELL.IS", label: "TCELL", hint: "Turkcell", market: "BIST" },
        { id: "TOASO.IS", label: "TOASO", hint: "Tofaş", market: "BIST" },
        // Endeksler
        { id: "XU100.IS", label: "XU100", hint: "BIST 100", market: "IDX" },
        { id: "XU030.IS", label: "XU030", hint: "BIST 30", market: "IDX" },
        { id: "^GSPC", label: "S&P500", hint: "S&P 500", market: "IDX" },
        { id: "^DJI", label: "DJI", hint: "Dow Jones", market: "IDX" },
        { id: "^IXIC", label: "IXIC", hint: "Nasdaq", market: "IDX" }
    ]
};

function formatModuleUpdatedAt(date = new Date()) {
    return date.toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function setModuleUpdated(moduleKey, date = new Date()) {
    const el = document.querySelector(`[data-module-updated="${moduleKey}"]`);
    if (el) el.textContent = formatModuleUpdatedAt(date);
}

function renderClassificationSettings() {
    const root = document.getElementById("classificationLists");
    if (!root) return;
    const prefs = getDataPrefs();

    const compactGroup = (key, title) => {
        const items = DATA_CATALOG[key].map((item) => {
            const checked = prefs[key].includes(item.id) ? "checked" : "";
            return `<label class="form-check settings-compact-check">
                <input type="checkbox" class="form-check-input data-pref-check" data-group="${key}" value="${item.id}" ${checked}>
                <span class="form-check-label">${item.label}</span>
            </label>`;
        }).join("");
        return `<div class="settings-data-col"><div class="settings-data-head">${title}</div><div class="settings-compact-list">${items}</div></div>`;
    };

    const stockSections = [
        { market: "US", title: "ABD" },
        { market: "BIST", title: "BIST" },
        { market: "IDX", title: "Endeks" }
    ].map((section) => {
        const chips = DATA_CATALOG.stocks
            .filter((item) => item.market === section.market)
            .map((item) => {
                const checked = prefs.stocks.includes(item.id) ? "checked" : "";
                return `<label class="settings-chip" title="${item.hint || item.label}">
                    <input type="checkbox" class="data-pref-check" data-group="stocks" value="${item.id}" ${checked}>
                    <span>${item.label}</span>
                </label>`;
            }).join("");
        return `<div class="settings-stock-section">
            <div class="settings-data-head">${section.title}</div>
            <div class="settings-chip-grid">${chips}</div>
        </div>`;
    }).join("");

    root.innerHTML = `
        <div class="settings-data-top">
            ${compactGroup("gold", "Altın")}
            ${compactGroup("crypto", "Kripto")}
        </div>
        <div class="settings-data-stocks">
            <div class="settings-data-head">Borsa</div>
            ${stockSections}
        </div>
    `;
}

function applyDataPrefChange() {
    const prefs = { gold: [], crypto: [], stocks: [] };
    document.querySelectorAll(".data-pref-check").forEach((input) => {
        if (input.checked) prefs[input.dataset.group].push(input.value);
    });
    saveDataPrefs(prefs);
    loadGold();
    loadStocks();
    loadCrypto();
}

document.getElementById("classificationLists")?.addEventListener("change", (event) => {
    if (event.target.classList.contains("data-pref-check")) {
        applyDataPrefChange();
    }
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

supabase.auth.onAuthStateChange(async (event, session) => {
    await initUserSettings(session?.user ?? null);
    applyDashboardSettings();
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        await initializeWeather();
        await initCalendar();
        loadGold();
        loadStocks();
        loadCrypto();
    }
    await updateAuthUI();
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

themeToggleInput?.addEventListener("change", (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    updateSettings({ theme: newTheme });
    applyTheme(newTheme);
});

const autoLocationToggleInput = document.getElementById("settingsAutoLocationToggle");

function applyAutoLocationSetting(enabled) {
    if (autoLocationToggleInput) autoLocationToggleInput.checked = enabled;
}

autoLocationToggleInput?.addEventListener("change", async (e) => {
    const enabled = e.target.checked;
    updateSettings({ weather_auto_location: enabled });

    if (enabled) {
        await initializeWeather();
    }
});

// Ayarları Sıfırla
document.getElementById("resetDashboardBtn")?.addEventListener("click", async () => {
    if (confirm("Dashboard düzeni ve modül ayarları varsayılana sıfırlansın mı?")) {
        await resetSettings();
        window.location.reload();
    }
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
        updated.textContent = `Open-Meteo · ${formatModuleUpdatedAt(data.time ? new Date(data.time) : new Date())}`;
        updateWeatherIcon(data.weather_code, data.time);

    } catch (error) {
        console.error("Hava durumu hatası:", error);
        temperature.textContent = "--°";
        humidity.textContent = "--%";
        feelsLike.textContent = "--°";
        wind.textContent = "-- km/h";
        condition.textContent = "Veri alınamadı";
        updated.textContent = "Open-Meteo · ulaşılamadı";
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

function isNightHour(hour) {
    return hour >= 20 || hour < 6;
}

function updateWeatherIcon(code, time = null) {
    const icon = document.querySelector("#weatherIcon");
    const weatherCard = document.querySelector('[data-module-card="weather"] .weather-card-shell');

    if (!icon || !weatherCard) return;

    let iconClass = "ti ti-sun";
    let state = "clear";
    const hour = time ? new Date(time).getHours() : new Date().getHours();
    const night = isNightHour(hour);

    if (code === 0) {
        state = night ? "night" : "clear";
        iconClass = night ? "ti ti-moon-stars" : "ti ti-sun";
    } else if (code === 1) {
        state = night ? "night" : "mostly-clear";
        iconClass = night ? "ti ti-cloud-moon" : "ti ti-sun";
    } else if (code === 2) {
        state = night ? "night" : "partly-cloudy";
        iconClass = night ? "ti ti-cloud-moon" : "ti ti-cloud-sun";
    } else if (code === 3) {
        state = night ? "night" : "cloudy";
        iconClass = night ? "ti ti-cloud-moon" : "ti ti-cloud";
    } else if (code >= 45 && code <= 48) {
        state = night ? "night" : "fog";
        iconClass = night ? "ti ti-cloud-moon" : "ti ti-cloud-fog";
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
    icon.className = `${iconClass} fs-1 text-white`;
}

function formatWeatherTime(time) {
    if (!time) return "";
    return new Date(time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

async function resolvePlaceName(latitude, longitude) {
    try {
        const response = await fetch(
            `${API_URL}/api/weather/reverse?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) return "Mevcut Konum";
        const data = await response.json();
        return data.name || "Mevcut Konum";
    } catch {
        return "Mevcut Konum";
    }
}

function requestGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("unsupported"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    });
}

async function loadWeatherFromCoords(latitude, longitude, options = {}) {
    const { saveLocation = false, locationType = "gps", placeName = null } = options;
    const cityName = placeName || await resolvePlaceName(latitude, longitude);

    if (saveLocation) {
        updateSettings({
            weather_auto_location: locationType === "auto",
            weather_location: {
                type: locationType,
                latitude,
                longitude,
                city: cityName
            }
        });
    }

    await loadWeather(latitude, longitude, cityName);
    return cityName;
}

async function useCurrentLocation() {
    try {
        const { latitude, longitude } = await requestGeolocation();
        updateSettings({ weather_auto_location: true });
        applyAutoLocationSetting(true);
        await loadWeatherFromCoords(latitude, longitude, {
            saveLocation: true,
            locationType: "auto"
        });
    } catch (error) {
        console.error("Konum hatası:", error);
        alert("Konum alınamadı. İzin verildiğinden emin olun.");
    }
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

    updateSettings({
        weather_auto_location: false,
        weather_location: { type: "city", city: cityName, latitude, longitude }
    });
    await loadWeather(latitude, longitude, cityName);
    cityModal.hide();
});

async function initializeWeather() {
    const settings = getSettings();
    const location = settings.weather_location;

    if (settings.weather_auto_location) {
        try {
            const { latitude, longitude } = await requestGeolocation();
            await loadWeatherFromCoords(latitude, longitude, {
                saveLocation: true,
                locationType: "auto"
            });
            return;
        } catch (error) {
            console.warn("Otomatik konum alınamadı, kayıtlı konuma dönülüyor:", error);
        }
    }

    if (location?.latitude && location?.longitude) {
        await loadWeather(
            Number(location.latitude),
            Number(location.longitude),
            location.city || "Mevcut Konum"
        );
        return;
    }

    await loadWeather(41.0082, 28.9784, "İstanbul");
}

// ======================================================
// CALENDAR
// ======================================================
const CALENDAR_TYPE_LABELS = Object.fromEntries(
    Object.entries(CALENDAR_TYPES).map(([key, meta]) => [key, meta.label])
);

const WEEKDAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_NAMES = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

let selectedCalendarDate = startOfDay(new Date());
let calendarItemModal = null;
let calendarNotifyTimer = null;

function startOfDay(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
}

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
    const [year, month, day] = String(key).split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
}

function isSameDay(a, b) {
    return toDateKey(a) === toDateKey(b);
}

function getItemDueAt(item) {
    if (!item?.date) return null;
    const date = parseDateKey(item.date);
    if (item.time) {
        const [hour, minute] = item.time.split(":").map(Number);
        date.setHours(hour || 0, minute || 0, 0, 0);
    } else {
        date.setHours(9, 0, 0, 0);
    }
    return date;
}

function showAppToast(title, body) {
    const root = document.getElementById("appToasts");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast show align-items-center border-0 shadow";
    el.setAttribute("role", "alert");
    el.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong class="d-block">${escapeHtml(title)}</strong>
                <span class="small">${escapeHtml(body)}</span>
            </div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    root.appendChild(el);
    setTimeout(() => el.remove(), 6000);
}

function fireCalendarNotification(item) {
    const typeLabel = CALENDAR_TYPE_LABELS[item.type] || "Kayıt";
    const when = item.time ? item.time : "Tüm gün";
    const body = `${when} • ${item.title}`;
    showAppToast(typeLabel, body);

    if ("Notification" in window && Notification.permission === "granted") {
        try {
            new Notification(`${typeLabel}: ${item.title}`, {
                body: when,
                tag: item.id
            });
        } catch (error) {
            console.warn("Bildirim gönderilemedi:", error);
        }
    }
}

async function requestCalendarNotifications() {
    if (!("Notification" in window)) {
        alert("Tarayıcınız bildirimleri desteklemiyor.");
        return false;
    }
    if (Notification.permission === "granted") return true;
    const result = await Notification.requestPermission();
    return result === "granted";
}

function checkCalendarNotifications() {
    const items = getCalendarItems();
    const now = Date.now();
    let changed = false;

    const next = items.map((item) => {
        if (!item.notify || item.done) return item;
        const due = getItemDueAt(item);
        if (!due) return item;
        const dueMs = due.getTime();
        if (now < dueMs) return item;
        if (now - dueMs > 24 * 60 * 60 * 1000) return item;
        const stamp = due.toISOString();
        if (item.notifiedAt === stamp) return item;
        fireCalendarNotification(item);
        changed = true;
        return { ...item, notifiedAt: stamp };
    });

    if (changed) saveCalendarItems(next);
}

function renderCalendar() {
    const monthLabel = document.getElementById("calendarMonthLabel");
    const dayNumber = document.getElementById("calendarDayNumber");
    const weekday = document.getElementById("calendarWeekday");
    const hint = document.getElementById("calendarDayHint");
    const weekdays = document.getElementById("calendarWeekdays");
    const grid = document.getElementById("calendarGrid");
    const list = document.getElementById("calendarItemList");
    const listTitle = document.getElementById("calendarListTitle");
    if (!grid || !list) return;

    setModuleUpdated("calendar");

    const today = startOfDay(new Date());
    const year = selectedCalendarDate.getFullYear();
    const month = selectedCalendarDate.getMonth();
    const items = getCalendarItems();
    const selectedKey = toDateKey(selectedCalendarDate);

    if (monthLabel) monthLabel.textContent = `${MONTH_NAMES[month]} ${year}`;
    if (dayNumber) dayNumber.textContent = String(selectedCalendarDate.getDate());
    if (weekday) {
        weekday.textContent = selectedCalendarDate.toLocaleDateString("tr-TR", { weekday: "long" });
    }
    if (hint) hint.textContent = isSameDay(selectedCalendarDate, today) ? "Bugün" : "Seçilen gün";
    if (listTitle) {
        listTitle.textContent = selectedCalendarDate.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long"
        });
    }
    if (weekdays) {
        weekdays.innerHTML = WEEKDAY_SHORT.map((name) => `<span>${name}</span>`).join("");
    }

    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startOffset; i += 1) {
        cells.push(`<button type="button" class="calendar-day is-empty" disabled></button>`);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const key = toDateKey(date);
        const weekday = date.getDay();
        const isWeekend = weekday === 0 || weekday === 6;
        const dayDots = [...new Set(
            items.filter((item) => item.date === key).map((item) => item.type)
        )].slice(0, 3);
        const classes = [
            "calendar-day",
            isSameDay(date, today) ? "is-today" : "",
            key === selectedKey ? "is-selected" : "",
            dayDots.length ? "has-items" : "",
            isWeekend ? "is-weekend" : ""
        ].filter(Boolean).join(" ");
        const dotsHtml = dayDots.map((type) => {
            const color = getTypeMeta(type).color;
            return `<span class="calendar-day-dot" style="background:${color}"></span>`;
        }).join("");
        cells.push(`
            <button type="button" class="${classes}" data-date="${key}">
                <span class="calendar-day-num">${day}</span>
                <span class="calendar-day-dots">${dotsHtml}</span>
            </button>
        `);
    }

    grid.innerHTML = cells.join("");

    const dayItems = items
        .filter((item) => item.date === selectedKey)
        .sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99")));

    if (!dayItems.length) {
        list.innerHTML = `<div class="extra-small py-2" style="color: var(--cal-muted)">Bu gün için kayıt yok. + ile ekleyebilirsin.</div>`;
        return;
    }

    list.innerHTML = dayItems.map((item) => {
        const meta = getTypeMeta(item.type);
        return `
        <div class="calendar-entry ${item.done ? "is-done" : ""}" data-id="${escapeHtml(item.id)}" data-type="${escapeHtml(item.type)}">
            <button type="button" class="calendar-check" data-action="toggle" title="Tamamla" aria-label="Tamamla">
                <span class="calendar-type-dot" style="background:${meta.color}"></span>
            </button>
            <button type="button" class="calendar-entry-body" data-action="edit">
                <div class="calendar-entry-main">
                    <span class="calendar-entry-title">${escapeHtml(item.title)}</span>
                    <span class="calendar-entry-meta">
                        ${item.time ? `<span class="calendar-entry-time">${escapeHtml(item.time)}</span>` : ""}
                        <span class="calendar-entry-type" style="color:${meta.color}">${meta.label}</span>
                    </span>
                </div>
            </button>
        </div>`;
    }).join("");
}

function openCalendarItemModal(item = null) {
    const modalEl = document.getElementById("calendarItemModal");
    if (!modalEl) return;
    calendarItemModal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById("calendarItemModalTitle").textContent = item ? "Kaydı düzenle" : "Yeni kayıt";
    document.getElementById("calendarItemId").value = item?.id || "";
    document.getElementById("calendarItemTitle").value = item?.title || "";
    document.getElementById("calendarItemType").value = item?.type || "event";
    document.getElementById("calendarItemDate").value = item?.date || toDateKey(selectedCalendarDate);
    document.getElementById("calendarItemTime").value = item?.time || "";
    document.getElementById("calendarItemNotify").checked = Boolean(item?.notify);
    document.getElementById("calendarItemDeleteBtn")?.classList.toggle("d-none", !item);

    calendarItemModal.show();
}

async function initCalendar() {
    const user = await getActiveUser();
    await initCalendarStore(user);
    renderCalendar();
    checkCalendarNotifications();
    if (calendarNotifyTimer) clearInterval(calendarNotifyTimer);
    calendarNotifyTimer = setInterval(checkCalendarNotifications, 30000);
}

document.getElementById("calendarGrid")?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-date]");
    if (!btn) return;
    selectedCalendarDate = startOfDay(parseDateKey(btn.dataset.date));
    renderCalendar();
});

document.getElementById("calendarPrev")?.addEventListener("click", () => {
    selectedCalendarDate = startOfDay(new Date(
        selectedCalendarDate.getFullYear(),
        selectedCalendarDate.getMonth() - 1,
        1
    ));
    renderCalendar();
});

document.getElementById("calendarNext")?.addEventListener("click", () => {
    selectedCalendarDate = startOfDay(new Date(
        selectedCalendarDate.getFullYear(),
        selectedCalendarDate.getMonth() + 1,
        1
    ));
    renderCalendar();
});

document.getElementById("calendarToday")?.addEventListener("click", () => {
    selectedCalendarDate = startOfDay(new Date());
    renderCalendar();
});

document.getElementById("calendarAddBtn")?.addEventListener("click", () => {
    openCalendarItemModal();
});

document.getElementById("calendarNotifyBtn")?.addEventListener("click", async () => {
    const granted = await requestCalendarNotifications();
    alert(granted
        ? "Bildirimler açık. Zamanı gelen kayıtlar için uyarı alacaksın."
        : "Bildirim izni verilmedi. İzin vermeden tarayıcı bildirimi gönderilemez.");
});

document.getElementById("calendarItemList")?.addEventListener("click", async (event) => {
    const row = event.target.closest(".calendar-entry");
    if (!row) return;
    const action = event.target.closest("[data-action]")?.dataset.action;
    const items = getCalendarItems();
    const item = items.find((entry) => entry.id === row.dataset.id);
    if (!item) return;

    if (action === "toggle") {
        await upsertCalendarItem({ ...item, done: !item.done });
        renderCalendar();
        return;
    }

    if (action === "edit") openCalendarItemModal(item);
});

document.getElementById("calendarItemForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("calendarItemId").value;
    const title = document.getElementById("calendarItemTitle").value.trim();
    const type = document.getElementById("calendarItemType").value;
    const date = document.getElementById("calendarItemDate").value;
    const time = document.getElementById("calendarItemTime").value;
    const notify = document.getElementById("calendarItemNotify").checked;

    if (!title || !date) return;

    if (notify) await requestCalendarNotifications();

    const existing = id ? getCalendarItems().find((item) => item.id === id) : null;

    await upsertCalendarItem({
        id: id || undefined,
        title,
        type,
        date,
        time,
        notify,
        done: existing?.done || false,
        notifiedAt: null
    });

    selectedCalendarDate = startOfDay(parseDateKey(date));
    renderCalendar();
    calendarItemModal?.hide();
});

document.getElementById("calendarItemDeleteBtn")?.addEventListener("click", async () => {
    const id = document.getElementById("calendarItemId").value;
    if (!id) return;
    await deleteCalendarItem(id);
    renderCalendar();
    calendarItemModal?.hide();
});

// ======================================================
// STOCKS API
// ======================================================
async function loadStocks() {
    const stockList = document.getElementById("stockList");
    if (!stockList) return;

    const prefs = getDataPrefs();
    let symbols = prefs.stocks.length ? prefs.stocks : DEFAULT_DATA_PREFS.stocks;
    const known = new Set(DATA_CATALOG.stocks.map((s) => s.id));
    symbols = symbols.filter((s) => known.has(String(s).toUpperCase()) || known.has(String(s)));
    if (!symbols.length) symbols = [...DEFAULT_DATA_PREFS.stocks];

    if (!symbols.length) {
        stockList.innerHTML = `<div class="text-secondary text-center py-3">Ayarlar &gt; Sınıflandırmalar bölümünden hisse seç.</div>`;
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/stock?symbols=${encodeURIComponent(symbols.join(","))}`
        );
        if (!response.ok) throw new Error(`API ${response.status} hatası`);

        const payload = await response.json();
        const validStocks = Array.isArray(payload?.quotes) ? payload.quotes : [];
        if (!validStocks.length) throw new Error("Hiçbir hisse verisi alınamadı.");

        const order = new Map(symbols.map((s, i) => [String(s).toUpperCase(), i]));
        validStocks.sort((a, b) => {
            const ai = order.get(String(a?.symbol || "").toUpperCase()) ?? 999;
            const bi = order.get(String(b?.symbol || "").toUpperCase()) ?? 999;
            return ai - bi;
        });

        stockList.innerHTML = "";

        validStocks.forEach((data) => {
            const symbol = data?.symbol || "UNKNOWN";
            const name = data?.name && data.name !== symbol ? data.name : "";
            const price = Number(data?.close ?? 0);
            const change = Number(data?.change ?? 0);
            const isPositive = change >= 0;
            const currency = String(data?.currency || "").toUpperCase();
            const money =
                currency === "TRY" ? "₺"
                    : currency === "USD" ? "$"
                        : currency ? `${currency} ` : "";
            const market = data?.market ? `<span class="badge bg-secondary-lt ms-1">${data.market}</span>` : "";

            const row = document.createElement("div");
            row.className = "d-flex justify-content-between align-items-center py-2 border-bottom last-border-0";
            row.innerHTML = `
                <div>
                    <strong class="d-block fs-4">${symbol}${market}</strong>
                    ${name ? `<span class="text-secondary small">${name}</span>` : ""}
                </div>
                <div class="text-end">
                    <div class="fw-bold fs-4">${money}${price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <span class="badge ${isPositive ? "bg-green-lt" : "bg-red-lt"} small">
                        <i class="ti ${isPositive ? "ti-trending-up" : "ti-trending-down"} me-1"></i>
                        ${isPositive ? "+" : ""}${change.toFixed(2)}%
                    </span>
                </div>
            `;
            stockList.appendChild(row);
        });

        setModuleUpdated("stocks");

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
        const stamp = data.date ? new Date(`${data.date}T12:00:00`) : new Date();
        setModuleUpdated("currency", stamp);
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

        const selectedGold = getDataPrefs().gold;
        const entries = Object.entries(goldData).filter(([symbol]) => selectedGold.includes(symbol));
        if (!entries.length) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-secondary py-4">Ayarlar &gt; Sınıflandırmalar bölümünden altın türü seç.</td></tr>`;
            return;
        }

        entries.forEach(([symbol, item]) => {
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

        setModuleUpdated("gold");

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

        setModuleUpdated("news");
        buildNewsSourceFilters();
        renderNews();
    } catch (error) {
        console.error("Haber hatası:", error);
        allNews = [];
        setModuleUpdated("news");
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
    const cryptoList = document.getElementById("cryptoList");
    if (!cryptoList) return;

    const selected = getDataPrefs().crypto;
    const items = DATA_CATALOG.crypto.filter((item) => selected.includes(item.id));

    if (!items.length) {
        cryptoList.innerHTML = `<div class="list-group-item text-center py-4 text-secondary">Ayarlar &gt; Sınıflandırmalar bölümünden kripto seç.</div>`;
        return;
    }

    cryptoList.innerHTML = items.map((item) => `
        <div class="list-group-item py-3">
            <div class="row align-items-center">
                <div class="col-auto">
                    <span class="avatar ${item.color} rounded-circle">${item.icon}</span>
                </div>
                <div class="col">
                    <strong class="d-block">${item.label}</strong>
                    <span class="text-secondary small">${item.id}</span>
                </div>
                <div class="col-auto text-end" id="crypto-${item.id}">
                    <div class="spinner-border spinner-border-sm"></div>
                </div>
            </div>
        </div>
    `).join("");

    await Promise.all(items.map(async (item) => {
        const target = document.getElementById(`crypto-${item.id}`);
        try {
            const response = await fetch(`${API_URL}/api/crypto/${item.id}`);
            if (!response.ok) throw new Error(`${item.id} ${response.status}`);
            const data = await response.json();
            if (target) target.innerHTML = createCryptoPrice(data);
        } catch (error) {
            console.error("Crypto Error:", error);
            if (target) {
                target.innerHTML = `<span class="text-danger small">Veri alınamadı</span>`;
            }
        }
    }));

    setModuleUpdated("crypto");
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
        handle: ".card-header, .weather-card-shell, .calendar-card-shell",
        ghostClass: "sortable-ghost", // Sürüklenirken kartın arkasında kalan hayalet stil
        dragClass: "sortable-drag",   // Sürüklenen öğenin stili
        onEnd: function () {
            // Yeni sıralamayı kaydet:
            const order = Array.from(gridContainer.children).map(
                (card) => card.dataset.moduleCard
            );
            updateSettings({ card_order: order });
        }
    });

    // Kaydedilmiş sıralamayı geri yükleme
    restoreCardOrder(gridContainer);
}

function restoreCardOrder(container) {
    const savedOrder = getSettings().card_order;
    if (!savedOrder) return;

    savedOrder.forEach((moduleName) => {
        const card = container.querySelector(`[data-module-card="${moduleName}"]`);
        if (card) {
            container.appendChild(card);
        }
    });
}



function applyDashboardSettings() {
    const settings = getSettings();
    applyVisibleModules(settings.modules);
    applyTheme(settings.theme);
    applyAutoLocationSetting(settings.weather_auto_location !== false);
    const gridContainer = document.querySelector(".row-cards");
    if (gridContainer) restoreCardOrder(gridContainer);
    renderClassificationSettings();
}

async function bootstrapDashboard() {
    const user = await getActiveUser();
    await initUserSettings(user);
    applyDashboardSettings();
    initDragAndDrop();
    await initializeWeather();
    await initCalendar();
    loadCurrencyRates();
    loadStocks();
    loadGold();
    loadNews();
    loadCrypto();
}

bootstrapDashboard();