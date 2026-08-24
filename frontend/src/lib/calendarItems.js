import { supabase } from "./supabase";

const TABLE = "user_calendar_items";
const LS_KEY = "dashboardCalendarItems";

export const CALENDAR_TYPES = {
    event: { label: "Etkinlik", color: "#2563eb" },
    task: { label: "Görev", color: "#ea580c" },
    todo: { label: "Yapılacak", color: "#059669" }
};

let cache = [];
let currentUserId = null;
let saveTimer = null;

function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function normalizeItem(item) {
    const type = ["event", "task", "todo"].includes(item?.type) ? item.type : "event";
    return {
        id: isUuid(item?.id) ? item.id : createLocalId(),
        title: String(item.title || "").trim(),
        type,
        date: item.date || "",
        time: item.time || "",
        notify: Boolean(item.notify),
        done: Boolean(item.done),
        notifiedAt: item.notifiedAt || item.notified_at || null
    };
}

function createLocalId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `cal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readLocal() {
    try {
        const primary = JSON.parse(localStorage.getItem(LS_KEY));
        if (Array.isArray(primary) && primary.length) {
            return primary.map(normalizeItem);
        }
    } catch {
        /* ignore */
    }

    // Eski ayar deposundan taşı
    try {
        const legacy = JSON.parse(localStorage.getItem("calendarItems"));
        if (Array.isArray(legacy) && legacy.length) {
            const migrated = legacy.map(normalizeItem);
            writeLocal(migrated);
            return migrated;
        }
    } catch {
        /* ignore */
    }

    return [];
}

function writeLocal(items) {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function rowToItem(row) {
    return normalizeItem({
        id: row.id,
        title: row.title,
        type: row.type,
        date: row.date,
        time: row.time || "",
        notify: row.notify,
        done: row.done,
        notifiedAt: row.notified_at
    });
}

function itemToRow(userId, item) {
    return {
        id: item.id,
        user_id: userId,
        title: item.title,
        type: item.type,
        date: item.date,
        time: item.time || null,
        notify: item.notify,
        done: item.done,
        notified_at: item.notifiedAt
    };
}

export function getCalendarItems() {
    return cache.map((item) => ({ ...item }));
}

export async function initCalendarStore(user) {
    const userId = user?.id ?? null;
    currentUserId = userId;

    if (!userId) {
        cache = readLocal();
        return getCalendarItems();
    }

    const { data, error } = await supabase
        .from(TABLE)
        .select("id, title, type, date, time, notify, done, notified_at")
        .eq("user_id", userId)
        .order("date", { ascending: true });

    if (error) {
        console.error("Takvim yüklenemedi:", error);
        cache = readLocal();
        return getCalendarItems();
    }

    if (Array.isArray(data) && data.length) {
        cache = data.map(rowToItem);
        writeLocal(cache);
        return getCalendarItems();
    }

    // İlk giriş: local kayıtları DB'ye taşı
    const local = readLocal();
    if (local.length) {
        cache = local;
        await persistAll(userId, local);
        return getCalendarItems();
    }

    cache = [];
    return getCalendarItems();
}

async function persistAll(userId, items) {
    const { error: deleteError } = await supabase
        .from(TABLE)
        .delete()
        .eq("user_id", userId);

    if (deleteError) {
        console.error("Takvim temizlenemedi:", deleteError);
        return;
    }

    if (!items.length) return;

    const { error } = await supabase
        .from(TABLE)
        .upsert(items.map((item) => itemToRow(userId, item)), { onConflict: "id" });

    if (error) {
        console.error("Takvim kaydedilemedi:", error);
    }
}

function schedulePersist() {
    writeLocal(cache);
    if (!currentUserId) return;

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        persistAll(currentUserId, cache);
    }, 400);
}

export function saveCalendarItems(items) {
    cache = (Array.isArray(items) ? items : []).map(normalizeItem);
    schedulePersist();
    return getCalendarItems();
}

export async function upsertCalendarItem(partial) {
    const item = normalizeItem(partial);
    const index = cache.findIndex((entry) => entry.id === item.id);

    if (index >= 0) {
        cache[index] = { ...cache[index], ...item };
    } else {
        cache.push(item);
    }

    schedulePersist();
    return { ...cache[index >= 0 ? index : cache.length - 1] };
}

export async function deleteCalendarItem(id) {
    cache = cache.filter((item) => item.id !== id);
    schedulePersist();
}

export function getTypeMeta(type) {
    return CALENDAR_TYPES[type] || CALENDAR_TYPES.event;
}
