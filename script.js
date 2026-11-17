"use strict";

/* ========== konfigurasi ========== */
const VERSION = "0.1.0";
const KEYS = { servers: "samp.servers", selected: "samp.selected", settings: "samp.settings" };
const DEFAULTS = { nickname: "", resolution: "1280x720", graphics: "medium", volume: 70, language: "id", remember: true };
const NICK_RE = /^[A-Za-z0-9_\[\]$=@.()]{3,20}$/;
const IPV4_RE = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const HOST_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const VIEWS = ["play", "servers", "settings"];

/* ========== teks (ID / EN) ========== */
const I18N = {
  id: {
    "nav.label": "Menu utama", "nav.play": "PLAY", "nav.servers": "ADD SERVER", "nav.settings": "SETTINGS",
    "play.kicker": "Server terpilih", "play.empty": "Belum ada server terpilih.", "play.addLink": "Tambah server",
    "play.go": "PLAY", "play.nonick": "Atur nickname dulu di SETTINGS.",
    "srv.title": "Daftar server", "srv.add": "ADD SERVER", "srv.empty": "Belum ada server tersimpan. Tekan ADD SERVER untuk menambah yang pertama.",
    "srv.pick": "Pilih", "srv.picked": "Terpilih", "srv.edit": "Edit", "srv.del": "Hapus",
    "dlg.add": "Tambah server", "dlg.edit": "Edit server",
    "f.name": "Server Name", "f.ip": "IP Address", "f.port": "Port", "btn.save": "SAVE", "btn.cancel": "CANCEL",
    "err.name": "Isi nama server, maksimal 40 karakter.", "err.ip": "Masukkan IPv4 (contoh 203.0.113.10) atau nama domain.",
    "err.port": "Port harus angka 1 sampai 65535.", "err.dup": "Server dengan IP dan port ini sudah ada.",
    "err.nick": "Nickname 3 sampai 20 karakter: huruf, angka, dan _ [ ] $ = @ . ( )",
    "del.title": "Hapus server?", "del.body": "{name} akan dihapus dari daftar.", "del.yes": "Hapus",
    "toast.added": "Server {name} ditambahkan.", "toast.edited": "Server {name} diperbarui.", "toast.deleted": "Server {name} dihapus.",
    "toast.applied": "Pengaturan diterapkan.", "toast.reset": "Pengaturan dikembalikan ke bawaan.",
    "toast.copied": "Alamat disalin.", "toast.copyfail": "Gagal menyalin. Salin manual dari kotak alamat.",
    "toast.nostore": "Penyimpanan browser tidak tersedia. Data hilang saat halaman ditutup.",
    "set.title": "Pengaturan", "set.nick": "Nickname", "set.res": "Resolution", "set.gfx": "Graphics", "set.snd": "Sound",
    "set.lang": "Language", "set.remember": "Remember Nickname", "set.apply": "APPLY", "set.reset": "RESET",
    "set.note": "Resolution dan Graphics hanya disimpan sebagai konfigurasi untuk launcher native. Browser tidak bisa mengubahnya di dalam game.",
    "gfx.low": "Rendah", "gfx.med": "Sedang", "gfx.high": "Tinggi",
    "info.title": "Info server", "info.name": "Nama", "info.ip": "IP Address", "info.port": "Port", "info.status": "Status", "info.nick": "Nickname",
    "info.none": "Belum dipilih", "info.nonick": "Belum diatur", "status.unknown": "Belum dicek",
    "status.hint": "Browser tidak bisa menanyai server SA-MP (UDP). Pengecekan status butuh layanan backend.",
    "foot.version": "Launcher v{v} (prototipe tidak resmi)", "foot.on": "Internet: online", "foot.off": "Internet: offline",
    "load.title": "Menyiapkan", "load.s1": "Memeriksa nickname dan pengaturan", "load.s2": "Menyiapkan koneksi ke {addr}", "load.cancel": "Batalkan",
    "res.title": "Peluncuran native belum tersedia", "res.nick": "Nickname", "res.copy": "Salin alamat", "res.close": "Tutup",
    "res.body": "Browser tidak bisa menjalankan GTA SA-MP. Salin alamat server dan nickname, lalu tempel di klien SA-MP kamu."
  },
  en: {
    "nav.label": "Main menu", "nav.play": "PLAY", "nav.servers": "ADD SERVER", "nav.settings": "SETTINGS",
    "play.kicker": "Selected server", "play.empty": "No server selected.", "play.addLink": "Add a server",
    "play.go": "PLAY", "play.nonick": "Set a nickname in SETTINGS first.",
    "srv.title": "Server list", "srv.add": "ADD SERVER", "srv.empty": "No saved servers yet. Press ADD SERVER to add the first one.",
    "srv.pick": "Select", "srv.picked": "Selected", "srv.edit": "Edit", "srv.del": "Delete",
    "dlg.add": "Add server", "dlg.edit": "Edit server",
    "err.name": "Enter a server name, 40 characters max.", "err.ip": "Enter an IPv4 address (e.g. 203.0.113.10) or a domain name.",
    "err.port": "Port must be a number from 1 to 65535.", "err.dup": "A server with this IP and port already exists.",
    "err.nick": "Nickname 3 to 20 characters: letters, digits and _ [ ] $ = @ . ( )",
    "del.title": "Delete server?", "del.body": "{name} will be removed from the list.", "del.yes": "Delete",
    "toast.added": "Server {name} added.", "toast.edited": "Server {name} updated.", "toast.deleted": "Server {name} deleted.",
    "toast.applied": "Settings applied.", "toast.reset": "Settings restored to defaults.",
    "toast.copied": "Address copied.", "toast.copyfail": "Copy failed. Copy it manually from the address box.",
    "toast.nostore": "Browser storage is unavailable. Data is lost when the page closes.",
    "set.title": "Settings",
    "set.note": "Resolution and Graphics are only stored as configuration for a native launcher. A browser cannot change them inside the game.",
    "gfx.low": "Low", "gfx.med": "Medium", "gfx.high": "High",
    "info.title": "Server info", "info.name": "Name", "info.none": "Not selected", "info.nonick": "Not set", "status.unknown": "Not checked",
    "status.hint": "A browser cannot query SA-MP servers (UDP). Status checks need a backend service.",
    "foot.version": "Launcher v{v} (unofficial prototype)", "foot.on": "Internet: online", "foot.off": "Internet: offline",
    "load.title": "Preparing", "load.s1": "Checking nickname and settings", "load.s2": "Preparing connection to {addr}", "load.cancel": "Cancel",
    "res.title": "Native launch is not available yet", "res.copy": "Copy address", "res.close": "Close",
    "res.body": "A browser cannot start GTA SA-MP. Copy the server address and nickname, then paste them into your SA-MP client."
  }
};

/* ========== helper ========== */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  n.append(...kids);
  return n;
};
const icon = (cls) => el("i", { class: "fa-solid " + cls, "aria-hidden": "true" });
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

let storeWarned = false;
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch {
      if (!storeWarned) { storeWarned = true; toast(t("toast.nostore")); }
      return false;
    }
  }
};

/* ========== state ========== */
const loadedServers = store.get(KEYS.servers, []);
const state = {
  servers: Array.isArray(loadedServers)
    ? loadedServers.filter((s) => s && typeof s.id === "string" && typeof s.name === "string" && typeof s.ip === "string" && Number.isInteger(s.port))
    : [],
  selected: store.get(KEYS.selected, null),
  settings: { ...DEFAULTS, ...store.get(KEYS.settings, {}) }
};
if (!state.servers.some((s) => s.id === state.selected)) state.selected = state.servers[0]?.id ?? null;

const current = () => state.servers.find((s) => s.id === state.selected) || null;
const t = (key, vars = {}) => {
  const raw = I18N[state.settings.language]?.[key] ?? I18N.id[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ""));
};

/* ========== render ========== */
function applyI18n() {
  document.documentElement.lang = state.settings.language;
  document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll("[data-i18n-label]").forEach((n) => n.setAttribute("aria-label", t(n.dataset.i18nLabel)));
}

function renderPlay() {
  const s = current();
  $("#playName").textContent = s ? s.name : "";
  $("#playAddr").textContent = s ? `${s.ip}:${s.port}` : "";
  $("#playBtn").hidden = !s;
  $("#playEmpty").hidden = !!s;
  $("#playName").hidden = !s;
  $("#playAddr").hidden = !s;
}

function renderInfo() {
  const s = current();
  $("#infoName").textContent = s ? s.name : t("info.none");
  $("#infoIp").textContent = s ? s.ip : "-";
  $("#infoPort").textContent = s ? String(s.port) : "-";
  $("#infoStatus").textContent = s ? t("status.unknown") : "-";
  $("#infoNick").textContent = state.settings.nickname || t("info.nonick");
}

function renderList() {
  const ul = $("#serverList");
  ul.replaceChildren();
  $("#serverEmpty").hidden = state.servers.length > 0;
  for (const s of state.servers) {
    const picked = s.id === state.selected;
    ul.append(el("li", { class: "row" + (picked ? " is-picked" : "") },
      el("div", { class: "row-main" }, el("strong", {}, s.name), el("span", { class: "mono" }, `${s.ip}:${s.port}`)),
      el("div", { class: "row-actions" },
        el("button", { type: "button", class: "btn" + (picked ? " btn-on" : ""), "aria-pressed": String(picked), onclick: () => selectServer(s.id) },
          icon("fa-check"), t(picked ? "srv.picked" : "srv.pick")),
        el("button", { type: "button", class: "btn", "aria-label": `${t("srv.edit")} ${s.name}`, onclick: () => openServerDialog(s) },
          icon("fa-pen"), t("srv.edit")),
        el("button", { type: "button", class: "btn", "aria-label": `${t("srv.del")} ${s.name}`, onclick: () => askDelete(s) },
          icon("fa-trash"), t("srv.del")))));
  }
}

function renderFooter() {
  $("#footVersion").textContent = t("foot.version", { v: VERSION });
  $("#footNet").textContent = t(navigator.onLine ? "foot.on" : "foot.off");
}

function renderAll() {
  applyI18n();
  renderPlay();
  renderInfo();
  renderList();
  renderFooter();
}

function toast(msg) {
  const n = el("p", { class: "toast" }, msg);
  $("#toasts").append(n);
  setTimeout(() => n.remove(), 3600);
}

/* ========== routing (hash, tombol Back Android ikut bekerja) ========== */
let firstRoute = true;
function route() {
  const hash = location.hash.slice(1);
  const id = VIEWS.includes(hash) ? hash : "play";
  VIEWS.forEach((v) => { $("#" + v).hidden = v !== id; });
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (!firstRoute) {
    const heading = $("#" + id).querySelector("h2");
    if (heading && !heading.hidden) heading.focus({ preventScroll: true });
    $("#main").scrollTo({ top: 0 });
  }
  firstRoute = false;
}

/* ========== server: tambah, edit, hapus ========== */
const serverDialog = $("#serverDialog");
const serverForm = $("#serverForm");
let editingId = null;

function persistServers() {
  store.set(KEYS.servers, state.servers);
  store.set(KEYS.selected, state.selected);
}

function selectServer(id) {
  state.selected = id;
  persistServers();
  renderAll();
}

function setFieldError(input, errEl, message) {
  errEl.hidden = !message;
  if (message) errEl.textContent = message;
  if (message) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
}

function openServerDialog(server) {
  editingId = server ? server.id : null;
  $("#serverDialogTitle").textContent = t(server ? "dlg.edit" : "dlg.add");
  $("#sName").value = server ? server.name : "";
  $("#sIp").value = server ? server.ip : "";
  $("#sPort").value = server ? String(server.port) : "7777";
  [["#sName", "#sNameErr"], ["#sIp", "#sIpErr"], ["#sPort", "#sPortErr"]].forEach(([i, e]) => setFieldError($(i), $(e), ""));
  serverDialog.showModal();
  $("#sName").focus();
}

serverForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#sName").value.trim();
  const ip = $("#sIp").value.trim();
  const portText = $("#sPort").value.trim();
  const port = /^\d+$/.test(portText) ? Number(portText) : NaN;

  const nameBad = !name || name.length > 40;
  const ipBad = !(IPV4_RE.test(ip) || HOST_RE.test(ip));
  const portBad = !Number.isInteger(port) || port < 1 || port > 65535;
  const dup = !ipBad && !portBad && state.servers.some((s) => s.id !== editingId && s.ip.toLowerCase() === ip.toLowerCase() && s.port === port);

  setFieldError($("#sName"), $("#sNameErr"), nameBad ? t("err.name") : "");
  setFieldError($("#sIp"), $("#sIpErr"), ipBad ? t("err.ip") : "");
  setFieldError($("#sPort"), $("#sPortErr"), portBad ? t("err.port") : dup ? t("err.dup") : "");
  if (nameBad || ipBad || portBad || dup) {
    serverForm.querySelector("[aria-invalid='true']")?.focus();
    return;
  }

  if (editingId) {
    const s = state.servers.find((x) => x.id === editingId);
    Object.assign(s, { name, ip, port });
    toast(t("toast.edited", { name }));
  } else {
    const s = { id: newId(), name, ip, port };
    state.servers.push(s);
    if (!state.selected) state.selected = s.id;
    toast(t("toast.added", { name }));
  }
  persistServers();
  serverDialog.close();
  renderAll();
});

$("#addBtn").addEventListener("click", () => openServerDialog(null));
$("#sCancel").addEventListener("click", () => serverDialog.close());

const confirmDialog = $("#confirmDialog");
let pendingDelete = null;
function askDelete(server) {
  pendingDelete = server;
  $("#confirmBody").textContent = t("del.body", { name: server.name });
  confirmDialog.showModal();
  $("#confirmNo").focus();
}
$("#confirmNo").addEventListener("click", () => confirmDialog.close());
$("#confirmYes").addEventListener("click", () => {
  if (!pendingDelete) return;
  const { id, name } = pendingDelete;
  state.servers = state.servers.filter((s) => s.id !== id);
  if (state.selected === id) state.selected = state.servers[0]?.id ?? null;
  pendingDelete = null;
  persistServers();
  confirmDialog.close();
  renderAll();
  toast(t("toast.deleted", { name }));
});

/* ========== settings ========== */
const settingsForm = $("#settingsForm");

function fillSettings() {
  const s = state.settings;
  $("#nickname").value = s.nickname;
  $("#resolution").value = s.resolution;
  $("#graphics").value = s.graphics;
  $("#volume").value = String(s.volume);
  $("#volumeOut").textContent = `${s.volume}%`;
  $("#language").value = s.language;
  $("#remember").checked = s.remember;
  setFieldError($("#nickname"), $("#nickErr"), "");
}

function persistSettings() {
  const s = state.settings;
  store.set(KEYS.settings, { ...s, nickname: s.remember ? s.nickname : "" });
}

$("#volume").addEventListener("input", (e) => { $("#volumeOut").textContent = `${e.target.value}%`; });

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nickname = $("#nickname").value.trim();
  if (nickname && !NICK_RE.test(nickname)) {
    setFieldError($("#nickname"), $("#nickErr"), t("err.nick"));
    $("#nickname").focus();
    return;
  }
  state.settings = {
    nickname,
    resolution: $("#resolution").value,
    graphics: $("#graphics").value,
    volume: Number($("#volume").value),
    language: $("#language").value,
    remember: $("#remember").checked
  };
  persistSettings();
  renderAll();
  fillSettings();
  toast(t("toast.applied"));
});

$("#resetBtn").addEventListener("click", () => {
  state.settings = { ...DEFAULTS };
  persistSettings();
  renderAll();
  fillSettings();
  toast(t("toast.reset"));
});

/* ========== PLAY ========== */
const loadDialog = $("#loadDialog");
const resultDialog = $("#resultDialog");
let playToken = 0;

/**
 * Titik integrasi launcher native.
 * TODO: sambungkan ke launcher native (WebView bridge atau custom URL scheme) saat tersedia.
 * Kontrak: terima { host, port, nickname, resolution, graphics, volume }, kembalikan { ok: boolean }.
 * Selama belum tersambung, fungsi ini jujur mengembalikan ok: false.
 */
async function launchNative(payload) { // eslint-disable-line no-unused-vars
  return { ok: false };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function startPlay() {
  const server = current();
  if (!server) return;
  if (!state.settings.nickname) {
    toast(t("play.nonick"));
    location.hash = "#settings";
    return;
  }
  const token = ++playToken;
  const bar = $("#loadBar");
  bar.style.width = "0%";
  $("#loadMsg").textContent = t("load.s1");
  loadDialog.showModal();
  requestAnimationFrame(() => { bar.style.width = "45%"; });
  await wait(800);
  if (token !== playToken) return;

  $("#loadMsg").textContent = t("load.s2", { addr: `${server.ip}:${server.port}` });
  bar.style.width = "90%";
  await wait(1000);
  if (token !== playToken) return;

  const { resolution, graphics, volume, nickname } = state.settings;
  const result = await launchNative({ host: server.ip, port: server.port, nickname, resolution, graphics, volume });
  if (token !== playToken) return;
  loadDialog.close();
  if (!result.ok) showResult(server);
}

function showResult(server) {
  $("#resAddr").value = `${server.ip}:${server.port}`;
  $("#resNick").value = state.settings.nickname;
  resultDialog.showModal();
  $("#resCopy").focus();
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = el("textarea", { readonly: "", class: "sr-only" });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

$("#playBtn").addEventListener("click", startPlay);
$("#loadCancel").addEventListener("click", () => { playToken++; loadDialog.close(); });
loadDialog.addEventListener("cancel", () => { playToken++; });
$("#resClose").addEventListener("click", () => resultDialog.close());
$("#resCopy").addEventListener("click", async () => {
  const ok = await copyText($("#resAddr").value);
  toast(t(ok ? "toast.copied" : "toast.copyfail"));
});

/* ========== init ========== */
window.addEventListener("hashchange", route);
window.addEventListener("online", renderFooter);
window.addEventListener("offline", renderFooter);
renderAll();
fillSettings();
route();
