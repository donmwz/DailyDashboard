import { supabase } from "./supabase";

const TABLE = "user_dashboard_settings";

export const DEFAULT_MODULES = [
    "weather",
    "calendar",
    "currency",
    "gold",
    "crypto",
    "stocks",
    "news"
];

export const DEFAULT_DATA_PREFS = {
    gold: ["GA", "C", "Y", "T"],
    crypto: ["BTC", "ETH"],
    stocks: ["AAPL", "THYAO.IS", "MSFT", "GARAN.IS"]
};

const LS_KEYS = {
    theme: "dashboardTheme",
    modules: "dashboardModules",
    order: "dashboardOrder",
    dataPrefs: "dashboardDataPrefs",
    weatherLocation: "weatherLocation",
    weatherAutoLocation: "weatherAutoLocation"
};

function ensureCalendarInModules(modules) {
    const list = Array.isArray(modules) ? [...modules] : [...DEFAULT_MODULES];
    if (list.includes("calendar")) return list;
    const weatherIdx = list.indexOf("weather");
    list.splice(weatherIdx >= 0 ? weatherIdx + 1 : 0, 0, "calendar");
    return list;
}

function ensureCalendarInOrder(order) {
    if (!Array.isArray(order)) return order;
    if (order.includes("calendar")) return [...order];
    const next = [...order];
    const weatherIdx = next.indexOf("weather");
    next.splice(weatherIdx >= 0 ? weatherIdx + 1 : 0, 0, "calendar");
    return next;
}

let cache = null;
let currentUserId = null;
let saveTimer = null;

function cloneDataPrefs(prefs) {
    return {
        gold: Array.isArray(prefs?.gold) ? [...prefs.gold] : [...DEFAULT_DATA_PREFS.gold],
        crypto: Array.isArray(prefs?.crypto) ? [...prefs.crypto] : [...DEFAULT_DATA_PREFS.crypto],
        stocks: Array.isArray(prefs?.stocks) ? [...prefs.stocks] : [...DEFAULT_DATA_PREFS.stocks]
    };
}

export function getDefaultSettings() {
    return {
        theme: "light",
        modules: [...DEFAULT_MODULES],
        card_order: null,
        data_prefs: cloneDataPrefs(DEFAULT_DATA_PREFS),
        weather_location: null,
        weather_auto_location: true
    };
}

function readLocalSnapshot() {
    const defaults = getDefaultSettings();
    let modules = defaults.modules;
    let dataPrefs = defaults.data_prefs;
    let cardOrder = null;
    let weatherLocation = null;
    let weatherAutoLocation = defaults.weather_auto_location;

    try {
        const savedModules = JSON.parse(localStorage.getItem(LS_KEYS.modules));
        if (Array.isArray(savedModules)) modules = ensureCalendarInModules(savedModules);
    } catch {
        /* ignore */
    }

    try {
        const savedPrefs = JSON.parse(localStorage.getItem(LS_KEYS.dataPrefs));
        if (savedPrefs && typeof savedPrefs === "object") {
            dataPrefs = cloneDataPrefs(savedPrefs);
        }
    } catch {
        /* ignore */
    }

    try {
        const savedOrder = JSON.parse(localStorage.getItem(LS_KEYS.order));
        if (Array.isArray(savedOrder)) cardOrder = ensureCalendarInOrder(savedOrder);
    } catch {
        /* ignore */
    }

    try {
        const savedWeather = JSON.parse(localStorage.getItem(LS_KEYS.weatherLocation));
        if (savedWeather && typeof savedWeather === "object") {
            weatherLocation = savedWeather;
        }
    } catch {
        /* ignore */
    }

    const savedAutoLocation = localStorage.getItem(LS_KEYS.weatherAutoLocation);
    if (savedAutoLocation === "true") weatherAutoLocation = true;
    if (savedAutoLocation === "false") weatherAutoLocation = false;

    const theme = localStorage.getItem(LS_KEYS.theme) === "dark" ? "dark" : "light";

    return {
        theme,
        modules,
        card_order: cardOrder,
        data_prefs: dataPrefs,
        weather_location: weatherLocation,
        weather_auto_location: weatherAutoLocation
    };
}

function writeLocalSnapshot(settings) {
    localStorage.setItem(LS_KEYS.theme, settings.theme);
    localStorage.setItem(LS_KEYS.modules, JSON.stringify(settings.modules));
    localStorage.setItem(LS_KEYS.dataPrefs, JSON.stringify(settings.data_prefs));
    if (settings.card_order) {
        localStorage.setItem(LS_KEYS.order, JSON.stringify(settings.card_order));
    } else {
        localStorage.removeItem(LS_KEYS.order);
    }
    if (settings.weather_location) {
        localStorage.setItem(LS_KEYS.weatherLocation, JSON.stringify(settings.weather_location));
    } else {
        localStorage.removeItem(LS_KEYS.weatherLocation);
    }
    localStorage.setItem(LS_KEYS.weatherAutoLocation, String(settings.weather_auto_location !== false));
}

function rowToSettings(row) {
    const weatherLocation = row.weather_location ?? null;
    let weatherAutoLocation = true;

    if (weatherLocation?.type === "city") {
        weatherAutoLocation = false;
    } else if (weatherLocation?.type === "auto") {
        weatherAutoLocation = true;
    } else if (weatherLocation?.type === "gps") {
        weatherAutoLocation = false;
    }

    return {
        theme: row.theme === "dark" ? "dark" : "light",
        modules: ensureCalendarInModules(Array.isArray(row.modules) ? row.modules : [...DEFAULT_MODULES]),
        card_order: ensureCalendarInOrder(Array.isArray(row.card_order) ? row.card_order : null),
        data_prefs: cloneDataPrefs(row.data_prefs),
        weather_location: weatherLocation,
        weather_auto_location: weatherAutoLocation
    };
}

function settingsToRow(userId, settings) {
    return {
        user_id: userId,
        theme: settings.theme,
        modules: settings.modules,
        card_order: settings.card_order,
        data_prefs: settings.data_prefs,
        weather_location: settings.weather_location
    };
}

export function getSettings() {
    return cache ?? readLocalSnapshot();
}

async function persistToSupabase(userId, settings) {
    const { error } = await supabase
        .from(TABLE)
        .upsert(settingsToRow(userId, settings), { onConflict: "user_id" });

    if (error) {
        console.error("Ayarlar kaydedilemedi:", error);
    }
}

function scheduleSave() {
    if (!currentUserId || !cache) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        persistToSupabase(currentUserId, cache);
    }, 400);
}

export async function initUserSettings(user) {
    const userId = user?.id ?? null;

    if (userId === currentUserId && cache) {
        return cache;
    }

    currentUserId = userId;

    if (!userId) {
        cache = readLocalSnapshot();
        return cache;
    }

    const { data, error } = await supabase
        .from(TABLE)
        .select("theme, modules, card_order, data_prefs, weather_location")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Ayarlar yüklenemedi:", error);
        cache = readLocalSnapshot();
        return cache;
    }

    if (data) {
        cache = rowToSettings(data);
        writeLocalSnapshot(cache);
        return cache;
    }

    const local = readLocalSnapshot();
    cache = local;
    await persistToSupabase(userId, local);
    return cache;
}

export function updateSettings(partial) {
    const current = getSettings();
    cache = {
        ...current,
        ...partial,
        data_prefs: partial.data_prefs
            ? cloneDataPrefs(partial.data_prefs)
            : current.data_prefs
    };

    if (currentUserId) {
        scheduleSave();
    } else {
        writeLocalSnapshot(cache);
    }

    return cache;
}

export async function resetSettings() {
    cache = getDefaultSettings();
    writeLocalSnapshot(cache);

    if (currentUserId) {
        await persistToSupabase(currentUserId, cache);
    }
}

export function getDataPrefs() {
    return cloneDataPrefs(getSettings().data_prefs);
}

export function saveDataPrefs(prefs) {
    updateSettings({ data_prefs: prefs });
}
