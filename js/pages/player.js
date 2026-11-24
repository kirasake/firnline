/* player.js — профиль игрока: шапка, место в общем рейтинге, статистика по каждой игре. */
(function (root) {
  "use strict";
  var GP = root.GP, UI = root.GPUI, D = root.GP_DATA || {};
  if (!GP || !UI) return;
  var el = UI.el;
  var games = D.games || [], players = D.players || [];
  var siteName = (D.site && D.site.name) || "";

  UI.mount({ page: "player" });

  var host = document.querySelector("[data-profile]");
  var title = document.getElementById("page-title");
  if (!host) return;

  var query = GP.parseQuery(root.location.search);
  var player = GP.findPlayer(players, query.id);

  if (!player) {
    document.title = "Игрок не найден — " + siteName;
    host.appendChild(UI.emptyState("Игрок не найден", "К списку игроков", "players.html"));
    return;
  }

  if (title) { title.textContent = player.nick; title.appendChild(UI.tm()); }
  document.title = player.nick + " — " + siteName;

  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
    return m ? m[3] + "." + m[2] + "." + m[1] : String(iso);
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  function fact(k, v) {
    return el("div", null,
      el("dt", { class: "label", style: { display: "inline" } }, k + ": "),
      el("dd", { class: "mono", style: { display: "inline", margin: "0", "font-size": "12px", "letter-spacing": ".08em" } }, v));
  }

  var own = games.filter(function (g) { return player.stats && player.stats[g.id]; });
  var main = GP.gameById(games, player.mainGame);
  var place = GP.overallPlace(players, player.id);
  var active = GP.gameById(own, query.game) ? query.game : (player.stats[player.mainGame] ? player.mainGame : (own[0] && own[0].id));

  host.appendChild(el("div", { class: "profile-head" },
    UI.avatar(player, 168),
    el("div", null,
      UI.bracket("PLAYER / " + player.id.toUpperCase(), "label--strong"),
      el("dl", { class: "profile-head__facts", style: { margin: "16px 0 0" } },
        fact("СТРАНА", player.country),
        fact("ОСНОВНАЯ ИГРА", main ? main.name : player.mainGame),
        fact("РЕГИСТРАЦИЯ", fmtDate(player.joined)))),
    el("div", { class: "profile-place" },
      el("span", { class: "label" }, "[ МЕСТО В ОБЩЕМ РЕЙТИНГЕ ]"),
      el("span", { class: "profile-place__num", "aria-label": "Место " + place + " из " + players.length }, pad(place || 0)),
      el("span", { class: "label" }, "ОЧКИ: " + GP.totalRating(player) + " / ИЗ " + pad(players.length)))));

  var panel = el("div", { "aria-live": "polite" });
  function sync() {
    try {
      root.history.replaceState(null, "", root.location.pathname + "?id=" + encodeURIComponent(player.id) + "&game=" + encodeURIComponent(active));
    } catch (e) { /* адрес не меняем, если браузер не даёт */ }
  }

  host.appendChild(el("section", { class: "profile-games", "aria-labelledby": "stats-title" },
    el("div", { class: "section-head", style: { "margin-bottom": "0" } },
      el("div", { class: "section-head__meta" },
        UI.bracket("02 / STATS BY GAME", "label--strong"),
        el("h2", { class: "h3", id: "stats-title" }, "Статистика по играм")),
      el("div", { class: "section-head__aside" },
        own.length ? UI.gameSwitch(own, active, function (id) { active = id; sync(); renderStats(); }, { label: "Игра профиля" }) : null)),
    panel));

  function stat(label, value) {
    return el("div", { class: "stat" },
      el("dt", { class: "label" }, label),
      el("dd", { class: "stat__value", style: { margin: "0" } }, String(value)));
  }

  function renderStats() {
    panel.textContent = "";
    var g = GP.gameById(games, active);
    var s = g && player.stats[g.id];
    if (!s) { panel.appendChild(UI.emptyState("Нет данных по играм")); return; }
    var rows = GP.rankPlayers(players, g.id, "rating", "desc");
    var mine = rows.filter(function (r) { return r.player.id === player.id; })[0];
    panel.appendChild(el("p", { class: "label", style: { "margin-bottom": "16px" } },
      "[ " + g.name + " / МЕСТО В ИГРЕ: " + (mine ? pad(mine.place) : "—") + " ИЗ " + pad(rows.length) + " ]"));
    panel.appendChild(el("dl", { class: "stat-grid", style: { margin: "0" } },
      stat("МАТЧИ", s.matches),
      stat("ПОБЕДЫ", s.wins),
      stat("ВИНРЕЙТ", GP.formatPct(GP.winrate(s))),
      stat(g.ratioLabel, GP.formatRatio(GP.ratio(s, g.id))),
      stat("ЧАСЫ", s.hours),
      stat("ОЧКИ", s.rating)));
    if (!(Number(s.matches) > 0)) {
      panel.appendChild(el("p", { class: "label profile-note" }, "[ МАТЧЕЙ ЕЩЁ НЕТ — ВИНРЕЙТ И " + g.ratioLabel + " НЕ СЧИТАЮТСЯ ]"));
    }
  }

  renderStats();
})(typeof self !== "undefined" ? self : this);
